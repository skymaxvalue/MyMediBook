document.addEventListener('DOMContentLoaded', () => {
  const S = RoomStore, U = RoomUI, O = S.OPTS, T = S.TYPES, $ = id => document.getElementById(id);
  const form = $('roomForm');
  const editId = new URLSearchParams(location.search).get('id');
  const editing = editId ? S.get(editId) : null;

  if (editId && !editing) {
    U.dialog({ title: 'Room not found', text: 'The selected room no longer exists.' }).then(() => location.href = 'room-master.html');
    return;
  }

  /* ---------- build dynamic controls ---------- */
  form.querySelectorAll('select[data-opts]').forEach(s => {
    s.innerHTML = (s.dataset.ph !== undefined ? `<option value="">${s.dataset.ph}</option>` : '') +
      O[s.dataset.opts].map(v => `<option>${U.esc(v)}</option>`).join('');
  });
  form.querySelectorAll('[data-checks]').forEach(c => {
    const n = c.dataset.checks;
    c.innerHTML = O[n].map(v => `<label class="rm-check"><input type="checkbox" name="${n}" value="${U.esc(v)}"><span>${U.esc(v)}</span></label>`).join('');
  });
  form.querySelectorAll('[data-radios]').forEach(r => {
    const n = r.dataset.radios;
    r.innerHTML = r.dataset.values.split(',').map(v => `<label class="rm-check"><input type="radio" name="${n}" value="${v}"><span>${v}</span></label>`).join('');
  });
  $('typeGrid').innerHTML = Object.entries(T).map(([k, t]) =>
    `<label class="room-card"><input type="radio" name="roomType" value="${k}"><img class="ico" src="images/ic-bed-blue.png" alt="">
     <h4>${k}</h4><p class="rm-card-beds">${t.beds}</p><p>${t.desc}</p></label>`).join('');

  /* ---------- state ---------- */
  const todayISO = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
  const DEFAULTS = {
    facility: O.facility[0], roomType: 'Standard', recordStatus: 'Active', genderRestriction: 'Any', layout: 'Standard', doors: 1,
    attachedBathroom: 'Yes', facilities: S.FAC_DEFAULTS.Standard.slice(), totalBeds: T.Standard.def, bedType: 'Standard Bed',
    bedPrefix: 'B', startFrom: 1, autoNumber: true, bedAmenities: [], patientCategory: 'General', infection: O.infection[0],
    isolation: 'No', negativePressure: 'No', oxygen: 'Wall outlet', emergencyEquipment: 'Nearby (nursing station)', accessibility: [],
    billingCategory: 'Standard', ratePlan: 'Standard Tariff', effectiveFrom: todayISO
  };

  let step = 1, beds = [], prevBedType = DEFAULTS.bedType;
  let facTouched = !!editing, bedsTouched = !!editing, billTouched = !!editing;
  const done = new Set();
  const stepper = [...document.querySelectorAll('.rs-stepper .rs-step')];

  const val = n => (form.elements[n] && (form.elements[n].value ?? '')) || '';
  const hasData = b => !!b.remarks || b.status !== 'Available';

  function collect() {
    const d = {};
    form.querySelectorAll('[name]').forEach(el => {
      const n = el.name;
      if (el.type === 'checkbox' && el.hasAttribute('data-bool')) d[n] = el.checked;
      else if (el.type === 'checkbox') { d[n] = d[n] || []; if (el.checked) d[n].push(el.value); }
      else if (el.type === 'radio') { if (el.checked) d[n] = el.value; else if (!(n in d)) d[n] = ''; }
      else if (!(n in d) || d[n] === '') d[n] = el.value;
    });
    d.beds = beds.map(b => ({ ...b }));
    return d;
  }

  function fill(d) {
    form.querySelectorAll('[name]').forEach(el => {
      const v = d[el.name];
      if (v === undefined) return;
      if (el.type === 'checkbox' && el.hasAttribute('data-bool')) el.checked = !!v;
      else if (el.type === 'checkbox') el.checked = Array.isArray(v) && v.includes(el.value);
      else if (el.type === 'radio') el.checked = el.value === String(v);
      else el.value = v;
    });
    beds = (d.beds || []).map(b => ({ ...b }));
    prevBedType = d.bedType || prevBedType;
    afterFill();
  }

  function afterFill() {
    const t = T[val('roomType')];
    if (t) { $('f-totalBeds').min = t.min; $('f-totalBeds').max = t.max; $('bedRange').textContent = `Allowed for this room type: ${t.min === t.max ? t.min : `${t.min}–${t.max}`}`; }
    $('descCount').textContent = `${val('description').length}/500`;
    $('chargeFmt').textContent = val('dailyCharge') !== '' && +val('dailyCharge') >= 0 ? U.money(val('dailyCharge')) : '';
    $('otherAmenityWrap').hidden = !form.querySelector('[name="bedAmenities"][value="Other (Specify)"]').checked;
    pressure();
    ensureBeds();
  }

  /* ---------- beds ---------- */
  const newBed = () => ({ no: '', type: val('bedType') || 'Standard Bed', status: 'Available', remarks: '' });
  const auto = () => form.elements.autoNumber.checked;
  const gen = i => `${val('roomNo').trim() ? val('roomNo').trim() + '-' : ''}${val('bedPrefix').trim() || 'B'}${(parseInt(val('startFrom'), 10) || 1) + i}`;

  function renumber() {
    if (auto()) beds.forEach((b, i) => { b.no = gen(i); });
    renderBeds();
  }
  function ensureBeds() {
    const n = parseInt(val('totalBeds'), 10);
    if (!Number.isInteger(n) || n < 1 || n > 50) return renderBeds();
    if (beds.length < n) { while (beds.length < n) beds.push(newBed()); if (auto()) renumber(); else beds.forEach((b, i) => { if (!b.no) b.no = gen(i); }); }
    renderBeds();
  }
  async function resizeBeds(n) {
    if (!Number.isInteger(n) || n < 1 || n > 50) return;
    if (n < beds.length && beds.slice(n).some(hasData)) {
      const ok = await U.dialog({ title: 'Remove beds?', text: 'Some beds that will be removed have status or remarks entered. Their data will be lost.', ok: 'Remove', cancel: 'Keep beds', danger: true });
      if (!ok) { $('f-totalBeds').value = beds.length; return; }
    }
    while (beds.length < n) beds.push(newBed());
    beds = beds.slice(0, n);
    beds.forEach((b, i) => { if (!b.no) b.no = gen(i); });
    renumber();
  }

  function renderBeds() {
    const names = beds.map(b => b.no.trim().toLowerCase());
    const sel = (list, v) => list.map(o => `<option${o === v ? ' selected' : ''}>${U.esc(o)}</option>`).join('');
    $('bedRows').innerHTML = beds.map((b, i) => {
      const key = b.no.trim().toLowerCase(), dup = !key || names.indexOf(key) !== names.lastIndexOf(key);
      return `<tr><td>${i + 1}</td>
        <td><input data-i="${i}" data-k="no" value="${U.esc(b.no)}" ${auto() ? 'readonly' : ''} ${dup ? 'aria-invalid="true"' : ''} aria-label="Bed number ${i + 1}"></td>
        <td><select data-i="${i}" data-k="type" aria-label="Bed type ${i + 1}">${sel(O.bedType, b.type)}</select></td>
        <td><select data-i="${i}" data-k="status" aria-label="Bed status ${i + 1}">${sel(O.bedStatus, b.status)}</select></td>
        <td><input data-i="${i}" data-k="remarks" maxlength="120" value="${U.esc(b.remarks)}" placeholder="Optional" aria-label="Remarks ${i + 1}"></td>
        <td><button type="button" class="rm-act rm-act--danger" data-del="${i}" aria-label="Remove bed ${U.esc(b.no || i + 1)}" title="Remove bed"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></td></tr>`;
    }).join('');
  }

  $('bedRows').addEventListener('input', e => {
    const el = e.target, i = +el.dataset.i, k = el.dataset.k;
    if (k) { beds[i][k] = el.value; if (k === 'no') { const dups = new Set(); beds.forEach((b, x) => { if (!b.no.trim() || beds.some((o, y) => y !== x && o.no.trim().toLowerCase() === b.no.trim().toLowerCase())) dups.add(x); }); $('bedRows').querySelectorAll('input[data-k="no"]').forEach((inp, x) => dups.has(x) ? inp.setAttribute('aria-invalid', 'true') : inp.removeAttribute('aria-invalid')); } }
  });
  $('bedRows').addEventListener('change', e => { if (e.target.dataset.k === 'status' || e.target.dataset.k === 'type') beds[+e.target.dataset.i][e.target.dataset.k] = e.target.value; });
  $('bedRows').addEventListener('click', async e => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    const i = +b.dataset.del, t = T[val('roomType')];
    if (beds.length <= (t ? t.min : 1)) return U.dialog({ title: 'Bed cannot be removed', text: `${val('roomType') || 'This'} rooms need at least ${t ? t.min : 1} bed${t && t.min > 1 ? 's' : ''}. Change the room type to reduce capacity further.` });
    if (hasData(beds[i]) && !(await U.dialog({ title: 'Remove bed?', text: `Bed ${beds[i].no} has data entered. Remove it anyway?`, ok: 'Remove', cancel: 'Cancel', danger: true }))) return;
    beds.splice(i, 1);
    $('f-totalBeds').value = beds.length;
    renumber();
  });

  /* ---------- reactions ---------- */
  function setRadio(name, v) { form.querySelectorAll(`[name="${name}"]`).forEach(r => { r.checked = r.value === v; }); }
  function pressure() {
    const on = (form.querySelector('[name="isolation"]:checked') || {}).value === 'Yes';
    form.querySelectorAll('[name="negativePressure"]').forEach(r => { r.disabled = !on; });
    if (!on) setRadio('negativePressure', 'No');
  }
  function onType() {
    const k = val('roomType'), t = T[k];
    if (!t) return;
    $('f-totalBeds').min = t.min; $('f-totalBeds').max = t.max;
    $('bedRange').textContent = `Allowed for this room type: ${t.min === t.max ? t.min : `${t.min}–${t.max}`}`;
    const n = parseInt(val('totalBeds'), 10);
    if (!bedsTouched || !(n >= t.min && n <= t.max)) { $('f-totalBeds').value = t.def; bedsTouched = false; resizeBeds(t.def); }
    if (!facTouched) {
      form.querySelectorAll('[name="facilities"]').forEach(c => { c.checked = S.FAC_DEFAULTS[k].includes(c.value); });
      setRadio('attachedBathroom', S.FAC_DEFAULTS[k].includes('Attached Bathroom') ? 'Yes' : 'No');
    }
    if (!billTouched) form.elements.billingCategory.value = k;
  }

  form.addEventListener('input', e => {
    const el = e.target;
    if (el.hasAttribute('data-sync')) form.querySelectorAll(`[name="${el.name}"]`).forEach(o => { if (o !== el) o.value = el.value; });
    if (el.name === 'description') $('descCount').textContent = `${el.value.length}/500`;
    if (el.name === 'dailyCharge') $('chargeFmt').textContent = el.value !== '' && +el.value >= 0 ? U.money(el.value) : '';
    if (['roomNo', 'bedPrefix', 'startFrom'].includes(el.name)) renumber();
  });
  form.addEventListener('change', e => {
    const el = e.target;
    if (el.hasAttribute('data-sync')) form.querySelectorAll(`[name="${el.name}"]`).forEach(o => { if (o !== el) o.value = el.value; });
    switch (el.name) {
      case 'roomType': onType(); break;
      case 'facilities':
        facTouched = true;
        if (el.value === 'Attached Bathroom') setRadio('attachedBathroom', el.checked ? 'Yes' : 'No');
        break;
      case 'attachedBathroom':
        facTouched = true;
        form.querySelector('[name="facilities"][value="Attached Bathroom"]').checked = el.value === 'Yes';
        break;
      case 'totalBeds': bedsTouched = true; resizeBeds(parseInt(el.value, 10)); break;
      case 'autoNumber': renumber(); break;
      case 'bedType': beds.forEach(b => { if (b.type === prevBedType) b.type = el.value; }); prevBedType = el.value; renderBeds(); break;
      case 'isolation': pressure(); break;
      case 'billingCategory': billTouched = true; break;
      case 'bedAmenities': $('otherAmenityWrap').hidden = !form.querySelector('[name="bedAmenities"][value="Other (Specify)"]').checked; break;
    }
  });

  /* ---------- validation ---------- */
  const req = (d, keys, e) => keys.forEach(k => { if (!String(d[k] ?? '').trim()) e.push([k, 'This field is required.']); });
  const num = v => v !== '' && v !== null && Number.isFinite(Number(v));
  const V = {
    1(d) {
      const e = []; req(d, ['roomNo', 'roomName', 'facility', 'building', 'floor', 'ward', 'roomType', 'recordStatus'], e);
      if (!e.some(x => x[0] === 'roomNo') && S.duplicate(d, editing && editing.id)) e.push(['roomNo', 'This room number already exists in the selected facility and building.']);
      if (String(d.description).length > 500) e.push(['description', 'Description cannot exceed 500 characters.']);
      return e;
    },
    2(d) {
      const e = []; req(d, ['building', 'floor', 'ward', 'layout', 'doors'], e);
      if (d.roomSize !== '' && !(Number(d.roomSize) > 0)) e.push(['roomSize', 'Enter a positive number.']);
      if (d.doors !== '' && !(Number.isInteger(Number(d.doors)) && Number(d.doors) >= 1)) e.push(['doors', 'Enter a whole number of 1 or more.']);
      return e;
    },
    3(d) {
      const e = [], t = T[d.roomType], n = Number(d.totalBeds);
      req(d, ['totalBeds', 'bedType', 'bedPrefix', 'startFrom'], e);
      if (d.totalBeds !== '' && t && !(Number.isInteger(n) && n >= t.min && n <= t.max))
        e.push(['totalBeds', `${d.roomType} rooms allow ${t.min === t.max ? t.min : `${t.min}–${t.max}`} bed(s).`]);
      if (d.startFrom !== '' && !(Number.isInteger(Number(d.startFrom)) && Number(d.startFrom) >= 1)) e.push(['startFrom', 'Enter a whole number of 1 or more.']);
      const names = d.beds.map(b => b.no.trim().toLowerCase());
      if (d.beds.length !== n) e.push(['bedTable', 'The bed list does not match Total Beds.']);
      else if (names.some(x => !x)) e.push(['bedTable', 'Every bed needs a bed number.']);
      else if (new Set(names).size !== names.length) e.push(['bedTable', 'Bed numbers must be unique.']);
      if (d.bedAmenities.includes('Other (Specify)') && !String(d.bedAmenityOther).trim()) e.push(['bedAmenityOther', 'Specify the other amenity.']);
      return e;
    },
    4(d) {
      const e = [];
      if (d.negativePressure === 'Yes' && d.isolation !== 'Yes') e.push(['negativePressure', 'Negative pressure applies to isolation rooms only.']);
      if (d.oxygen === 'Not available' && d.facilities.includes('Oxygen Outlet')) e.push(['oxygen', 'Conflicts with the Oxygen Outlet facility selected in Step 2.']);
      return e;
    },
    5(d) {
      const e = []; req(d, ['billingCategory', 'ratePlan', 'dailyCharge', 'effectiveFrom'], e);
      if (d.dailyCharge !== '' && !(num(d.dailyCharge) && Number(d.dailyCharge) >= 0)) e.push(['dailyCharge', 'Enter a non-negative amount.']);
      if (d.additionalCharges !== '' && !(num(d.additionalCharges) && Number(d.additionalCharges) >= 0)) e.push(['additionalCharges', 'Enter a non-negative amount.']);
      if (d.effectiveFrom && d.effectiveTo && d.effectiveTo < d.effectiveFrom) e.push(['effectiveTo', 'Effective To cannot be before Effective From.']);
      return e;
    }
  };

  function clearErrs() {
    form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    form.querySelectorAll('.rm-err').forEach(x => { x.textContent = ''; });
    $('stepError').hidden = true;
  }
  function showErrs(errs) {
    clearErrs();
    const panel = form.querySelector('.rs-step-panel.active');
    let first = null;
    errs.forEach(([n, m]) => {
      const el = panel.querySelector(`[name="${n}"]`);
      let out = panel.querySelector(`[data-err="${n}"]`);
      if (!out && el) {
        const box = el.closest('.rs-field');
        out = box.querySelector(':scope > .rm-err');
        if (!out) { out = document.createElement('span'); out.className = 'rm-err'; out.setAttribute('role', 'alert'); box.appendChild(out); }
      }
      if (out) out.textContent = m;
      if (el) { el.setAttribute('aria-invalid', 'true'); first = first || el; }
      if (n === 'bedTable') first = first || panel.querySelector('#bedRows input');
    });
    $('stepError').hidden = false;
    (first || $('stepError')).focus();
  }

  /* ---------- navigation ---------- */
  function show(n) {
    step = n;
    form.querySelectorAll('.rs-step-panel').forEach(p => p.classList.toggle('active', +p.dataset.step === n));
    stepper.forEach((b, i) => {
      b.classList.toggle('active', i + 1 === n);
      b.classList.toggle('done', done.has(i + 1) && i + 1 !== n);
      i + 1 === n ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current');
    });
    $('stepCounter').textContent = `Step ${n} of 5`;
    $('backBtn').style.display = n === 1 ? 'none' : '';
    $('continueBtn').style.display = n === 5 ? 'none' : '';
    $('saveBtn').style.display = n === 5 ? '' : 'none';
    clearErrs();
    if (n === 3) renderBeds();
    document.querySelector('.rm-wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function goTo(n) {
    if (n === step) return;
    if (n > step) {
      for (let s = step; s < n; s++) {
        const errs = V[s](collect());
        if (errs.length) { show(s); showErrs(errs); return; }
        done.add(s);
      }
    }
    show(n);
  }
  stepper.forEach((b, i) => b.addEventListener('click', () => goTo(i + 1)));
  $('continueBtn').addEventListener('click', () => goTo(step + 1));
  $('backBtn').addEventListener('click', () => goTo(step - 1));
  $('cancelBtn').addEventListener('click', () => { location.href = 'room-master.html'; });
  form.addEventListener('submit', e => e.preventDefault());

  $('draftBtn').addEventListener('click', () => {
    S.setDraft({ data: collect(), step, savedAt: new Date().toISOString() });
    U.dialog({ title: 'Draft saved', text: 'Your progress is saved on this device. It will not appear in Room Master until you save the room.' });
  });

  $('saveBtn').addEventListener('click', () => {
    for (let s = 1; s <= 5; s++) {
      const errs = V[s](collect());
      if (errs.length) { show(s); showErrs(errs); return; }
    }
    const d = collect();
    try {
      const room = S.save({ ...(editing || {}), ...d, id: editing ? editing.id : undefined, status: S.derive(d.beds) });
      if (!editing) S.clearDraft();
      location.href = `room-master.html?saved=${encodeURIComponent(room.id)}&mode=${editing ? 'updated' : 'created'}`;
    } catch (err) {
      show(1); showErrs([['roomNo', err.message || 'The room could not be saved.']]);
    }
  });

  /* ---------- init ---------- */
  const draft = !editing && S.draft();
  if (editing) {
    fill(editing);
    $('pageTitle').textContent = 'Edit Room';
    document.title = 'Edit Room | Front Office';
    $('crumbCurrent').textContent = 'Edit Room';
    $('roomIdBadge').textContent = editing.id; $('roomIdBadge').hidden = false;
    $('draftBtn').style.display = 'none';
  } else if (draft && draft.data) {
    fill({ ...DEFAULTS, ...draft.data });
    facTouched = bedsTouched = billTouched = true;
    $('draftNotice').hidden = false;
    show(draft.step || 1);
  } else {
    fill(DEFAULTS);
    onType();
  }
  $('discardDraft').addEventListener('click', () => { S.clearDraft(); location.reload(); });
  if (!draft || !draft.data || editing) show(1);
});
