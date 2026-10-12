(function () {
    'use strict';

    const KEYS = {
        patients: 'labServicePatients_v1',
        draft: 'followupVisitDraft_v1',
        submitted: 'followupVisitSubmitted_v1',
        counter: 'followupVisitCounter_v1',
        context: 'followupContext_v1'
    };

    const DASH = '\u2014';
    const TOTAL = 6;
    const MULTI = ['symptoms', 'medChanges', 'lifestyle'];
    const SYNC = ['planInterval', 'planDate'];
    const ONFILE_FIELDS = ['dob', 'mrn', 'phone', 'insurance'];
    const INTERVAL_STEP = { w1: [0, 7], w2: [0, 14], m1: [1, 0], m3: [3, 0], m6: [6, 0], m12: [12, 0] };

    const PILL = {
        Continuing: 'ok', Reviewed: 'ok', Completed: 'ok',
        New: 'info', Ordered: 'info', Planned: 'info', Scheduled: 'info',
        'Dose changed': 'warn', Pending: 'warn',
        Stopped: 'muted', Cancelled: 'muted'
    };

    const ENTRY = {
        med: {
            list: 'meds', noun: 'medication', add: 'Add Medication',
            fields: [
                { k: 'name', l: 'Medication', req: true, max: 80 },
                { k: 'dose', l: 'Dose', req: true, max: 40, ph: 'e.g. 10 mg' },
                { k: 'frequency', l: 'Frequency', req: true, max: 60, ph: 'e.g. Once daily', opts: ['Once daily', 'Twice daily', 'Three times daily', 'At bedtime', 'As needed'] },
                { k: 'status', l: 'Status', t: 'select', req: true, opts: ['Continuing', 'New', 'Dose changed', 'Stopped'] },
                { k: 'note', l: 'Notes (optional)', max: 120 }
            ]
        },
        lab: {
            list: 'labs', noun: 'test or imaging', add: 'Add Test',
            fields: [
                { k: 'name', l: 'Test or imaging', req: true, max: 80 },
                { k: 'kind', l: 'Type', t: 'select', req: true, opts: ['Blood test', 'Imaging', 'Other'] },
                { k: 'date', l: 'Date', t: 'date', req: true },
                { k: 'result', l: 'Result', max: 120 },
                { k: 'status', l: 'Status', t: 'select', req: true, opts: ['Ordered', 'Pending', 'Reviewed', 'Cancelled'] }
            ]
        },
        plan: {
            list: 'planTests', noun: 'test or assessment', add: 'Add Test',
            fields: [
                { k: 'name', l: 'Test or assessment', req: true, max: 80 },
                { k: 'reason', l: 'Reason', max: 120 },
                { k: 'expected', l: 'Expected date', max: 60, ph: 'e.g. At next visit', opts: ['At next visit', 'Before next visit'] },
                { k: 'status', l: 'Status', t: 'select', req: true, opts: ['Planned', 'Scheduled', 'Completed', 'Cancelled'] }
            ]
        }
    };

    const state = {
        step: 1,
        completed: {},
        meds: [],
        labs: [],
        planTests: [],
        onFile: [],
        patientId: null,
        dateManual: false,
        submitted: false,
        reference: null,
        status: 'New',
        lastUnit: 'F'
    };

    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    const form = $('#fuForm');
    const backBtn = $('#backBtn');
    const continueBtn = $('#continueBtn');
    const patients = readJson(KEYS.patients, []);

    let lastFocus = null;
    let dialogSubmit = null;

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            return false;
        }
    }

    function esc(value) {
        return String(value === undefined || value === null ? '' : value).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function val(value) {
        const text = String(value === undefined || value === null ? '' : value).trim();
        return text ? esc(text) : DASH;
    }

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function toISO(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function todayISO() {
        return toISO(new Date());
    }

    function parseISO(str) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(str || '')) return null;
        const [y, m, d] = str.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const ok = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
        return ok ? date : null;
    }

    function fmtDate(str) {
        const date = parseISO(str);
        if (!date) return str || '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function fmtDateTime(date) {
        return date.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    function addInterval(iso, code) {
        const base = parseISO(iso);
        const step = INTERVAL_STEP[code];
        if (!base || !step) return '';
        const [months, days] = step;
        let result;
        if (months) {
            result = new Date(base.getFullYear(), base.getMonth() + months, base.getDate());
            if (result.getDate() !== base.getDate()) {
                result = new Date(base.getFullYear(), base.getMonth() + months + 1, 0);
            }
        } else {
            result = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
        }
        return toISO(result);
    }

    function isNum(v) {
        return v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v));
    }

    function optText(name, value) {
        if (!value) return '';
        const select = $(`select[name="${name}"]`, form);
        if (!select) return value;
        const option = Array.from(select.options).find(o => o.value === value);
        return option ? option.textContent : value;
    }

    function collect() {
        const d = {};
        $$('[name]', form).forEach(el => {
            const n = el.name;
            if (el.type === 'radio') {
                if (el.checked) d[n] = el.value;
                else if (!(n in d)) d[n] = '';
            } else if (el.type === 'checkbox') {
                if (MULTI.includes(n)) {
                    d[n] = d[n] || [];
                    if (el.checked) d[n].push(el.value);
                } else {
                    d[n] = el.checked;
                }
            } else if (!(n in d) || d[n] === '') {
                d[n] = el.value;
            }
        });
        return d;
    }

    function cleanData(source) {
        const d = Object.assign({}, source);
        if (!(d.symptoms || []).includes('Other')) d.symptomOther = '';
        if (d.treatAdherence !== 'No') d.treatAdherenceNote = '';
        const changes = d.medChanges || [];
        if (!changes.length || changes.includes('No Changes')) d.medChangeDetails = '';
        if (!['Mostly', 'No'].includes(d.medAdherence)) d.medAdherenceNote = '';
        return d;
    }

    function apply(d) {
        $$('[name]', form).forEach(el => {
            const v = d[el.name];
            if (v === undefined) return;
            if (el.type === 'radio') el.checked = el.value === v;
            else if (el.type === 'checkbox') el.checked = Array.isArray(v) ? v.includes(el.value) : !!v;
            else el.value = v;
        });
        state.lastUnit = d.tempUnit || 'F';
        updateCounters();
    }

    function updateCounters() {
        $$('textarea[maxlength]', form).forEach(area => {
            let counter = area.nextElementSibling;
            if (!counter || !counter.classList.contains('notes-count')) {
                counter = document.createElement('div');
                counter.className = 'notes-count';
                area.insertAdjacentElement('afterend', counter);
            }
            counter.textContent = `${area.value.length}/${area.maxLength}`;
        });
    }

    function setHidden(key, hidden) {
        $$(`[data-field="${key}"]`, form).forEach(el => { el.hidden = hidden; });
    }

    function refreshConditional() {
        const d = collect();
        setHidden('symptomOther', !d.symptoms.includes('Other'));
        setHidden('treatAdherenceNote', d.treatAdherence !== 'No');
        setHidden('medChangeDetails', !d.medChanges.length || d.medChanges.includes('No Changes'));
        setHidden('medAdherenceNote', !['Mostly', 'No'].includes(d.medAdherence));
        updateBmi(d);
    }

    function calcBmi(h, w) {
        if (!isNum(h) || !isNum(w)) return null;
        const hn = Number(h);
        const wn = Number(w);
        if (hn < 30 || hn > 250 || wn < 1 || wn > 500) return null;
        const meters = hn / 100;
        return Math.round((wn / (meters * meters)) * 10) / 10;
    }

    function updateBmi(d) {
        const bmi = calcBmi(d.height, d.weight);
        $('#fuBmi').value = bmi === null ? '' : bmi.toFixed(1);
    }

    function exclusive(el, noneValue) {
        if (!el.checked) return;
        $$(`input[name="${el.name}"]`, form).forEach(other => {
            if (other === el) return;
            if (el.value === noneValue) other.checked = false;
            else if (other.value === noneValue) other.checked = false;
        });
    }

    function autoDate() {
        if (state.dateManual) return;
        const d = collect();
        const base = parseISO(d.visitDate) ? d.visitDate : todayISO();
        const next = addInterval(base, d.planInterval);
        $$('[name="planDate"]', form).forEach(el => { el.value = next; });
    }

    function convertTemp(unit) {
        const input = $('#fuTemp');
        const from = state.lastUnit;
        if (from !== unit && isNum(input.value)) {
            const n = Number(input.value);
            const converted = unit === 'C' ? (n - 32) * 5 / 9 : n * 9 / 5 + 32;
            input.value = String(Math.round(converted * 10) / 10);
        }
        state.lastUnit = unit;
    }

    function onFieldEvent(e) {
        const el = e.target;
        if (!el.name || !form.contains(el)) return;

        clearError(el);

        if (SYNC.includes(el.name)) {
            $$(`[name="${el.name}"]`, form).forEach(other => { other.value = el.value; });
        }

        if (el.name === 'symptoms') exclusive(el, 'No Symptoms');
        if (el.name === 'medChanges') exclusive(el, 'No Changes');

        if (el.name === 'noMedications' && el.checked && state.meds.length) {
            el.checked = false;
        }

        if (el.name === 'planInterval') {
            autoDate();
        }

        if (el.name === 'planDate') {
            state.dateManual = el.value !== '';
            if (!state.dateManual) autoDate();
        }

        if (el.name === 'visitDate') autoDate();
        if (el.name === 'tempUnit') convertTemp(el.value);

        if (ONFILE_FIELDS.includes(el.name) && e.type === 'input') {
            state.onFile = state.onFile.filter(n => n !== el.name);
            renderOnFile();
        }

        if (el.name === 'fullName' && e.type === 'change') matchPatient();

        if (el.matches('textarea[maxlength]')) updateCounters();

        refreshConditional();
    }

    function renderOnFile() {
        $$('[data-field]', form).forEach(w => {
            const key = w.dataset.field;
            w.classList.toggle('fu-onfile', state.onFile.includes(key));
        });
    }

    function fillPatientList() {
        const list = $('#fuPatientList');
        list.innerHTML = patients.map(p => `<option value="${esc(`${p.firstName} ${p.lastName}`)}"></option>`).join('');
    }

    function matchPatient() {
        const typed = $('#fuFullName').value.trim().toLowerCase();
        const p = patients.find(x => `${x.firstName} ${x.lastName}`.toLowerCase() === typed);
        const setVal = (name, value) => { $(`[name="${name}"]`, form).value = value || ''; };

        if (p) {
            state.patientId = p.id;
            setVal('dob', p.dob);
            setVal('mrn', p.mrn);
            setVal('phone', p.phone);
            setVal('insurance', p.insurance);
            state.onFile = ONFILE_FIELDS.filter(n => $(`[name="${n}"]`, form).value);
            $('[name="patientConfirmed"]', form).checked = false;
        } else if (state.patientId) {
            state.onFile.forEach(n => setVal(n, ''));
            state.onFile = [];
            state.patientId = null;
            $('[name="patientConfirmed"]', form).checked = false;
        }

        renderOnFile();
        renderSummary();
    }

    function contextFor() {
        if (!state.patientId) return {};
        const all = readJson(KEYS.context, {});
        return all[state.patientId] || {};
    }

    function renderSummary() {
    const ctx = contextFor();

    const set = (id, value, fallback) => {
        $(id).textContent =
            value && String(value).trim() ? value : fallback;
    };

    set('#sumLastVisit', ctx.lastVisit ? fmtDate(ctx.lastVisit) : '', 'Oct 02, 2026');
    set('#sumProvider', ctx.provider, 'Dr. Ananya Sen');
    set('#sumDiagnosis', ctx.diagnosis, 'Hypertension');
    set('#sumStatus', ctx.status, 'Stable');
}

   function renderBadge() {
    const badge = $('#fuBadge');

    if (state.reference) {
        badge.textContent = state.reference;
        badge.hidden = false;
    } else if (state.status === 'Draft') {
        badge.hidden = true;
    } else {
        badge.textContent = 'New visit';
        badge.hidden = false;
    }
}

    function pill(status) {
        return `<span class="fu-pill is-${PILL[status] || 'info'}">${esc(status)}</span>`;
    }

    function sub(text) {
        return text ? `<small>${esc(text)}</small>` : '';
    }

    function actionBtns(kind, i, name, acts) {
        const defs = {
            view: ['View', '<img src="images/view.png" alt="">'],
            edit: ['Edit', '<img src="images/edit-blue.png" alt="">'],
            remove: ['Remove', '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v6M14 11v6"/></svg>']
        };
        return acts.map(a => `<button type="button" class="fu-icon-btn" data-act="${a}" data-kind="${kind}" data-i="${i}" aria-label="${defs[a][0]} ${esc(name)}" title="${defs[a][0]}">${defs[a][1]}</button>`).join('');
    }

    function emptyRow(cols, text) {
        return `<tr><td colspan="${cols}" class="fu-empty">${text}</td></tr>`;
    }

    function renderTables() {
        $('#fuMedBody').innerHTML = state.meds.length
            ? state.meds.map((m, i) => `<tr><td><strong>${esc(m.name)}</strong>${sub(m.note)}</td><td>${esc(m.dose)}</td><td>${esc(m.frequency)}</td><td>${pill(m.status)}</td><td class="fu-actions">${actionBtns('med', i, m.name, ['edit', 'remove'])}</td></tr>`).join('')
            : emptyRow(5, 'No medications added yet.');

        $('#fuLabBody').innerHTML = state.labs.length
            ? state.labs.map((r, i) => `<tr><td><strong>${esc(r.name)}</strong>${sub(r.kind)}</td><td>${esc(fmtDate(r.date))}</td><td>${r.result ? esc(r.result) : DASH}</td><td>${pill(r.status)}</td><td class="fu-actions">${actionBtns('lab', i, r.name, ['view', 'edit', 'remove'])}</td></tr>`).join('')
            : emptyRow(5, 'No tests or imaging recorded yet.');

        $('#fuPlanBody').innerHTML = state.planTests.length
            ? state.planTests.map((r, i) => `<tr><td><strong>${esc(r.name)}</strong></td><td>${r.reason ? esc(r.reason) : DASH}</td><td>${r.expected ? esc(r.expected) : DASH}</td><td>${pill(r.status)}</td><td class="fu-actions">${actionBtns('plan', i, r.name, ['edit', 'remove'])}</td></tr>`).join('')
            : emptyRow(5, 'No tests or assessments planned yet.');
    }

    function focusables(root) {
        return $$('button, input, select, textarea, a[href]', root).filter(x => !x.disabled && x.offsetParent !== null);
    }

    function openOverlay(el) {
        lastFocus = document.activeElement;
        el.classList.add('show');
        const items = focusables(el);
        const target = items.find(x => x.matches('input, select, textarea')) || items[0];
        if (target) target.focus();
    }

    function closeOverlay(el) {
        el.classList.remove('show');
        dialogSubmit = null;
        if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    }

    function openDialog(opts) {
        $('#fuDialogTitle').textContent = opts.title;
        $('#fuDialogBody').innerHTML = opts.body;
        const actions = $('#fuDialogActions');
        actions.innerHTML = '';

        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'btn-outline';
        cancel.dataset.close = '';
        cancel.textContent = opts.cancelLabel || 'Cancel';
        actions.appendChild(cancel);

        if (opts.submitLabel) {
            const ok = document.createElement('button');
            ok.type = 'submit';
            ok.className = opts.danger ? 'btn-outline-danger' : 'btn-primary';
            ok.textContent = opts.submitLabel;
            actions.appendChild(ok);
        }

        dialogSubmit = opts.onSubmit || null;
        openOverlay($('#fuDialog'));
    }

    function fieldHtml(f, value) {
        const id = `fuE_${f.k}`;
        const label = `${esc(f.l)}${f.req ? ' *' : ''}`;
        let control;
        if (f.t === 'select') {
            control = `<select id="${id}">${['', ...f.opts].map(o => `<option value="${esc(o)}"${o === value ? ' selected' : ''}>${o ? esc(o) : 'Select'}</option>`).join('')}</select>`;
        } else {
            const list = f.opts ? ` list="${id}_list"` : '';
            const datalist = f.opts ? `<datalist id="${id}_list">${f.opts.map(o => `<option value="${esc(o)}"></option>`).join('')}</datalist>` : '';
            control = `<input id="${id}" type="${f.t || 'text'}" value="${esc(value || '')}"${f.max ? ` maxlength="${f.max}"` : ''}${f.ph ? ` placeholder="${esc(f.ph)}"` : ''}${list} autocomplete="off">${datalist}`;
        }
        return `<div class="rs-field" data-key="${f.k}"><label for="${id}">${label}</label>${control}</div>`;
    }

    function dialogFieldError(root, key, msg) {
        const wrap = $(`[data-key="${key}"]`, root);
        wrap.classList.add('fu-invalid');
        const p = document.createElement('p');
        p.className = 'fu-error';
        p.textContent = msg;
        wrap.appendChild(p);
    }

    function openEntry(kind, index) {
        const cfg = ENTRY[kind];
        const editing = index !== undefined;
        const rec = editing ? state[cfg.list][index] : {};

        openDialog({
            title: `${editing ? 'Edit' : 'Add'} ${cfg.noun}`,
            body: `<div class="fu-dialog-body">${cfg.fields.map(f => fieldHtml(f, rec[f.k])).join('')}</div>`,
            submitLabel: editing ? 'Save Changes' : cfg.add,
            onSubmit: root => {
                $$('.fu-error', root).forEach(p => p.remove());
                $$('.fu-invalid', root).forEach(w => w.classList.remove('fu-invalid'));
                const next = {};
                let valid = true;
                cfg.fields.forEach(f => {
                    const v = $(`#fuE_${f.k}`, root).value.trim();
                    next[f.k] = v;
                    if (f.req && !v) {
                        dialogFieldError(root, f.k, `${f.l} is required.`);
                        valid = false;
                    } else if (f.t === 'date' && v && !parseISO(v)) {
                        dialogFieldError(root, f.k, 'Enter a valid date.');
                        valid = false;
                    }
                });
                if (!valid) {
                    const first = $('.fu-invalid input, .fu-invalid select', root);
                    if (first) first.focus();
                    return false;
                }
                if (editing) state[cfg.list][index] = next;
                else state[cfg.list].push(next);
                if (kind === 'med') {
                    $('[name="noMedications"]', form).checked = false;
                    clearErrorByKey('meds');
                }
                renderTables();
                return true;
            }
        });
    }

    function openView(i) {
        const r = state.labs[i];
        const rows = [['Test or imaging', r.name], ['Type', r.kind], ['Date', fmtDate(r.date)], ['Result', r.result], ['Status', r.status]];
        openDialog({
            title: 'Test or imaging details',
            body: `<dl class="modal-details">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${val(v)}</dd>`).join('')}</dl>`,
            cancelLabel: 'Close'
        });
    }

    function confirmRemove(kind, i) {
        const cfg = ENTRY[kind];
        const rec = state[cfg.list][i];
        openDialog({
            title: `Remove ${cfg.noun}`,
            body: `<p>Remove "${esc(rec.name)}" from this follow-up visit?</p>`,
            submitLabel: 'Remove',
            danger: true,
            onSubmit: () => {
                state[cfg.list].splice(i, 1);
                renderTables();
                return true;
            }
        });
    }

    function onTableClick(e) {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const kind = btn.dataset.kind;
        const i = Number(btn.dataset.i);
        if (btn.dataset.act === 'edit') openEntry(kind, i);
        if (btn.dataset.act === 'remove') confirmRemove(kind, i);
        if (btn.dataset.act === 'view') openView(i);
    }

    function wrapperFor(key, panel) {
        return $(`[data-field="${key}"]`, panel || $('.rs-step-panel.active'));
    }

    function clearError(el) {
        const wrap = el.closest('[data-field]');
        if (!wrap) return;
        wrap.classList.remove('fu-invalid');
        $$(':scope > .fu-error', wrap).forEach(p => p.remove());
        if (!$('.rs-step-panel.active .fu-invalid')) hideAlert();
    }

    function clearErrorByKey(key) {
        const wrap = wrapperFor(key);
        if (wrap) clearError(wrap.querySelector('input, select, textarea') || wrap);
    }

    function hideAlert() {
        $('#fuAlert').classList.remove('show');
    }

    function clearErrors() {
        $$('.fu-invalid', form).forEach(w => w.classList.remove('fu-invalid'));
        $$('.fu-error', form).forEach(p => p.remove());
        hideAlert();
    }

    function showErrors(errs) {
        clearErrors();
        const panel = $('.rs-step-panel.active');
        const messages = [];
        errs.forEach(([key, msg]) => {
            messages.push(msg);
            const wrap = wrapperFor(key, panel);
            if (!wrap) return;
            wrap.classList.add('fu-invalid');
            const p = document.createElement('p');
            p.className = 'fu-error';
            p.textContent = msg;
            wrap.appendChild(p);
        });
        $('#fuAlertTitle').textContent = messages.length === 1 ? 'Fix this before continuing:' : `Fix these ${messages.length} items before continuing:`;
        $('#fuAlertList').innerHTML = messages.map(m => `<li>${esc(m)}</li>`).join('');
        $('#fuAlert').classList.add('show');
        const first = $('.fu-invalid', panel);
        if (first) {
            const target = first.matches('input, select, textarea') ? first : first.querySelector('input, select, textarea');
            if (target) target.focus();
        }
    }

    function req(errs, d, key, msg) {
        if (typeof d[key] === 'string' ? !d[key].trim() : !d[key]) errs.push([key, msg]);
    }

    function range(errs, d, key, label, min, max, unit, whole) {
        const v = d[key];
        if (v === '' || v === undefined) return;
        const n = Number(v);
        if (!isNum(v) || n < min || n > max || (whole && !Number.isInteger(n))) {
            errs.push([key, `${label} must be ${whole ? 'a whole number ' : ''}between ${min} and ${max} ${unit}.`]);
        }
    }

    const validators = {
        1(d) {
            const errs = [];
            const today = todayISO();
            req(errs, d, 'fullName', 'Enter the patient\u2019s full name.');
            if (d.fullName.trim() && d.fullName.trim().length < 2) errs.push(['fullName', 'Full name must be at least 2 characters.']);
            if (!d.dob) errs.push(['dob', 'Enter the date of birth.']);
            else if (!parseISO(d.dob)) errs.push(['dob', 'Enter a valid date of birth.']);
            else if (d.dob > today) errs.push(['dob', 'Date of birth cannot be in the future.']);
            else if (d.dob < '1900-01-01') errs.push(['dob', 'Date of birth must be on or after 1900.']);
            if (!d.mrn.trim()) errs.push(['mrn', 'Enter the medical record number.']);
            else if (!/^[A-Za-z0-9-]{3,20}$/.test(d.mrn.trim())) errs.push(['mrn', 'MRN may contain letters, numbers and hyphens only (3\u201320 characters).']);
            const digits = d.phone.replace(/\D/g, '');
            if (!d.phone.trim()) errs.push(['phone', 'Enter a phone number.']);
            else if (!/^[\d\s()+\-.]+$/.test(d.phone.trim()) || digits.length < 10 || digits.length > 15) errs.push(['phone', 'Enter a valid phone number with 10 to 15 digits.']);
            req(errs, d, 'contactMethod', 'Select a preferred contact method.');
            if (!d.visitDate) errs.push(['visitDate', 'Enter the visit date.']);
            else if (!parseISO(d.visitDate)) errs.push(['visitDate', 'Enter a valid visit date.']);
            else if (d.visitDate > today) errs.push(['visitDate', 'Visit date cannot be in the future.']);
            else if (parseISO(d.dob) && d.visitDate < d.dob) errs.push(['visitDate', 'Visit date cannot be before the date of birth.']);
            req(errs, d, 'visitType', 'Select a visit type.');
            req(errs, d, 'sinceEvents', 'Select whether there were hospitalizations or emergency visits.');
            req(errs, d, 'patientConfirmed', 'Confirm the patient details with the patient.');
            return errs;
        },
        2(d) {
            const errs = [];
            req(errs, d, 'condition', 'Describe how the patient has been since the last visit.');
            if (!d.symptoms.length) errs.push(['symptoms', 'Select at least one symptom option, or No Symptoms.']);
            if (d.symptoms.includes('Other') && !d.symptomOther.trim()) errs.push(['symptomOther', 'Describe the other symptoms.']);
            req(errs, d, 'improvement', 'Select how the condition compares with the last visit.');
            req(errs, d, 'treatAdherence', 'Select whether the treatment plan has been followed.');
            if (d.treatAdherence === 'No' && !d.treatAdherenceNote.trim()) errs.push(['treatAdherenceNote', 'Specify why the treatment plan was not followed.']);
            return errs;
        },
        3(d) {
            const errs = [];
            if (!state.meds.length && !d.noMedications) errs.push(['meds', 'Add a medication, or confirm the patient takes none.']);
            if (state.meds.length && d.noMedications) errs.push(['meds', 'Medications are listed. Clear \u201Cnot taking any medications\u201D or remove them.']);
            if (!d.medChanges.length) errs.push(['medChanges', 'Select the medication changes since the last visit.']);
            else if (!d.medChanges.includes('No Changes') && !d.medChangeDetails.trim()) errs.push(['medChangeDetails', 'Describe the medication changes.']);
            req(errs, d, 'medAdherence', 'Select how well the medication plan was followed.');
            if (['Mostly', 'No'].includes(d.medAdherence) && !d.medAdherenceNote.trim()) errs.push(['medAdherenceNote', 'Tell us more about the missed medication.']);
            req(errs, d, 'refills', 'Select a refill option.');
            return errs;
        },
        4(d) {
            const errs = [];
            const bpErrs = [];
            range(bpErrs, d, 'bpSys', 'Systolic pressure', 40, 300, 'mmHg', true);
            range(bpErrs, d, 'bpDia', 'Diastolic pressure', 20, 200, 'mmHg', true);
            const sysGiven = d.bpSys !== '';
            const diaGiven = d.bpDia !== '';
            if (bpErrs.length) errs.push(['bp', bpErrs.map(e => e[1]).join(' ')]);
            else if (sysGiven !== diaGiven) errs.push(['bp', 'Enter both systolic and diastolic pressure.']);
            else if (sysGiven && Number(d.bpSys) <= Number(d.bpDia)) errs.push(['bp', 'Systolic pressure must be higher than diastolic pressure.']);
            range(errs, d, 'heartRate', 'Heart rate', 20, 250, 'bpm', true);
            if (d.tempUnit === 'C') range(errs, d, 'temp', 'Temperature', 27, 46, '\u00B0C');
            else range(errs, d, 'temp', 'Temperature', 80, 115, '\u00B0F');
            range(errs, d, 'respRate', 'Respiratory rate', 4, 80, 'per minute', true);
            range(errs, d, 'height', 'Height', 30, 250, 'cm');
            range(errs, d, 'weight', 'Weight', 1, 500, 'kg');
            range(errs, d, 'spo2', 'Oxygen saturation', 50, 100, '%', true);
            if (d.planDate) {
                if (!parseISO(d.planDate)) errs.push(['planDate', 'Enter a valid next visit date.']);
                else if (parseISO(d.visitDate) && d.planDate <= d.visitDate) errs.push(['planDate', 'Next visit date must be after the visit date.']);
            }
            return errs;
        },
        5(d) {
            const errs = [];
            req(errs, d, 'planInterval', 'Select a follow-up interval.');
            if (d.planInterval !== 'asneeded') {
                if (!d.planDate) errs.push(['planDate', 'Enter the next visit date.']);
            }
            if (d.planDate) {
                if (!parseISO(d.planDate)) errs.push(['planDate', 'Enter a valid next visit date.']);
                else if (parseISO(d.visitDate) && d.planDate <= d.visitDate) errs.push(['planDate', 'Next visit date must be after the visit date.']);
            }
            req(errs, d, 'nextVisitType', 'Select the next visit type.');
            req(errs, d, 'nextReason', 'Enter the reason for the next visit.');
            return errs;
        }
    };

    function validateStep(step) {
        const errs = validators[step](cleanData(collect()));
        if (errs.length) {
            showErrors(errs);
            return false;
        }
        clearErrors();
        return true;
    }

    function firstFailure(from, to) {
        const d = cleanData(collect());
        for (let s = from; s <= to; s++) {
            const errs = validators[s](d);
            if (errs.length) return { step: s, errs };
        }
        return null;
    }

    function renderStepper() {
        let reach = 1;
        while (state.completed[reach] && reach < TOTAL) reach++;
        $$('.rs-step', $('#fuStepper')).forEach((item, i) => {
            const n = i + 1;
            const active = n === state.step;
            const done = !active && !!state.completed[n];
            item.classList.toggle('active', active);
            item.classList.toggle('done', done);
            item.classList.toggle('is-locked', n > reach);
            item.setAttribute('aria-disabled', n > reach ? 'true' : 'false');
            if (active) item.setAttribute('aria-current', 'step');
            else item.removeAttribute('aria-current');
            const name = $('strong', item).textContent;
            const status = active ? 'current' : done ? 'completed' : n > reach ? 'locked' : 'not completed';
            item.setAttribute('aria-label', `Step ${n}, ${name}, ${status}`);
        });
    }

    function goToStep(n) {
        state.step = n;
        $$('.rs-step-panel', form).forEach(p => p.classList.toggle('active', Number(p.dataset.step) === n));
        $('#stepCounter').textContent = `Step ${n} of ${TOTAL}`;
        backBtn.style.display = n === 1 ? 'none' : 'inline-flex';
        hideAlert();
        refreshConditional();
        renderStepper();

        if (state.submitted) {
            continueBtn.innerHTML = 'Start New Follow-Up <img src="images/arrow-right.png" alt="">';
        } else if (n === TOTAL) {
            renderReview();
            continueBtn.innerHTML = '<img src="images/check-white.png" alt=""> Submit Follow-Up Visit';
        } else {
            continueBtn.innerHTML = 'Continue <img src="images/arrow-right.png" alt="">';
        }

        $('.rs-page-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function onNext() {
        if (state.submitted) {
            localStorage.removeItem(KEYS.draft);
            window.location.reload();
            return;
        }
        if (state.step === TOTAL) {
            submit();
            return;
        }
        if (!validateStep(state.step)) return;
        state.completed[state.step] = true;
        goToStep(state.step + 1);
    }

    function onBack() {
        if (state.step > 1) goToStep(state.step - 1);
    }

    function onStepClick(target) {
        if (target === state.step) return;
        if (target < state.step || state.submitted) {
            goToStep(target);
            return;
        }
        const fail = firstFailure(state.step, target - 1);
        for (let s = state.step; s < target && (!fail || s < fail.step); s++) state.completed[s] = true;
        if (fail) {
            goToStep(fail.step);
            showErrors(fail.errs);
            return;
        }
        goToStep(target);
    }

    function persistable() {
        return {
            data: collect(),
            meds: state.meds,
            labs: state.labs,
            planTests: state.planTests,
            onFile: state.onFile,
            patientId: state.patientId,
            dateManual: state.dateManual,
            completed: state.completed,
            step: state.step,
            savedAt: new Date().toISOString()
        };
    }

    function saveDraft() {
        if (state.submitted) return;
        const ok = writeJson(KEYS.draft, persistable());
        if (!ok) {
            openDialog({
                title: 'Draft not saved',
                body: '<p>This browser blocked local storage, so the draft could not be saved. Your entries are still on the page.</p>',
                cancelLabel: 'Close'
            });
            return;
        }
        state.status = 'Draft';
        renderBadge();
        openOverlay($('#draftSavedModal'));
    }

    function restoreDraft() {
        const draft = readJson(KEYS.draft, null);
        if (!draft || !draft.data) return;
        apply(draft.data);
        state.meds = draft.meds || [];
        state.labs = draft.labs || [];
        state.planTests = draft.planTests || [];
        state.onFile = draft.onFile || [];
        state.patientId = draft.patientId || null;
        state.dateManual = !!draft.dateManual;
        state.completed = draft.completed || {};
        state.status = 'Draft';
        state.restoredStep = Math.min(Math.max(Number(draft.step) || 1, 1), TOTAL);
    }

    function optLabel(name, v) {
        return optText(name, v) || v;
    }

    function rows(list) {
        return `<dl class="rv-list">${list.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
    }

    function joined(arr) {
        return arr && arr.length ? esc(arr.join(', ')) : DASH;
    }

    function rvCard(icon, title, body, edit, span) {
        const links = [].concat(edit).map(e => `<button type="button" class="rv-edit" data-goto="${e[0]}" aria-label="Edit ${esc(e[2] || title)}"><img class="ico" src="images/edit-blue.png" alt="">${esc(e[1])}</button>`).join('');
        return `<div class="rv-card${span ? ' rv-span-2' : ''}"><div class="rv-head"><div class="rv-title"><img class="ico" src="images/${icon}" alt=""><h3>${esc(title)}</h3></div><div class="fu-edit-group">${links}</div></div>${body}</div>`;
    }

    function miniTable(head, bodyRows) {
        return `<div class="fu-table-wrap"><table class="fu-table"><thead><tr>${head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
    }

    function renderReview() {
        const d = cleanData(collect());
        const ctx = contextFor();
        const patientRows = [
            ['Full name', val(d.fullName)],
            ['Date of birth', d.dob ? esc(fmtDate(d.dob)) : DASH],
            ['MRN', val(d.mrn)],
            ['Phone', val(d.phone)],
            ['Preferred contact', val(d.contactMethod)]
        ];

        const visitRows = [
            ['Visit date', d.visitDate ? esc(fmtDate(d.visitDate)) : DASH],
            ['Visit type', val(d.visitType)],
            ['Accompanying person', val(d.companion)],
            ['Referring provider', val(d.referrer)],
            ['Insurance', val(d.insurance)],
            ['Hospital or ER visits', val(d.sinceEvents)],
            ['New diagnoses or events', val(d.newEvents)]
        ];
        if (ctx.lastVisit) visitRows.unshift(['Last visit', esc(fmtDate(ctx.lastVisit))]);
        if (ctx.provider) visitRows.splice(1, 0, ['Provider', esc(ctx.provider)]);
        if (ctx.diagnosis) visitRows.splice(2, 0, ['Diagnosis', esc(ctx.diagnosis)]);

        const progressRows = [
            ['Current condition', val(d.condition)],
            ['Symptoms', joined(d.symptoms)],
            ['Other symptoms', val(d.symptomOther)],
            ['Improvement', val(d.improvement)],
            ['Treatment plan followed', val(d.treatAdherence)],
            ['Adherence details', val(d.treatAdherenceNote)],
            ['Notes', val(d.notesProgress)]
        ];

        const medTable = state.meds.length
            ? miniTable(['Medication', 'Dose', 'Frequency', 'Status'], state.meds.map(m => `<tr><td><strong>${esc(m.name)}</strong>${sub(m.note)}</td><td>${esc(m.dose)}</td><td>${esc(m.frequency)}</td><td>${pill(m.status)}</td></tr>`).join(''))
            : `<dl class="rv-list"><dt>Medications</dt><dd>${d.noMedications ? 'Patient takes no medications' : DASH}</dd></dl>`;
        const medRows = [
            ['Changes', joined(d.medChanges)],
            ['Change details', val(d.medChangeDetails)],
            ['Adherence', val(d.medAdherence)],
            ['Adherence details', val(d.medAdherenceNote)],
            ['Refills', val(d.refills)],
            ['Refill notes', val(d.refillNotes)]
        ];

        const bp = d.bpSys !== '' && d.bpDia !== '' ? `${esc(d.bpSys)} / ${esc(d.bpDia)} mmHg` : DASH;
        const bmi = calcBmi(d.height, d.weight);
        const unit = d.tempUnit === 'C' ? '\u00B0C' : '\u00B0F';
        const withUnit = (v, u) => (v !== '' ? `${esc(v)} ${u}` : DASH);
        const vitalRows = [
            ['Blood pressure', bp],
            ['Heart rate', withUnit(d.heartRate, 'bpm')],
            ['Temperature', withUnit(d.temp, unit)],
            ['Respiratory rate', withUnit(d.respRate, '/min')],
            ['Height', withUnit(d.height, 'cm')],
            ['Weight', withUnit(d.weight, 'kg')],
            ['BMI', bmi === null ? DASH : `${bmi.toFixed(1)} kg/m\u00B2`],
            ['Oxygen saturation', withUnit(d.spo2, '%')],
            ['General appearance', val(d.examGeneral)],
            ['Cardiovascular', val(d.examCardio)],
            ['Respiratory', val(d.examResp)],
            ['Abdominal', val(d.examAbdo)],
            ['Other findings', val(d.examOther)]
        ];

        const labTable = state.labs.length
            ? miniTable(['Test / Imaging', 'Date', 'Result', 'Status'], state.labs.map(r => `<tr><td><strong>${esc(r.name)}</strong>${sub(r.kind)}</td><td>${esc(fmtDate(r.date))}</td><td>${r.result ? esc(r.result) : DASH}</td><td>${pill(r.status)}</td></tr>`).join(''))
            : '';
        const testsBody = `${labTable || rows([['Tests and imaging', DASH]])}${rows([['Treatments given', val(d.treatments)]])}`;

        const planTable = state.planTests.length
            ? miniTable(['Test / Assessment', 'Reason', 'Expected', 'Status'], state.planTests.map(r => `<tr><td><strong>${esc(r.name)}</strong></td><td>${r.reason ? esc(r.reason) : DASH}</td><td>${r.expected ? esc(r.expected) : DASH}</td><td>${pill(r.status)}</td></tr>`).join(''))
            : '';
        const planRows = [
            ['Follow-up interval', val(optLabel('planInterval', d.planInterval))],
            ['Next visit date', d.planDate ? esc(fmtDate(d.planDate)) : DASH],
            ['Preferred time', val(d.prefTime)],
            ['Visit type', val(d.nextVisitType)],
            ['Preferred physician', val(d.nextPhysician)],
            ['Reason', val(d.nextReason)],
            ['Clinical plan', val(d.planNotes)]
        ];
        const planBody = `${rows(planRows)}${planTable || rows([['Tests and assessments', DASH]])}`;

        const lifeBody = d.lifestyle.length
            ? `<ul class="fu-review-list">${d.lifestyle.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`
            : rows([['Recommendations', DASH]]);

        const notesRows = [
            ['Progress notes', val(d.notesProgress)],
            ['Visit notes', val(d.notesVitals)],
            ['Instructions for next visit', val(d.nextInstructions)]
        ];

        $('#fuReviewGrid').innerHTML = [
            rvCard('patient-icon-blue.png', 'Patient Information', rows(patientRows), [[1, 'Edit']]),
            rvCard('calendar-blue.png', 'Visit Details', rows(visitRows), [[1, 'Edit']]),
            rvCard('ic-pulse-blue.png', 'Progress and Symptoms', rows(progressRows), [[2, 'Edit']]),
            rvCard('medical-icon-blue.png', 'Current Medications and Changes', `${medTable}${rows(medRows)}`, [[3, 'Edit']]),
            rvCard('ic-heart-blue.png', 'Vitals and Examination', rows(vitalRows), [[4, 'Edit']]),
            rvCard('ic-clipboard-blue.png', 'Tests, Imaging, and Treatments', testsBody, [[4, 'Edit']]),
            rvCard('calendar-blue.png', 'Follow-Up Plan', planBody, [[5, 'Edit']]),
            rvCard('ic-badge-blue.png', 'Lifestyle Recommendations', lifeBody, [[5, 'Edit']]),
            rvCard('ic-file-blue.png', 'Additional Notes', rows(notesRows), [[2, 'Progress', 'progress notes'], [4, 'Visit', 'visit notes'], [5, 'Next visit', 'next visit instructions']], true)
        ].join('');
    }

    function consentErrors(d) {
        const errs = [];
        if (!d.consentAccurate || !d.consentSubmit) errs.push(['consent', 'Accept both confirmations before submitting.']);
        return errs;
    }

    function nextReference() {
        const n = Number(localStorage.getItem(KEYS.counter) || 0) + 1;
        localStorage.setItem(KEYS.counter, String(n));
        return `FUP-${String(n).padStart(6, '0')}`;
    }

    function submit() {
        const fail = firstFailure(1, 5);
        if (fail) {
            for (let s = 1; s < fail.step; s++) state.completed[s] = true;
            goToStep(fail.step);
            showErrors(fail.errs);
            return;
        }
        for (let s = 1; s <= 5; s++) state.completed[s] = true;

        const d = cleanData(collect());
        const errs = consentErrors(d);
        if (errs.length) {
            showErrors(errs);
            return;
        }
        clearErrors();

        let reference;
        const submittedAt = new Date();
        const record = {
            data: d,
            meds: state.meds,
            labs: state.labs,
            planTests: state.planTests,
            patientId: state.patientId,
            submittedAt: submittedAt.toISOString(),
            status: 'Submitted',
            storage: 'browser'
        };

        try {
            reference = nextReference();
            record.reference = reference;
            const list = readJson(KEYS.submitted, []);
            list.push(record);
            localStorage.setItem(KEYS.submitted, JSON.stringify(list));
            localStorage.removeItem(KEYS.draft);
        } catch (err) {
            openDialog({
                title: 'Submission not saved',
                body: '<p>This browser blocked local storage, so the follow-up visit could not be recorded. Nothing was submitted.</p>',
                cancelLabel: 'Close'
            });
            return;
        }

        state.submitted = true;
        state.reference = reference;
        state.status = 'Submitted';
        $('#fuPanels').disabled = true;
        $('#saveDraftBtn').disabled = true;
        renderBadge();
        renderStepper();
        goToStep(TOTAL);

        const setText = (id, value) => { $(id).textContent = value && String(value).trim() ? value : DASH; };
        setText('#fuSubRef', reference);
        setText('#fuSubPatient', d.fullName);
        setText('#fuSubVisit', d.visitDate ? fmtDate(d.visitDate) : '');
        setText('#fuSubNext', d.planDate ? fmtDate(d.planDate) : (d.planInterval === 'asneeded' ? 'As needed' : ''));
        setText('#fuSubOn', fmtDateTime(submittedAt));
        setText('#fuSubStatus', 'Submitted (saved in this browser)');
        openOverlay($('#submitModal'));
    }

    function onReviewClick(e) {
        const btn = e.target.closest('[data-goto]');
        if (btn && !state.submitted) goToStep(Number(btn.dataset.goto));
    }

    function onKeydown(e) {
        const open = $('.modal-overlay.show');
        if (!open) return;
        if (e.key === 'Escape') {
            closeOverlay(open);
            return;
        }
        if (e.key !== 'Tab') return;
        const items = focusables(open);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function bind() {
        form.addEventListener('submit', e => e.preventDefault());
        form.addEventListener('input', onFieldEvent);
        form.addEventListener('change', onFieldEvent);

        $$('[data-add]', form).forEach(btn => btn.addEventListener('click', () => openEntry(btn.dataset.add)));
        ['#fuMedBody', '#fuLabBody', '#fuPlanBody'].forEach(sel => $(sel).addEventListener('click', onTableClick));
        $('#fuReviewGrid').addEventListener('click', onReviewClick);

        $$('.rs-step', $('#fuStepper')).forEach(btn => btn.addEventListener('click', () => onStepClick(Number(btn.dataset.step))));

        continueBtn.addEventListener('click', onNext);
        backBtn.addEventListener('click', onBack);
        $('#saveDraftBtn').addEventListener('click', saveDraft);

        $('#fuDialogForm').addEventListener('submit', e => {
            e.preventDefault();
            if (!dialogSubmit) return;
            if (dialogSubmit($('#fuDialogBody')) !== false) closeOverlay($('#fuDialog'));
        });

        document.addEventListener('click', e => {
            const closer = e.target.closest('[data-close]');
            if (closer) closeOverlay(closer.closest('.modal-overlay'));
        });

        document.addEventListener('keydown', onKeydown);
    }

    function init() {
        const today = todayISO();
        $('#fuDob').max = today;
        $('#fuVisitDate').max = today;
        fillPatientList();
        bind();
        $('#fuVisitDate').value = today;
        restoreDraft();
        updateCounters();
        renderOnFile();
        renderTables();
        renderSummary();
        renderBadge();
        refreshConditional();
        goToStep(state.restoredStep || 1);
        window.scrollTo(0, 0);
    }

    document.addEventListener('DOMContentLoaded', init);
}());
