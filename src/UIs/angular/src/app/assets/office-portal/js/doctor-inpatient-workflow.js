(() => {
"use strict";
/* In-Patient Care workflow: five repeatable / living stages, scoped to patient + encounter. */
const repo = window.InpatientRepository;
const params = new URLSearchParams(location.search);
const patientId = params.get("patient");
const $ = id => document.getElementById(id);

const STAGES = [
    { id: "rounds", title: "Daily Rounds", hint: "Repeatable. Each round is saved as a separate, dated record; saved rounds are never overwritten." },
    { id: "coordination", title: "Care Coordination / Case Management", hint: "Begin early and update throughout the stay. Independent of Daily Rounds." },
    { id: "mdt", title: "Daily Multidisciplinary Round", hint: "Repeatable team reviews. Decisions and actions stay traceable until completed." },
    { id: "readiness", title: "Discharge Readiness Assessment", hint: "Reassess whenever the condition or arrangements change. Previous assessments are preserved." },
    { id: "discharge", title: "Discharge", hint: "Final transition of care. Requires physician authorisation and complete documentation." }
];
const ROLES = ["Physician", "Nurse", "Case Manager", "Pharmacist", "Therapist"];
const TONE = { "Not Started": "grey", "In Progress": "blue", "Completed": "green", "Not Applicable": "grey", "Pending": "amber", "Draft": "amber", "Saved": "green", "Final": "green" };
const ROWS = {
    participants: { noun: "participant", ignore: ["role", "date"], key: "name", cols: [["name", "Participant name", "text"], ["role", "Role", "select", ROLES], ["date", "Review date", "date"]] },
    actions: { noun: "action", ignore: ["status"], key: "action", cols: [["action", "Decision / action", "text"], ["responsible", "Responsible person", "text"], ["due", "Due date", "date"], ["status", "Status", "select", repo.ACTION_STATUSES]] },
    meds: { noun: "medication", ignore: [], key: "name", cols: [["name", "Medication name", "text"], ["dose", "Dosage", "text"], ["frequency", "Frequency", "text"], ["duration", "Duration", "text"], ["instructions", "Instructions", "text"]] },
    followUps: { noun: "appointment", ignore: [], key: "department", cols: [["date", "Appointment date", "date"], ["department", "Department / specialty", "text"], ["provider", "Provider", "text"], ["instructions", "Instructions", "text"]] }
};

let patient = null, care = null, active = 0, dirty = false, busy = false;
const ui = { roundId: null, newType: null, clientKey: null, mdtId: null, readinessId: null, preview: false };

/* ---------- utilities ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nl = s => esc(s).replace(/\n/g, "<br>");
const pad = n => String(n).padStart(2, "0");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const today = () => { const d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
const nowTime = () => { const d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
const nowLocal = () => today() + "T" + nowTime();
function fmtD(v) { if (!v) return "—"; const d = new Date(String(v).length === 10 ? v + "T00:00:00" : v); return isNaN(d) ? "—" : pad(d.getDate()) + "-" + MONTHS[d.getMonth()] + "-" + d.getFullYear(); }
function fmtDT(v) { if (!v) return "—"; const d = new Date(v); if (isNaN(d)) return "—"; let h = d.getHours(); const s = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return fmtD(v) + " " + pad(h) + ":" + pad(d.getMinutes()) + " " + s; }
const author = () => ((document.getElementById("dcUserName") || {}).textContent || "Doctor").trim() || "Doctor";
const pill = (label, tone) => `<span class="dc-ip-pill ${tone || TONE[label] || "grey"}">${esc(label)}</span>`;
const dash = v => (v === undefined || v === null || v === "" ? "—" : v);
const trunc = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

/* ---------- form helpers ---------- */
function fld(name, label, type, v, o) {
    o = o || {};
    const id = "f_" + name, val = v == null ? "" : v;
    const req = o.req ? ' <abbr class="ipw-req" title="Required">*</abbr>' : "";
    const show = o.showIf ? ` data-showif="${esc(o.showIf)}"` : "";
    if (type === "checkbox") return `<label class="ipw-check${o.full ? " full" : ""}"${show}><input type="checkbox" id="${id}" name="${name}"${v ? " checked" : ""}> <span>${esc(label)}</span></label>`;
    let c;
    if (type === "textarea") c = `<textarea id="${id}" name="${name}" rows="${o.rows || 3}">${esc(val)}</textarea>`;
    else if (type === "select") c = `<select id="${id}" name="${name}"><option value="">${esc(o.blank || "Select")}</option>${o.opts.map(x => `<option${val === x ? " selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
    else c = `<input id="${id}" name="${name}" type="${type}" value="${esc(val)}"${type === "number" ? ` step="${o.step || "any"}"` : ""}${o.min != null ? ` min="${o.min}"` : ""}${o.max != null ? ` max="${o.max}"` : ""}>`;
    const full = o.full || (type === "textarea" && !o.half);
    return `<label class="ipw-field${full ? " full" : ""}" for="${id}"${show}><span>${esc(label)}${req}</span>${c}</label>`;
}
function sec(title, inner, open, note) {
    return `<details class="ipw-sec"${open === false ? "" : " open"}><summary>${esc(title)}${note ? ` <small>${esc(note)}</small>` : ""}</summary><div class="ipw-form">${inner}</div></details>`;
}
function rowHtml(kind, r) {
    r = r || {};
    return `<div class="ipw-row">${ROWS[kind].cols.map(([k, l, t, o]) => {
        const val = r[k] == null ? "" : r[k];
        const ctl = t === "select"
            ? `<select data-k="${k}"><option value="">Select</option>${o.map(x => `<option${val === x ? " selected" : ""}>${esc(x)}</option>`).join("")}</select>`
            : `<input data-k="${k}" type="${t}" value="${esc(val)}">`;
        return `<label class="ipw-cell"><small>${esc(l)}</small>${ctl}</label>`;
    }).join("")}<button type="button" class="dc-ip-btn small" data-rm-row aria-label="Remove ${ROWS[kind].noun}">Remove</button></div>`;
}
function rowsBlock(kind, list, defaults) {
    const rows = list && list.length ? list : (defaults || [{}]);
    return `<div class="ipw-rows-wrap full"><div class="ipw-rows" data-rows="${kind}">${rows.map(r => rowHtml(kind, r)).join("")}</div><button type="button" class="dc-ip-btn small" data-add-row="${kind}">+ Add ${ROWS[kind].noun}</button></div>`;
}
function collect(root) {
    const v = {};
    root.querySelectorAll("[name]").forEach(n => { v[n.name] = n.type === "checkbox" ? n.checked : String(n.value).trim(); });
    root.querySelectorAll("[data-rows]").forEach(c => {
        v[c.dataset.rows] = Array.from(c.querySelectorAll(".ipw-row")).map(row => {
            const o = {}; row.querySelectorAll("[data-k]").forEach(i => { o[i.dataset.k] = String(i.value).trim(); }); return o;
        });
    });
    return v;
}
const blankRow = (kind, r) => Object.keys(r).filter(k => ROWS[kind].ignore.indexOf(k) < 0).every(k => !r[k]);
function cleanRows(kind, list, errs, label, required) {
    const out = [];
    (list || []).forEach((r, i) => {
        if (blankRow(kind, r)) return;
        const missing = (required || [ROWS[kind].key]).filter(k => !r[k]);
        if (missing.length) errs.push({ msg: label + " row " + (i + 1) + " is incomplete (" + missing.join(", ") + " required)." });
        out.push(r);
    });
    return out;
}
function need(v, errs, list) { list.forEach(([k, l]) => { if (!v[k]) errs.push({ field: k, msg: l + " is required." }); }); }
function applyConditionals() {
    const form = $("stageForm"); if (!form) return;
    form.querySelectorAll("[data-showif]").forEach(n => {
        const [name, value] = n.dataset.showif.split("=");
        const src = form.elements[name];
        n.hidden = !(src && src.value === value);
    });
}

/* ---------- notices, dirty guard ---------- */
function notice(msg, warn) {
    const n = $("workflowNotice");
    n.innerHTML = Array.isArray(msg) ? "<strong>Please correct the following:</strong><ul>" + msg.map(m => "<li>" + esc(m) + "</li>").join("") + "</ul>" : esc(msg);
    n.hidden = false; n.classList.toggle("warning", !!warn);
    if (n.scrollIntoView) n.scrollIntoView({ block: "nearest" });
}
function clearNotice() { $("workflowNotice").hidden = true; }
function showErrors(errs) {
    document.querySelectorAll("#stageForm [aria-invalid]").forEach(n => n.removeAttribute("aria-invalid"));
    let first = null;
    errs.forEach(e => { const n = e.field && document.getElementById("f_" + e.field); if (n) { n.setAttribute("aria-invalid", "true"); first = first || n; } });
    notice(errs.map(e => e.msg), true);
    if (first) first.focus();
}
function guard() { return !dirty || window.confirm("You have unsaved changes on this page. Leave without saving?"); }
function afterSave(r, okMsg, then) {
    if (!r.ok) { notice(r.error || "Unable to save.", true); return false; }
    dirty = false; refreshCare(); if (then) then(r); renderAll();
    notice(okMsg + (r.persisted ? "" : " Browser storage is unavailable; this will be lost when the page is closed."), !r.persisted);
    return true;
}
function refreshCare() { care = repo.getCare(patientId); }
const isFinal = () => !!(care.discharge && care.discharge.status === "final");

/* ---------- shell ---------- */
function stageStatus() { return repo.getStageStatuses(patientId); }
function renderNav() {
    const st = stageStatus();
    $("workflowNav").innerHTML = STAGES.map((s, i) => `<button type="button" class="ipw-nav-item${i === active ? " active" : ""}" data-step="${i}"${i === active ? ' aria-current="step"' : ""}><span class="ipw-step-no">${st[s.id].label === "Completed" ? "✓" : i + 1}</span><span>${esc(s.title)}</span><small><b class="ipw-st ${TONE[st[s.id].label]}">${esc(st[s.id].label)}</b> ${esc(st[s.id].detail)}</small></button>`).join("");
}
function renderBanner() {
    const p = patient, c = repo.getCareSummary(patientId);
    $("patientBanner").innerHTML = `<div><strong>${esc(p.name)}</strong><span>${esc(p.mrn)} · ${esc(p.age)} y · ${esc(p.gender)}</span><span>Allergies: ${esc(p.allergies)}</span></div>
<div><strong>${esc(p.ward)} · ${esc(p.room)} / ${esc(p.bed)}</strong><span>Admitted ${esc(fmtD(p.admittedOn))}</span><span>Encounter ${esc(c.encounterId)}</span></div>
<div><strong>${esc(p.diagnosis)}</strong><span>Attending: ${esc(p.attending)}</span></div>
<div>${pill(p.status, { "Stable": "green", "Under Observation": "blue", "Review Due": "amber", "Critical": "red", "Discharge Planning": "purple" }[p.status])}<span>${esc(p.acuity)} acuity</span></div>`;
}
function renderAll() { renderNav(); renderStage(); }
function renderStage() {
    const s = STAGES[active], st = stageStatus()[s.id];
    const body = { rounds: viewRounds, coordination: viewCoordination, mdt: viewMdt, readiness: viewReadiness, discharge: viewDischarge }[s.id]();
    $("workflowPanel").innerHTML = `<div class="ipw-stage-head"><div><p class="ipw-kicker">STAGE ${active + 1} OF ${STAGES.length}</p><h2>${esc(s.title)}</h2><p>${esc(s.hint)}</p></div><span class="ipw-save-state ${TONE[st.label]}">${esc(st.label)} · ${esc(st.detail)}</span></div>${isFinal() && s.id !== "discharge" ? '<p class="ipw-banner info">This encounter has been discharged. Records are preserved for review; new entries are closed.</p>' : ""}${body}`;
    dirty = false; applyConditionals(); liveUpdate(); updateButtons();
}
function updateButtons() {
    const id = STAGES[active].id, closed = isFinal();
    const cfg = {
        rounds: { draft: "Save as Draft", save: "Save Round" }, coordination: { save: "Save Coordination" }, mdt: { save: "Save Review" },
        readiness: { save: "Save Assessment" }, discharge: { draft: "Save as Draft", save: null, finalize: "Finalise Discharge" }
    }[id];
    const form = $("stageForm"), locked = closed || !form || form.querySelector("fieldset:disabled");
    $("saveDraftBtn").hidden = !cfg.draft; $("saveDraftBtn").textContent = cfg.draft || ""; $("saveDraftBtn").disabled = !!locked;
    $("saveBtn").hidden = !cfg.save; $("saveBtn").textContent = cfg.save || ""; $("saveBtn").disabled = !!locked;
    $("finalizeBtn").hidden = !cfg.finalize; $("finalizeBtn").disabled = !!locked;
    $("previousStep").disabled = active === 0; $("nextStep").disabled = active === STAGES.length - 1;
}
function goStage(i) { if (i === active || i < 0 || i >= STAGES.length) return; if (!guard()) return; active = i; ui.preview = false; clearNotice(); renderAll(); }
function liveUpdate() {
    const form = $("stageForm"); if (!form) return;
    const id = STAGES[active].id, v = collect(form);
    if (id === "rounds" && $("liveSummary")) $("liveSummary").innerHTML = summaryTable(form.dataset.roundType, v);
    if (id === "coordination" && $("outstandingBox")) $("outstandingBox").innerHTML = coordOutstanding(v);
    if (id === "readiness" && $("readinessSummary")) $("readinessSummary").innerHTML = readinessSummary(readItems(v));
}

const ROUND_TYPES = {
    physician: { label: "Physician Round", plural: "Physician rounds", role: "Physician", tone: "blue" },
    nursing: { label: "Nursing Round", plural: "Nursing rounds", role: "Nurse", tone: "purple" }
};
const LEGACY_LABELS = {
    roundDate: "Round date", roundTime: "Round time", providerName: "Provider", providerRole: "Role", diagnosis: "Diagnosis / problem list",
    overnightFlag: "Overnight events", overnightNotes: "Overnight notes", symptoms: "Symptoms", painScore: "Pain score", temp: "Temperature (°C)",
    bp: "Blood pressure", hr: "Heart rate", rr: "Respiratory rate", spo2: "SpO₂ (%)", vitalTrend: "Vital sign trends", intakeOutput: "Intake and output",
    weightChange: "Weight changes", labs: "Laboratory results", imaging: "Imaging results", monitor: "Monitor readings", progressNotes: "Progress notes",
    assessment: "Clinical assessment", plan: "Treatment plan", medChangeType: "Medication changes", medChanges: "Medication adjustments", newOrders: "New orders",
    consults: "Consultation recommendations", nursingNotes: "Nursing notes", mobility: "Mobility", diet: "Diet tolerance", wound: "Wound status",
    fallIncident: "Fall incident", fallNotes: "Fall details", patientEducation: "Patient education", pt: "Physical therapy progress",
    ot: "Occupational therapy progress", speech: "Speech therapy progress", barrierFlag: "Discharge barriers", barrierNotes: "Discharge barrier notes",
    expectedDischarge: "Expected discharge date", educationStatus: "Patient education status"
};
const OBJECTIVE_KEYS = ["temp", "bp", "hr", "rr", "spo2", "painScore", "examFindings", "investigations"];
let modalOpener = null;

const roundLabel = round => ROUND_TYPES[round.type].label + " " + round.number;
const roundCounts = () => repo.getRoundCounts(patientId);
function vitalsText(v) {
    return [v.temp && "Temp " + v.temp + " °C", v.bp && "BP " + v.bp, v.hr && "HR " + v.hr, v.rr && "RR " + v.rr, v.spo2 && "SpO₂ " + v.spo2 + "%"].filter(Boolean).join(", ");
}
function summaryTable(type, v) {
    const join = (a, b, sep) => [a, b].filter(Boolean).join(sep || " — ");
    const common = [
        ["Date", join(v.roundDate && fmtD(v.roundDate), v.roundTime, " ")],
        ["Author", join(v.providerName, ROUND_TYPES[type].role && "(" + ROUND_TYPES[type].role + ")", " ")],
        ["Vitals", vitalsText(v)],
        ["Pain Score", v.painScore !== "" && v.painScore != null ? v.painScore + " / 10" : ""]
    ];
    const specific = type === "nursing" ? [
        ["Patient status", v.patientStatus], ["Reported concerns", v.reportedConcerns], ["Interventions", v.interventions], ["Response", v.response],
        ["Next actions", v.nextActions], ["Escalation", join(v.escalationNeeded, v.escalationDetails)], ["Patient education", v.patientEducation]
    ] : [
        ["Subjective", v.subjective], ["Examination / investigations", join(v.examFindings, v.investigations, " | ")], ["Assessment", v.assessment], ["Plan", v.plan],
        ["Discharge barriers", v.barriers], ["Expected discharge date", v.expectedDischarge && fmtD(v.expectedDischarge)]
    ];
    return `<div class="ipw-table-wrap"><table class="ipw-table ipw-summary"><thead><tr><th scope="col">Category</th><th scope="col">Data</th></tr></thead><tbody>${common.concat(specific).map(([k, d]) => `<tr><th scope="row">${esc(k)}</th><td>${d ? nl(d) : '<span class="ipw-muted">—</span>'}</td></tr>`).join("")}</tbody></table></div>`;
}
function roundHistory(selectedId) {
    const rounds = care.rounds.slice().sort((a, b) => String(b.roundAt).localeCompare(String(a.roundAt)) || String(b.createdAt).localeCompare(String(a.createdAt)));
    const counts = roundCounts();
    const chips = Object.keys(ROUND_TYPES).map(k => `<span class="ipw-type-chip ${ROUND_TYPES[k].tone}">${ROUND_TYPES[k].plural}: ${counts[k].count}/${counts[k].max}</span>`).join("");
    const addButton = isFinal() ? "" : '<button type="button" class="dc-ip-btn primary" data-add-round aria-haspopup="dialog">+ Add Round</button>';
    const body = rounds.length
        ? `<div class="ipw-table-wrap ipw-scroll ipw-history-scroll"><table class="ipw-table"><caption class="ipw-sr">Round history, newest first</caption><thead><tr><th scope="col">Round</th><th scope="col">Date / time</th><th scope="col">Author</th><th scope="col">Status</th><th scope="col"><span class="ipw-sr">Action</span></th></tr></thead><tbody>${rounds.map((r, i) => `<tr${r.id === selectedId ? ' class="current" aria-current="true"' : ""}><td>${pill(roundLabel(r), ROUND_TYPES[r.type].tone)}${i === 0 ? ' <span class="ipw-latest">Latest</span>' : ""}</td><td>${esc(fmtDT(r.roundAt))}</td><td>${esc(r.provider)}<br><small class="ipw-muted">${esc(r.role)}</small></td><td>${pill(r.status === "draft" ? "Draft" : "Saved")}</td><td><button type="button" class="dc-ip-btn small" data-open-round="${esc(r.id)}" aria-label="${r.status === "draft" && r.schema === 2 ? "Edit draft" : "Review"} ${esc(roundLabel(r))}">${r.status === "draft" && r.schema === 2 ? "Edit draft" : "Review"}</button></td></tr>`).join("")}</tbody></table></div>`
        : `<div class="ipw-empty-state"><strong>No rounds recorded yet</strong><p>Add a physician or nursing round to start this patient's clinical progress history.</p>${addButton}</div>`;
    return `<section class="ipw-card ipw-history" aria-labelledby="roundHistoryTitle"><div class="ipw-card-head"><div><h3 id="roundHistoryTitle">Round History</h3><small>Newest first · each patient can have up to ${repo.ROUND_LIMIT} physician and ${repo.ROUND_LIMIT} nursing rounds</small></div>${addButton}</div><div class="ipw-chips ipw-history-chips">${chips}</div>${body}</section>`;
}
function sharedSummary() {
    const p = patient;
    const items = [["Allergies", p.allergies], ["Primary diagnosis", p.diagnosis], ["Admitted", fmtD(p.admittedOn)], ["Location", p.ward + " · " + p.room + " / " + p.bed], ["Attending", p.attending], ["Background", p.summary]];
    return `<section class="ipw-card ipw-shared"><div class="ipw-card-head"><div><h3>Shared patient information</h3><small>From the patient record. Read-only and not repeated in each round.</small></div></div><dl class="ipw-dl">${items.map(([k, d]) => `<div><dt>${esc(k)}</dt><dd>${esc(dash(d))}</dd></div>`).join("")}</dl></section>`;
}
function previousReference(type, currentId) {
    const prior = care.rounds.filter(r => r.type === type && r.status === "saved" && r.schema === 2 && r.id !== currentId).sort((a, b) => String(b.roundAt).localeCompare(String(a.roundAt)))[0];
    const o = patient.observations || {};
    const chart = vitalsText({ temp: o.temp, bp: o.bp, hr: o.hr, rr: o.rr, spo2: o.spo2 });
    const key = type === "nursing" ? "patientStatus" : "assessment";
    const earlier = prior ? `<li><strong>${esc(roundLabel(prior))}</strong> · ${esc(fmtDT(prior.roundAt))}: ${esc(vitalsText(prior.values) || "no vital signs recorded")}${prior.values[key] ? " — " + esc(trunc(prior.values[key], 120)) : ""}</li>` : `<li>No earlier saved ${esc(ROUND_TYPES[type].label.toLowerCase())}.</li>`;
    return `<section class="ipw-card ipw-reference"><div class="ipw-card-head"><div><h3>Previous values (reference only)</h3><small>Not copied into this round and not re-assessed. Enter current findings below.</small></div></div><ul class="ipw-ref-list"><li><strong>Latest chart observations</strong> · ${esc(fmtDT(o.recordedAt))}: ${esc(chart || "none")}</li>${earlier}</ul></section>`;
}
function vitalFields(f) {
    return f("temp", "Temperature (°C)", "number") + f("bp", "Blood pressure (mmHg)", "text") + f("hr", "Heart rate (bpm)", "number") + f("rr", "Respiratory rate (/min)", "number") + f("spo2", "SpO₂ (%)", "number", { min: 0, max: 100 }) + f("painScore", "Pain score (0–10)", "number", { min: 0, max: 10, step: 1 });
}
function roundFormFields(type, v) {
    const f = (n, l, t, o) => fld(n, l, t, v[n], o);
    const info = ROUND_TYPES[type];
    const infoSection = sec("Round information", f("roundDate", "Round date", "date", { req: 1 }) + f("roundTime", "Round time", "time", { req: 1 }) + f("providerName", type === "nursing" ? "Nurse name" : "Physician name", "text", { req: 1 }) + `<label class="ipw-field"><span>Role</span><input type="text" value="${esc(info.role)}" readonly></label>`);
    const summarySection = sec("Round summary", '<div class="full"><div id="liveSummary"></div></div>', false, "generated from this entry");
    if (type === "nursing") {
        return infoSection +
            sec("Assessment", f("patientStatus", "Current patient status", "textarea", { req: 1 }) + f("reportedConcerns", "Symptoms or concerns reported by the patient", "textarea", { rows: 2 }) + vitalFields(f) + f("mobility", "Mobility / activity", "select", { opts: ["Independent", "Supervised", "Assisted (1 person)", "Assisted (2+ people)", "Bed rest"] }) + f("diet", "Diet tolerance", "select", { opts: ["Tolerating diet", "Partial intake", "Poor intake", "Nil by mouth", "Enteral / parenteral feeding"] }) + f("woundSkin", "Wound / skin status", "text") + f("fallIncident", "Fall incident", "select", { opts: ["None", "Yes"] }) + f("fallNotes", "Fall incident details", "text", { showIf: "fallIncident=Yes" })) +
            sec("Nursing actions / interventions", f("interventions", "Care and interventions performed", "textarea", { req: 1 }) + f("patientEducation", "Patient education provided", "textarea", { rows: 2 })) +
            sec("Response / evaluation", f("response", "Patient response or outcome", "textarea", { req: 1 })) +
            sec("Next actions", f("nextActions", "Outstanding care and monitoring needs", "textarea", { rows: 2 }) + f("escalationNeeded", "Escalation needed", "select", { opts: ["No", "Yes"] }) + f("escalationDetails", "Escalation details (who was informed)", "textarea", { showIf: "escalationNeeded=Yes", rows: 2 })) +
            summarySection;
    }
    return infoSection +
        sec("S — Subjective", f("subjective", "Patient-reported symptoms and concerns", "textarea", { req: 1 }) + f("intervalEvents", "Events since the previous round", "textarea", { rows: 2 })) +
        sec("O — Objective", '<p class="full ipw-muted">Enter current findings. Add at least one finding, or confirm that there are none to record.</p>' + vitalFields(f) + f("examFindings", "Examination findings", "textarea", { rows: 2 }) + f("investigations", "Investigation results (laboratory, imaging, monitor)", "textarea", { rows: 2 }) + f("noObjective", "No new objective findings to record", "checkbox", { full: 1 })) +
        sec("A — Assessment", f("assessment", "Clinical assessment", "textarea", { req: 1 }) + f("activeProblems", "Active problems", "textarea", { rows: 2 })) +
        sec("P — Plan", f("plan", "Plan", "textarea", { req: 1 }) + f("ordersReferrals", "Investigations, orders and referrals", "textarea", { half: 1, rows: 2 }) + f("followUp", "Monitoring and follow-up", "textarea", { half: 1, rows: 2 })) +
        sec("Discharge outlook", f("barriers", "Discharge barriers", "textarea", { half: 1, rows: 2 }) + f("expectedDischarge", "Expected discharge date", "date"), false, "optional") +
        summarySection;
}
function legacyReview(rec) {
    const rows = Object.keys(rec.values).filter(k => rec.values[k] !== "" && rec.values[k] != null && rec.values[k] !== false);
    return `<p class="ipw-banner info">Recorded in the earlier combined format. Shown read-only exactly as saved.</p><div class="ipw-table-wrap"><table class="ipw-table ipw-summary"><tbody>${rows.map(k => `<tr><th scope="row">${esc(LEGACY_LABELS[k] || k)}</th><td>${nl(rec.values[k])}</td></tr>`).join("")}</tbody></table></div>`;
}
function roundEntry(cur, type) {
    const readOnly = isFinal() || !!(cur && cur.status === "saved");
    const v = cur ? cur.values : { roundDate: today(), roundTime: nowTime(), providerName: author() };
    const counts = roundCounts();
    const mode = cur
        ? (cur.status === "draft" ? "Editing draft · " + roundLabel(cur) : "Reviewing saved " + roundLabel(cur) + " · read-only · saved " + fmtDT(cur.savedAt) + " by " + cur.updatedBy)
        : "New " + ROUND_TYPES[type].label + " " + (counts[type].count + 1) + " of " + counts[type].max;
    const closeLabel = cur && cur.status === "saved" ? "Close review" : "Cancel";
    return `<div class="ipw-modebar"><p class="ipw-mode" aria-live="polite">${esc(mode)}</p><button type="button" class="dc-ip-btn small" id="closeRoundBtn">${closeLabel}</button></div>${sharedSummary()}${readOnly ? "" : previousReference(type, cur && cur.id)}
<form id="stageForm" class="ipw-formwrap" data-round-type="${type}" novalidate>${readOnly ? "" : '<p class="ipw-legend"><abbr class="ipw-req" title="Required">*</abbr> Required to save the round. All other fields are optional. Drafts only need date, time and name.</p>'}<fieldset class="ipw-fieldset"${readOnly ? " disabled" : ""}>${roundFormFields(type, v)}</fieldset></form>`;
}
function viewRounds() {
    const cur = ui.roundId ? care.rounds.find(r => r.id === ui.roundId) : null;
    const type = cur ? cur.type : ui.newType;
    const history = roundHistory(cur && cur.id);
    if (cur && cur.schema !== 2) return history + `<div class="ipw-modebar"><p class="ipw-mode">Reviewing saved ${esc(roundLabel(cur))} · read-only</p><button type="button" class="dc-ip-btn small" id="closeRoundBtn">Close review</button></div>` + legacyReview(cur);
    if (!cur && !type) return history + '<p class="ipw-empty-prompt">Select a round from the history to review it, or choose Add Round to start a new entry.</p>';
    return history + roundEntry(cur, type);
}
function openRound(id) {
    if (!guard()) return;
    ui.roundId = id; ui.newType = null; ui.clientKey = null;
    clearNotice(); renderStage();
}
function closeRound() {
    if (!guard()) return;
    ui.roundId = null; ui.newType = null; ui.clientKey = null;
    clearNotice(); renderStage();
}
function renderRoundOptions() {
    const counts = roundCounts();
    $("roundTypeCounts").textContent = Object.keys(ROUND_TYPES).map(k => ROUND_TYPES[k].plural.replace(/^./, c => c.toUpperCase()) + ": " + counts[k].count + "/" + counts[k].max).join(" · ");
    $("roundTypeOptions").innerHTML = Object.keys(ROUND_TYPES).map(k => {
        const full = counts[k].count >= counts[k].max;
        return `<div class="ipw-type-choice"><button type="button" class="ipw-type-option ${ROUND_TYPES[k].tone}" data-new-round="${k}"${full ? ' disabled aria-describedby="roundFull-' + k + '"' : ""}><strong>${esc(ROUND_TYPES[k].label)}</strong><span>${counts[k].count}/${counts[k].max} recorded</span></button>${full ? `<p class="ipw-type-msg" id="roundFull-${k}" role="status">Maximum of ${counts[k].max} ${k} rounds reached for this patient.</p>` : ""}</div>`;
    }).join("");
}
function openRoundModal(opener) {
    if (isFinal() || !guard()) return;
    modalOpener = opener || null;
    renderRoundOptions();
    $("roundTypeModal").hidden = false;
    document.body.classList.add("dc-ip-modal-open");
    const first = $("roundTypeOptions").querySelector("button:not([disabled])") || $("roundTypeModal").querySelector(".dc-ip-dialog");
    first.focus();
}
function closeRoundModal() {
    $("roundTypeModal").hidden = true;
    document.body.classList.remove("dc-ip-modal-open");
    if (modalOpener && document.contains(modalOpener)) modalOpener.focus();
    modalOpener = null;
}
function chooseRoundType(type) {
    if (!ROUND_TYPES[type]) return;
    const counts = roundCounts();
    if (counts[type].count >= counts[type].max) { renderRoundOptions(); return; }
    ui.roundId = null; ui.newType = type; ui.clientKey = "rk-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    modalOpener = null;
    closeRoundModal();
    clearNotice(); renderStage();
    const first = $("f_roundDate");
    if (first) first.focus();
}
function handleModalKeys(e) {
    const modal = $("roundTypeModal");
    if (modal.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closeRoundModal(); return; }
    if (e.key !== "Tab") return;
    const focusable = Array.from(modal.querySelectorAll("button:not([disabled])"));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function hasObjective(v) {
    return v.noObjective || OBJECTIVE_KEYS.some(k => v[k] !== "" && v[k] != null);
}
function saveRounds(mode) {
    const form = $("stageForm"); if (!form || busy) return;
    const cur = ui.roundId ? care.rounds.find(r => r.id === ui.roundId) : null;
    if (cur && cur.status === "saved") return notice("Saved rounds are read-only.", true);
    const type = form.dataset.roundType, v = collect(form), errs = [];
    need(v, errs, [["roundDate", "Round date"], ["roundTime", "Round time"], ["providerName", type === "nursing" ? "Nurse name" : "Physician name"]]);
    if (mode === "saved") {
        if (type === "nursing") need(v, errs, [["patientStatus", "Current patient status"], ["interventions", "Care and interventions performed"], ["response", "Patient response or outcome"]]);
        else {
            need(v, errs, [["subjective", "Subjective"], ["assessment", "Clinical assessment"], ["plan", "Plan"]]);
            if (!hasObjective(v)) errs.push({ field: "noObjective", msg: "Enter current objective findings, or confirm that there are none to record." });
        }
    }
    if (v.painScore !== "" && (Number(v.painScore) < 0 || Number(v.painScore) > 10)) errs.push({ field: "painScore", msg: "Pain score must be between 0 and 10." });
    if (v.spo2 !== "" && (Number(v.spo2) < 0 || Number(v.spo2) > 100)) errs.push({ field: "spo2", msg: "SpO₂ must be between 0 and 100." });
    if (errs.length) return showErrors(errs);
    busy = true;
    const r = repo.saveRound(patientId, { id: ui.roundId, type, clientKey: ui.clientKey, status: mode, values: v, author: author(), at: new Date().toISOString() });
    busy = false;
    if (!r.ok && r.limitReached) { refreshCare(); renderNav(); }
    const label = ROUND_TYPES[type].label;
    afterSave(r, mode === "saved" ? label + " saved to the patient record." : "Draft " + label.toLowerCase() + " saved.", x => { ui.roundId = x.record.id; ui.newType = null; });
}

/* =====================  STAGE 2: CARE COORDINATION  ===================== */
function coordOutstanding(v) {
    const items = repo.ARRANGEMENTS.filter(a => { const s = v["arr_" + a.id + "_status"]; return s !== "Completed" && s !== "Not Applicable"; });
    const head = `<h4>Outstanding discharge requirements</h4>`;
    if (!v.disposition) return head + '<p class="ipw-warn-text">Planned discharge disposition has not been set.</p>' + list(items);
    return head + (items.length ? list(items) : '<p class="ipw-ok-text">All arrangements are completed or not applicable.</p>');
    function list(arr) { return arr.length ? `<ul>${arr.map(a => `<li><strong>${esc(a.label)}</strong> — ${esc(v["arr_" + a.id + "_status"] || "Pending")}${v["arr_" + a.id + "_owner"] ? " · " + esc(v["arr_" + a.id + "_owner"]) : " · no responsible staff recorded"}</li>`).join("")}</ul>` : ""; }
}
function viewCoordination() {
    const rec = care.coordination, v = Object.assign({}, rec ? rec.values : {});
    const arr = rec ? rec.arrangements || {} : {};
    repo.ARRANGEMENTS.forEach(a => { v["arr_" + a.id + "_status"] = (arr[a.id] && arr[a.id].status) || "Pending"; v["arr_" + a.id + "_owner"] = (arr[a.id] && arr[a.id].owner) || ""; });
    const ro = isFinal(), f = (n, l, t, o) => fld(n, l, t, v[n], o);
    const tracker = `<div class="full ipw-table-wrap"><table class="ipw-table"><thead><tr><th scope="col">Arrangement</th><th scope="col">Status</th><th scope="col">Responsible staff</th></tr></thead><tbody>${repo.ARRANGEMENTS.map(a => `<tr><th scope="row">${esc(a.label)}</th><td>${fld("arr_" + a.id + "_status", a.label + " status", "select", v["arr_" + a.id + "_status"], { opts: repo.ITEM_STATUSES, blank: "Select" }).replace('<span>', '<span class="ipw-sr">')}</td><td>${fld("arr_" + a.id + "_owner", a.label + " responsible staff", "text", v["arr_" + a.id + "_owner"]).replace('<span>', '<span class="ipw-sr">')}</td></tr>`).join("")}</tbody></table></div>`;
    const log = rec && rec.log && rec.log.length ? `<div class="ipw-card"><div class="ipw-card-head"><h3>Update history</h3></div><ul class="ipw-log">${rec.log.slice(-8).reverse().map(l => `<li><strong>${esc(fmtDT(l.at))}</strong> · ${esc(l.by)} — ${esc(l.text)}</li>`).join("")}</ul></div>` : "";
    return `<p class="ipw-mode">${rec ? "Last updated " + esc(fmtDT(rec.updatedAt)) + " by " + esc(rec.updatedBy) : "No coordination record yet. Start early and update as plans change."}</p>
<form id="stageForm" class="ipw-formwrap" novalidate><fieldset class="ipw-fieldset"${ro ? " disabled" : ""}>
${sec("Arrangement tracker and outstanding requirements", tracker + '<div class="full ipw-callout" id="outstandingBox"></div>')}
${sec("A. Discharge Planning", f("expectedDischarge", "Expected discharge date", "date") + f("disposition", "Planned discharge disposition", "select", { opts: ["Home", "Home Health", "Rehabilitation", "Skilled Nursing Facility"], req: 1 }))}
${sec("B. Social Determinants of Health", f("living", "Living arrangements", "textarea", { half: 1, rows: 2 }) + f("financial", "Financial or access-related concerns", "textarea", { half: 1, rows: 2 }) + f("homeSupport", "Home support requirements", "textarea", { half: 1, rows: 2 }) + f("otherNeeds", "Other relevant needs", "textarea", { half: 1, rows: 2 }))}
${sec("C. Transportation", f("transportRequired", "Transportation required?", "select", { opts: ["Yes", "No", "Not yet determined"] }) + f("transportMode", "Arrangement", "select", { opts: ["Family / caregiver transport", "Hospital-arranged transport", "Other arrangement"], showIf: "transportRequired=Yes" }) + f("transportNotes", "Transportation details", "textarea", { showIf: "transportRequired=Yes", rows: 2 }))}
${sec("D. Equipment Needs", '<div class="full ipw-checks">' + f("eqWheelchair", "Wheelchair", "checkbox") + f("eqWalker", "Walker / mobility aid", "checkbox") + f("eqOxygen", "Oxygen", "checkbox") + "</div>" + f("eqOther", "Other medical equipment", "text") + f("eqDelivery", "Equipment delivery status", "select", { opts: ["Not required", "Pending", "Ordered", "Delivered"] }))}
${sec("E. Insurance", f("insStatus", "Insurance authorization status", "select", { opts: ["Not required", "Not submitted", "Pending", "Approved", "Denied"] }) + f("authRef", "Authorization reference", "text") + f("insPending", "Pending approvals", "textarea", { half: 1, rows: 2 }) + f("insNotes", "Relevant notes", "textarea", { half: 1, rows: 2 }))}
${sec("F. Family / Caregiver", f("caregiverName", "Primary caregiver", "text") + f("caregiverRel", "Relationship", "text") + f("caregiverAvail", "Availability", "text") + f("caregiverSupport", "Caregiver support requirements", "textarea", { rows: 2 }))}
</fieldset></form>${log}`;
}
function saveCoordination() {
    const form = $("stageForm"); if (!form || busy) return;
    const all = collect(form), errs = [], values = {}, arrangements = {};
    Object.keys(all).forEach(k => { if (k.indexOf("arr_") !== 0) values[k] = all[k]; });
    need(all, errs, [["disposition", "Planned discharge disposition"]]);
    repo.ARRANGEMENTS.forEach(a => {
        const s = all["arr_" + a.id + "_status"] || "Pending", o = all["arr_" + a.id + "_owner"] || "";
        arrangements[a.id] = { status: s, owner: o };
        if ((s === "In Progress" || s === "Completed") && !o) errs.push({ field: "arr_" + a.id + "_owner", msg: a.label + ": responsible staff member is required for " + s + " arrangements." });
    });
    if (errs.length) return showErrors(errs);
    const out = repo.arrangementsOutstanding({ arrangements });
    const r = repo.saveCoordination(patientId, { values, arrangements, author: author(), at: new Date().toISOString(), summary: "Coordination updated · " + (out.length ? out.length + " arrangement(s) outstanding" : "all arrangements complete") });
    afterSave(r, "Care coordination record updated.");
}

/* =====================  STAGE 3: MULTIDISCIPLINARY ROUND  ===================== */
function openActionsTable() {
    const open = repo.openActions(care);
    if (!open.length) return '<p class="ipw-ok-text">No outstanding team actions.</p>';
    return `<div class="ipw-table-wrap"><table class="ipw-table"><thead><tr><th scope="col">Action</th><th scope="col">Responsible</th><th scope="col">Due</th><th scope="col">From review</th><th scope="col">Status</th></tr></thead><tbody>${open.map(a => { const overdue = a.due && a.due < today(); return `<tr><td>${esc(a.action)}</td><td>${esc(dash(a.responsible))}</td><td>${esc(fmtD(a.due))}${overdue ? ' <span class="ipw-flag">Overdue</span>' : ""}</td><td>${esc(fmtDT(a.reviewAt))}</td><td><select data-act-review="${esc(a.reviewId)}" data-act-id="${esc(a.id)}" aria-label="Status for ${esc(a.action)}">${repo.ACTION_STATUSES.map(s => `<option${s === a.status ? " selected" : ""}>${s}</option>`).join("")}</select></td></tr>`; }).join("")}</tbody></table></div>`;
}
function viewMdt() {
    const reviews = care.mdt.slice().sort((a, b) => String(a.reviewAt).localeCompare(String(b.reviewAt)));
    const cur = ui.mdtId ? care.mdt.find(r => r.id === ui.mdtId) : null;
    const ro = isFinal() || !!cur;
    const v = cur ? cur.values : { reviewAt: nowLocal() };
    const f = (n, l, t, o) => fld(n, l, t, v[n], o);
    const parts = cur ? cur.participants : ROLES.map(r => ({ name: r === "Physician" ? patient.attending : "", role: r, date: today() }));
    const barriers = [["bar_clinical", "Clinical instability"], ["bar_investigations", "Pending investigations"], ["bar_homeSupport", "Home support"], ["bar_equipment", "Equipment requirements"], ["bar_insurance", "Insurance issues"], ["bar_other", "Other barriers"]];
    const hist = reviews.length ? `<div class="ipw-table-wrap ipw-scroll"><table class="ipw-table"><thead><tr><th scope="col">Review date / time</th><th scope="col">Condition</th><th scope="col">Readiness</th><th scope="col">Open actions</th><th scope="col"><span class="ipw-sr">Action</span></th></tr></thead><tbody>${reviews.map(r => { const o = (r.actions || []).filter(a => a.status !== "Completed").length; return `<tr${r.id === ui.mdtId ? ' class="current"' : ""}><td>${esc(fmtDT(r.reviewAt))}</td><td>${esc(dash(r.values.condition))}</td><td>${esc(dash(r.values.mdtReadiness))}</td><td>${o} of ${(r.actions || []).length}</td><td><button type="button" class="dc-ip-btn small" data-open-mdt="${esc(r.id)}">View</button></td></tr>`; }).join("")}</tbody></table></div>` : '<p class="ipw-empty">No team reviews recorded yet.</p>';
    return `<div class="ipw-card"><div class="ipw-card-head"><div><h3>Outstanding team actions</h3><small>Update the status of an action here; changes are saved immediately and recorded.</small></div></div><div id="openActions">${openActionsTable()}</div></div>
<div class="ipw-card"><div class="ipw-card-head"><div><h3>Review history</h3><small>${reviews.length} review${reviews.length === 1 ? "" : "s"} · oldest to newest</small></div>${isFinal() ? "" : '<button type="button" class="dc-ip-btn small primary" id="newMdtBtn">+ New review</button>'}</div>${hist}</div>
<p class="ipw-mode">${cur ? "Viewing saved review (read-only) · recorded by " + esc(cur.author) : "New multidisciplinary review"}</p>
<form id="stageForm" class="ipw-formwrap" novalidate><fieldset class="ipw-fieldset"${ro ? " disabled" : ""}>
${sec("A. Team Participants", f("reviewAt", "Review date and time", "datetime-local", { req: 1 }) + '<p class="full ipw-muted">Participants: physician, nurse, case manager, pharmacist, therapist.</p>' + rowsBlock("participants", parts))}
${sec("B. Clinical Progress", f("progress", "Overall clinical progress", "textarea", { req: 1 }) + f("condition", "Patient condition", "select", { opts: ["Improving", "Stable", "Unchanged", "Deteriorating"], req: 1 }) + f("response", "Treatment response", "textarea", { rows: 2 }))}
${sec("C. Discharge Barriers", '<div class="full ipw-checks">' + barriers.map(([n, l]) => fld(n, l, "checkbox", v[n])).join("") + "</div>" + f("barrierNotes", "Barrier details", "textarea", { rows: 2 }))}
${sec("D. Pending Investigations / Consultations", f("pendLabs", "Pending laboratory tests", "textarea", { half: 1, rows: 2 }) + f("pendImaging", "Pending imaging", "textarea", { half: 1, rows: 2 }) + f("consultStatus", "Consultation status", "textarea", { half: 1, rows: 2 }) + f("followUps", "Required follow-ups", "textarea", { half: 1, rows: 2 }))}
${sec("E. Medication Issues", f("medReview", "Medication review", "textarea", { half: 1, rows: 2 }) + f("medDiscrepancies", "Medication discrepancies", "textarea", { half: 1, rows: 2 }) + f("adverseEffects", "Adverse effects", "textarea", { half: 1, rows: 2 }) + f("medAdjust", "Medication adjustments required", "textarea", { half: 1, rows: 2 }))}
${sec("F. Discharge Readiness", f("mdtReadiness", "Discharge readiness status", "select", { opts: ["Not ready", "Potentially ready — actions pending", "Ready for physician discharge assessment"] }) + f("targetDischarge", "Target discharge date", "date") + f("outstandingReq", "Outstanding requirements", "textarea", { rows: 2 }))}
${sec("G. Team Decisions and Action Plan", rowsBlock("actions", cur ? cur.actions : [], [{ status: "Pending" }]))}
</fieldset></form>`;
}
function saveMdt() {
    const form = $("stageForm"); if (!form || busy || ui.mdtId) return;
    const v = collect(form), errs = [];
    need(v, errs, [["reviewAt", "Review date and time"], ["progress", "Overall clinical progress"], ["condition", "Patient condition"]]);
    const participants = cleanRows("participants", v.participants, errs, "Participant", ["name", "role", "date"]);
    if (!participants.length) errs.push({ msg: "At least one team participant is required." });
    const actions = cleanRows("actions", v.actions, errs, "Action", ["action", "responsible", "status"]);
    if (errs.length) return showErrors(errs);
    delete v.participants; delete v.actions;
    const r = repo.addMdt(patientId, { values: v, participants, actions, author: author(), at: new Date().toISOString() });
    afterSave(r, "Multidisciplinary review saved as a new record.", x => { ui.mdtId = x.record.id; });
}

/* =====================  STAGE 4: DISCHARGE READINESS  ===================== */
function readItems(v) {
    return repo.READINESS_ITEMS.map(i => ({ id: i.id, label: i.label, status: v["ri_" + i.id + "_status"] || "Pending", owner: v["ri_" + i.id + "_owner"] || "", date: v["ri_" + i.id + "_date"] || "", notes: v["ri_" + i.id + "_notes"] || "" }));
}
function readinessSummary(items) {
    const n = s => items.filter(i => i.status === s).length;
    const applicable = items.filter(i => i.status !== "Not Applicable"), done = n("Completed");
    const pct = applicable.length ? Math.round(done / applicable.length * 100) : 100;
    const out = items.filter(i => i.status === "Pending" || i.status === "In Progress");
    const label = out.length ? "Not ready — " + out.length + " requirement" + (out.length === 1 ? "" : "s") + " outstanding" : "Checklist complete — awaiting physician decision";
    return `<div class="ipw-sum-head"><div><span class="ipw-kicker">Derived checklist summary</span><strong class="ipw-sum-label ${out.length ? "warn" : "ok"}">${esc(label)}</strong></div><div class="ipw-chips">${pill(n("Completed") + " Completed", "green")}${pill(n("In Progress") + " In Progress", "blue")}${pill(n("Pending") + " Pending", "amber")}${pill(n("Not Applicable") + " N/A", "grey")}</div></div>
<div class="ipw-bar" role="progressbar" aria-label="Checklist completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div><p class="ipw-muted">${done} of ${applicable.length} applicable items completed (${pct}%)</p>
${out.length ? `<h4>Outstanding requirements</h4><ul class="ipw-out">${out.map(i => `<li><strong>${esc(i.label)}</strong> — ${esc(i.status)}${i.owner ? " · " + esc(i.owner) : ""}</li>`).join("")}</ul>` : ""}
<p class="ipw-note">Completing this checklist does not authorise discharge. The responsible physician makes the discharge decision.</p>`;
}
function viewReadiness() {
    const list = care.readiness.slice().sort((a, b) => String(a.reviewAt).localeCompare(String(b.reviewAt)));
    const cur = ui.readinessId ? care.readiness.find(r => r.id === ui.readinessId) : null;
    const base = cur || list[list.length - 1] || null;
    const ro = isFinal() || !!cur;
    const v = {};
    if (base) base.items.forEach(i => { v["ri_" + i.id + "_status"] = i.status; v["ri_" + i.id + "_owner"] = i.owner; v["ri_" + i.id + "_date"] = i.date; v["ri_" + i.id + "_notes"] = i.notes; });
    v.reviewingPhysician = cur ? cur.reviewingPhysician : author(); v.reviewAt = cur ? cur.reviewAt : nowLocal();
    v.determination = cur ? cur.determination : "Not determined"; v.summary = cur ? cur.summary : "";
    const coord = care.coordination && care.coordination.values || {};
    const hints = { equipment: coord.eqDelivery ? "Care coordination: equipment delivery — " + coord.eqDelivery : "", transport: coord.transportRequired ? "Care coordination: transport required — " + coord.transportRequired + (coord.transportMode ? " (" + coord.transportMode + ")" : "") : "" };
    const rows = repo.READINESS_ITEMS.map((i, idx) => `<tr data-ri="${i.id}"><th scope="row"><span class="ipw-idx">${idx + 1}</span> ${esc(i.label)}${hints[i.id] ? `<br><small class="ipw-muted">${esc(hints[i.id])}</small>` : ""}</th><td>${fld("ri_" + i.id + "_status", i.label + " status", "select", v["ri_" + i.id + "_status"] || "Pending", { opts: repo.ITEM_STATUSES, blank: "Select" }).replace("<span>", '<span class="ipw-sr">')}</td><td>${fld("ri_" + i.id + "_owner", i.label + " responsible person / department", "text", v["ri_" + i.id + "_owner"]).replace("<span>", '<span class="ipw-sr">')}</td><td>${fld("ri_" + i.id + "_date", i.label + " date completed", "date", v["ri_" + i.id + "_date"]).replace("<span>", '<span class="ipw-sr">')}</td><td>${fld("ri_" + i.id + "_notes", i.label + " notes", "text", v["ri_" + i.id + "_notes"]).replace("<span>", '<span class="ipw-sr">')}</td></tr>`).join("");
    const hist = list.length ? `<div class="ipw-table-wrap ipw-scroll"><table class="ipw-table"><thead><tr><th scope="col">Assessed</th><th scope="col">Reviewing physician</th><th scope="col">Completed</th><th scope="col">Outstanding</th><th scope="col">Physician determination</th><th scope="col"><span class="ipw-sr">Action</span></th></tr></thead><tbody>${list.map(r => { const ap = r.items.filter(i => i.status !== "Not Applicable"), dn = ap.filter(i => i.status === "Completed").length; return `<tr${r.id === ui.readinessId ? ' class="current"' : ""}><td>${esc(fmtDT(r.reviewAt))}</td><td>${esc(dash(r.reviewingPhysician))}</td><td>${dn} / ${ap.length}</td><td>${repo.itemsOutstanding(r).length}</td><td>${esc(r.determination)}</td><td><button type="button" class="dc-ip-btn small" data-open-ready="${esc(r.id)}">View</button></td></tr>`; }).join("")}</tbody></table></div>` : '<p class="ipw-empty">No readiness assessments recorded yet.</p>';
    return `<div class="ipw-card"><div class="ipw-card-head"><div><h3>Assessment history</h3><small>${list.length} assessment${list.length === 1 ? "" : "s"} preserved · oldest to newest</small></div>${isFinal() ? "" : '<button type="button" class="dc-ip-btn small primary" id="newReadyBtn">+ Reassess</button>'}</div>${hist}</div>
<p class="ipw-mode">${cur ? "Viewing saved assessment (read-only)" : base ? "New assessment — pre-filled from the previous assessment. Update statuses and save as a new record." : "New assessment"}</p>
<form id="stageForm" class="ipw-formwrap" novalidate><fieldset class="ipw-fieldset"${ro ? " disabled" : ""}>
<div class="ipw-callout" id="readinessSummary"></div>
${sec("Discharge readiness checklist", `<div class="full ipw-table-wrap"><table class="ipw-table ipw-check-table"><thead><tr><th scope="col">Requirement</th><th scope="col">Status</th><th scope="col">Responsible person / department</th><th scope="col">Date completed</th><th scope="col">Notes</th></tr></thead><tbody>${rows}</tbody></table></div>`)}
${sec("Physician review", fld("reviewingPhysician", "Reviewing physician", "text", v.reviewingPhysician, { req: 1 }) + fld("reviewAt", "Review date and time", "datetime-local", v.reviewAt, { req: 1 }) + fld("summary", "Overall readiness summary", "textarea", v.summary) + fld("determination", "Physician determination", "select", v.determination, { opts: repo.DETERMINATIONS, blank: "Not determined" }) + '<p class="full ipw-muted">The determination is entered by the physician. It cannot be set to ready while any requirement is Pending or In Progress.</p>')}
</fieldset></form>`;
}
function saveReadiness() {
    const form = $("stageForm"); if (!form || busy || ui.readinessId) return;
    const v = collect(form), errs = [], items = readItems(v);
    need(v, errs, [["reviewingPhysician", "Reviewing physician"], ["reviewAt", "Review date and time"]]);
    items.forEach(i => {
        if (i.status === "Completed") {
            if (!i.date) errs.push({ field: "ri_" + i.id + "_date", msg: i.label + ": date completed is required." });
            if (!i.owner) errs.push({ field: "ri_" + i.id + "_owner", msg: i.label + ": responsible person / department is required." });
        }
    });
    const outstanding = items.filter(i => i.status === "Pending" || i.status === "In Progress");
    if (v.determination === repo.READY_DETERMINATION && outstanding.length) errs.push({ field: "determination", msg: "Physician determination cannot be 'ready' while " + outstanding.length + " requirement(s) are outstanding." });
    if (errs.length) return showErrors(errs);
    const r = repo.addReadiness(patientId, { items, determination: v.determination || "Not determined", reviewingPhysician: v.reviewingPhysician, reviewAt: v.reviewAt, summary: v.summary, author: author(), at: new Date().toISOString() });
    afterSave(r, "Readiness assessment saved as a new record.", x => { ui.readinessId = x.record.id; });
}

/* =====================  STAGE 5: DISCHARGE  ===================== */
function preChecks() {
    const latest = care.readiness[care.readiness.length - 1], open = repo.openActions(care), coordOut = care.coordination ? repo.arrangementsOutstanding(care.coordination) : null;
    const items = [], out = latest ? repo.itemsOutstanding(latest) : [];
    items.push(latest ? { ok: !out.length, text: "Latest readiness assessment (" + fmtDT(latest.reviewAt) + "): " + (out.length ? out.length + " requirement(s) outstanding" : "all requirements completed / not applicable") } : { ok: false, text: "No discharge readiness assessment has been recorded." });
    items.push({ ok: !!latest && latest.determination === repo.READY_DETERMINATION, text: latest ? "Physician determination: " + latest.determination : "Physician determination: none recorded" });
    items.push({ ok: !open.length, text: open.length + " outstanding multidisciplinary action(s)" });
    items.push({ ok: coordOut ? !coordOut.length : false, text: coordOut ? (coordOut.length ? coordOut.length + " care coordination arrangement(s) outstanding" : "Care coordination arrangements complete") : "No care coordination record" });
    return { items, needsOverride: !latest || out.length > 0 || latest.determination !== repo.READY_DETERMINATION || open.length > 0 };
}
function previewHtml(v, meds, fups, status) {
    const row = (l, t) => `<div class="ipw-pv-row"><h5>${esc(l)}</h5><p>${t ? nl(t) : "—"}</p></div>`;
    const finalised = status === "final";
    return `<article class="ipw-preview"><header><div><h3>Health Haven Medical Center</h3><p>Discharge Summary</p></div><span class="ipw-pv-badge ${finalised ? "final" : "draft"}">${finalised ? "FINALISED" : "DRAFT — NOT FINALISED"}</span></header>
<div class="ipw-pv-grid"><div><small>Patient</small><strong>${esc(patient.name)}</strong></div><div><small>Patient ID / MRN</small><strong>${esc(patient.mrn)}</strong></div><div><small>Age / gender</small><strong>${esc(patient.age)} / ${esc(patient.gender)}</strong></div><div><small>Encounter</small><strong>${esc(patient.encounterId)}</strong></div><div><small>Admitted</small><strong>${esc(fmtD(patient.admittedOn))}</strong></div><div><small>Discharged</small><strong>${esc(fmtDT(v.dischargeAt))}</strong></div><div><small>Ward / bed</small><strong>${esc(patient.ward)} · ${esc(patient.room)} / ${esc(patient.bed)}</strong></div><div><small>Allergies</small><strong>${esc(patient.allergies)}</strong></div></div>
${row("Final diagnosis", v.finalDiagnosis)}${row("Condition at discharge", [v.condition, v.conditionNotes].filter(Boolean).join(" — "))}${row("Reason for admission", v.admissionReason)}${row("Hospital course", v.hospitalCourse)}${row("Treatment provided", v.treatmentProvided)}${row("Clinical outcome", v.clinicalOutcome)}${row("Relevant investigation findings", v.investigations)}
<div class="ipw-pv-row"><h5>Discharge medications</h5>${meds.length ? `<table class="ipw-table"><thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead><tbody>${meds.map(m => `<tr><td>${esc(m.name)}</td><td>${esc(dash(m.dose))}</td><td>${esc(dash(m.frequency))}</td><td>${esc(dash(m.duration))}</td><td>${esc(dash(m.instructions))}</td></tr>`).join("")}</tbody></table>` : `<p>${v.noMeds ? "No discharge medications." : "—"}</p>`}</div>
<div class="ipw-pv-row"><h5>Follow-up appointments</h5>${fups.length ? `<table class="ipw-table"><thead><tr><th>Date</th><th>Department</th><th>Provider</th><th>Instructions</th></tr></thead><tbody>${fups.map(m => `<tr><td>${esc(fmtD(m.date))}</td><td>${esc(m.department)}</td><td>${esc(dash(m.provider))}</td><td>${esc(dash(m.instructions))}</td></tr>`).join("")}</tbody></table>` : `<p>${v.noFollow ? "No follow-up required." : "—"}</p>`}</div>
${row("Medication instructions", v.homeMed)}${row("Diet", v.homeDiet)}${row("Activity restrictions", v.homeActivity)}${row("Wound care", v.homeWound)}${row("Warning signs", v.warningSigns)}${row("When to seek medical attention", v.seekCare)}
<footer><p><strong>Discharging physician:</strong> ${esc(dash(v.dischargingPhysician))}</p><p><strong>Authorised by:</strong> ${esc(dash(v.authPhysician))} · ${esc(fmtDT(v.authAt))}</p><p><strong>Acknowledged by:</strong> ${esc(dash(v.ackBy))} ${v.ackName ? "(" + esc(v.ackName) + ")" : ""} · signature: ${esc(dash(v.ackSignature))} · ${esc(fmtDT(v.ackAt))}</p></footer></article>`;
}
function viewDischarge() {
    const rec = care.discharge, final = isFinal();
    const v = rec ? rec.values : { dischargingPhysician: patient.attending, finalDiagnosis: patient.diagnosis, admissionReason: patient.summary, dischargeAt: nowLocal(), authPhysician: patient.attending, authAt: nowLocal(), ackAt: nowLocal() };
    const f = (n, l, t, o) => fld(n, l, t, v[n], o);
    const pc = preChecks();
    const checks = `<div class="ipw-callout"><h4>Pre-discharge check <small>(informational; the physician decides)</small></h4><ul class="ipw-checklist">${pc.items.map(i => `<li class="${i.ok ? "ok" : "warn"}"><span aria-hidden="true">${i.ok ? "✓" : "!"}</span> ${esc(i.text)}</li>`).join("")}</ul></div>`;
    const status = final ? `<p class="ipw-banner ok">Discharge FINALISED ${esc(fmtDT(rec.finalizedAt))} by ${esc(rec.finalizedBy)} · authorised by ${esc(rec.authorizedBy)}. This record is locked and cannot be submitted again.</p>` : rec ? `<p class="ipw-banner info">Draft saved ${esc(fmtDT(rec.updatedAt))} by ${esc(rec.updatedBy)}. Not yet finalised.</p>` : '<p class="ipw-banner info">No discharge documentation yet. Fields below are pre-filled from the patient record where available.</p>';
    const pv = final || ui.preview;
    return `${status}${final ? "" : checks}
<form id="stageForm" class="ipw-formwrap" novalidate><fieldset class="ipw-fieldset"${final ? " disabled" : ""}>
${sec("A. Discharge Information", f("dischargeAt", "Discharge date and time", "datetime-local", { req: 1 }) + f("dischargingPhysician", "Discharging physician", "text", { req: 1 }) + f("finalDiagnosis", "Final diagnosis", "textarea", { req: 1, rows: 2 }) + f("condition", "Condition at discharge", "select", { opts: ["Stable", "Improved", "Unchanged", "Guarded"], req: 1 }) + f("conditionNotes", "Condition notes", "textarea", { rows: 2 }))}
${sec("B. Discharge Summary", f("admissionReason", "Reason for admission", "textarea", { req: 1, rows: 2 }) + f("hospitalCourse", "Hospital course", "textarea", { req: 1 }) + f("treatmentProvided", "Treatment provided", "textarea", { req: 1 }) + f("clinicalOutcome", "Clinical outcome", "textarea", { req: 1, rows: 2 }) + f("investigations", "Relevant investigation findings", "textarea", { rows: 2 }))}
${sec("C. Discharge Medications", rowsBlock("meds", rec ? rec.meds : [], [{}]) + f("noMeds", "No discharge medications", "checkbox", { full: 1 }))}
${sec("D. Follow-up Appointments", rowsBlock("followUps", rec ? rec.followUps : [], [{}]) + f("noFollow", "No follow-up appointment required", "checkbox", { full: 1 }))}
${sec("E. Home Care Instructions", f("homeMed", "Medication instructions", "textarea", { half: 1, rows: 2 }) + f("homeDiet", "Diet instructions", "textarea", { half: 1, rows: 2 }) + f("homeActivity", "Activity restrictions", "textarea", { half: 1, rows: 2 }) + f("homeWound", "Wound care (if applicable)", "textarea", { half: 1, rows: 2 }) + f("warningSigns", "Warning signs", "textarea", { req: 1, half: 1, rows: 2 }) + f("seekCare", "When to seek medical attention", "textarea", { req: 1, half: 1, rows: 2 }))}
${sec("F. Patient / Caregiver Acknowledgment", f("ackBy", "Acknowledged by", "select", { opts: ["Patient", "Caregiver"] }) + f("ackName", "Name of person acknowledging", "text") + f("ackSignature", "Signature (type full name)", "text") + f("ackAt", "Date and time", "datetime-local") + f("ackConfirm", "Discharge instructions were explained and understood", "checkbox", { full: 1 }))}
${sec("Authorisation of discharge decision", f("authPhysician", "Authorising physician", "text", { req: 1 }) + f("authAt", "Authorisation date and time", "datetime-local", { req: 1 }) + f("authConfirm", "I confirm that I authorise this discharge and remain responsible for the discharge decision.", "checkbox", { full: 1 }) + (pc.needsOverride ? f("overrideReason", "Reason for proceeding with outstanding readiness items / actions (required)", "textarea", { req: 1, rows: 2 }) : ""))}
</fieldset></form>
<div class="ipw-inline-actions">${final ? '<button type="button" class="dc-ip-btn small" id="printBtn">Print discharge summary</button>' : '<button type="button" class="dc-ip-btn small" id="previewBtn">' + (ui.preview ? "Refresh preview" : "Generate summary preview") + "</button>"}</div>
<div id="dischargePreview">${pv ? previewHtml(v, rec ? rec.meds : [], rec ? rec.followUps : [], rec ? rec.status : "draft") : ""}</div>`;
}
function readDischarge(errs, strict) {
    const form = $("stageForm"), v = collect(form);
    const meds = cleanRows("meds", v.meds, errs, "Medication", strict ? ["name", "dose", "frequency"] : ["name"]);
    const fups = cleanRows("followUps", v.followUps, errs, "Follow-up", ["date", "department"]);
    delete v.meds; delete v.followUps;
    return { v, meds, fups };
}
function saveDischargeDraft() {
    if (!$("stageForm") || busy) return;
    const errs = [], d = readDischarge(errs, false);
    if (errs.length) return showErrors(errs);
    const r = repo.saveDischarge(patientId, { values: d.v, meds: d.meds, followUps: d.fups, finalize: false, author: author(), at: new Date().toISOString() });
    afterSave(r, "Discharge draft saved. It is not yet finalised.");
}
function finaliseDischarge() {
    if (!$("stageForm") || busy || isFinal()) return;
    const errs = [], d = readDischarge(errs, true), v = d.v;
    need(v, errs, [["dischargeAt", "Discharge date and time"], ["dischargingPhysician", "Discharging physician"], ["finalDiagnosis", "Final diagnosis"], ["condition", "Condition at discharge"], ["admissionReason", "Reason for admission"], ["hospitalCourse", "Hospital course"], ["treatmentProvided", "Treatment provided"], ["clinicalOutcome", "Clinical outcome"], ["warningSigns", "Warning signs"], ["seekCare", "When to seek medical attention"], ["authPhysician", "Authorising physician"], ["authAt", "Authorisation date and time"], ["ackBy", "Acknowledged by (patient or caregiver)"], ["ackSignature", "Acknowledgment signature"], ["ackAt", "Acknowledgment date and time"]]);
    if (!d.meds.length && !v.noMeds) errs.push({ field: "noMeds", msg: "Add at least one discharge medication, or tick 'No discharge medications'." });
    if (!d.fups.length && !v.noFollow) errs.push({ field: "noFollow", msg: "Add at least one follow-up appointment, or tick 'No follow-up appointment required'." });
    if (!v.ackConfirm) errs.push({ field: "ackConfirm", msg: "Patient / caregiver acknowledgment must be confirmed." });
    if (!v.authConfirm) errs.push({ field: "authConfirm", msg: "The physician authorisation must be confirmed." });
    if (preChecks().needsOverride && !v.overrideReason) errs.push({ field: "overrideReason", msg: "Readiness items or team actions are outstanding; document the reason for proceeding." });
    if (errs.length) return showErrors(errs);
    if (!window.confirm("Finalise discharge for " + patient.name + "?\n\nThis records the discharge decision under " + v.authPhysician + ". The record will be locked and cannot be edited or submitted again.")) return;
    busy = true; $("finalizeBtn").disabled = true; $("saveDraftBtn").disabled = true;
    const r = repo.saveDischarge(patientId, { values: v, meds: d.meds, followUps: d.fups, finalize: true, author: author(), at: new Date().toISOString() });
    busy = false;
    if (afterSave(r, "Discharge finalised and locked.")) renderBanner(); else updateButtons();
}

/* ---------- save dispatch ---------- */
function doSave(mode) {
    const id = STAGES[active].id;
    if (id === "rounds") saveRounds(mode === "draft" ? "draft" : "saved");
    else if (id === "coordination") saveCoordination();
    else if (id === "mdt") saveMdt();
    else if (id === "readiness") saveReadiness();
    else if (id === "discharge") saveDischargeDraft();
}

/* ---------- init ---------- */
function setupNavigation() {
    document.querySelectorAll("#dcTabs .nav-item").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === "inpatient");
        if (tab.dataset.tab === "inpatient") { tab.setAttribute("aria-current", "page"); return; }
        tab.addEventListener("click", () => {
            if (!guard()) return;
            dirty = false;
            if (tab.dataset.tab === "patients") location.href = "doctor-patient.html";
            else if (tab.dataset.tab === "referrals") location.href = "doctor-referals.html";
            else location.href = "doctor-dashboard.html?tab=" + encodeURIComponent(tab.dataset.tab);
        });
    });
}
function bindEvents() {
    $("workflowNav").addEventListener("click", e => { const b = e.target.closest("[data-step]"); if (b) goStage(Number(b.dataset.step)); });
    $("previousStep").addEventListener("click", () => goStage(active - 1));
    $("nextStep").addEventListener("click", () => goStage(active + 1));
    $("backToPatients").addEventListener("click", () => { if (!guard()) return; dirty = false; location.href = "doctor-inpatient.html"; });
    $("saveBtn").addEventListener("click", () => doSave("saved"));
    $("saveDraftBtn").addEventListener("click", () => doSave("draft"));
    $("finalizeBtn").addEventListener("click", finaliseDischarge);
    const panel = $("workflowPanel");
    panel.addEventListener("submit", e => e.preventDefault());
    panel.addEventListener("input", e => { if (e.target.closest("#stageForm")) { dirty = true; liveUpdate(); } });
    panel.addEventListener("change", e => {
        const t = e.target;
        if (t.dataset && t.dataset.actId) {
            const r = repo.updateMdtAction(patientId, t.dataset.actReview, t.dataset.actId, t.value, author(), new Date().toISOString());
            refreshCare(); renderNav(); $("openActions").innerHTML = openActionsTable();
            const head = document.querySelector(".ipw-save-state"), st = stageStatus().mdt;
            if (head) { head.textContent = st.label + " · " + st.detail; head.className = "ipw-save-state " + TONE[st.label]; }
            notice(r.ok ? "Action status updated." + (r.persisted ? "" : " Browser storage is unavailable.") : (r.error || "Unable to update action."), !r.ok);
            return;
        }
        if (!t.closest("#stageForm")) return;
        dirty = true;
        const m = /^ri_(.+)_status$/.exec(t.name || "");
        if (m && t.value === "Completed") { const d = $("f_ri_" + m[1] + "_date"); if (d && !d.value) d.value = today(); }
        applyConditionals(); liveUpdate();
    });
    panel.addEventListener("click", e => {
        const t = e.target.closest("button"); if (!t) return;
        const add = t.dataset.addRow, form = $("stageForm");
        if (add && form) { form.querySelector('[data-rows="' + add + '"]').insertAdjacentHTML("beforeend", rowHtml(add, add === "actions" ? { status: "Pending" } : {})); dirty = true; return; }
        if (t.hasAttribute("data-rm-row")) { const c = t.closest("[data-rows]"), row = t.closest(".ipw-row"); row.remove(); if (!c.children.length) c.insertAdjacentHTML("beforeend", rowHtml(c.dataset.rows, {})); dirty = true; return; }
        const open = (key, val) => { if (!guard()) return; ui[key] = val; clearNotice(); renderStage(); };
        if (t.dataset.openRound) openRound(t.dataset.openRound);
        else if (t.hasAttribute("data-add-round")) openRoundModal(t);
        else if (t.id === "closeRoundBtn") closeRound();
        else if (t.dataset.openMdt) open("mdtId", t.dataset.openMdt);
        else if (t.id === "newMdtBtn") open("mdtId", null);
        else if (t.dataset.openReady) open("readinessId", t.dataset.openReady);
        else if (t.id === "newReadyBtn") open("readinessId", null);
        else if (t.id === "previewBtn") { const f = readDischarge([], false); ui.preview = true; $("dischargePreview").innerHTML = previewHtml(f.v, f.meds, f.fups, "draft"); t.textContent = "Refresh preview"; }
        else if (t.id === "printBtn") window.print();
    });
    const roundModal = $("roundTypeModal");
    roundModal.addEventListener("click", e => {
        if (e.target === roundModal || e.target.closest("[data-round-modal-close]")) { closeRoundModal(); return; }
        const choice = e.target.closest("[data-new-round]");
        if (choice && !choice.disabled) chooseRoundType(choice.dataset.newRound);
    });
    document.addEventListener("keydown", handleModalKeys);
    window.addEventListener("beforeunload", e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
}
function init() {
    const session = window.HHAuth && HHAuth.requireRole ? HHAuth.requireRole("doctor") : null;
    if (window.HHAuth && !session) return;
    document.body.classList.remove("auth-pending");
    if (session && typeof fillUser === "function") fillUser(session);
    if (typeof startClock === "function") startClock();
    if (typeof setupProfileMenu === "function") setupProfileMenu();
    if (typeof setupModals === "function") setupModals();
    setupNavigation();
    patient = repo.getPatient(patientId);
    if (!patient) {
        $("backToPatients").addEventListener("click", () => { location.href = "doctor-inpatient.html"; });
        $("patientBanner").textContent = "Patient record not found. Return to the in-patient directory and select a patient.";
        document.querySelector(".ipw-layout").hidden = true;
        const b = document.createElement("p"); b.className = "ipw-banner info"; b.innerHTML = '<a href="doctor-inpatient.html">Back to patient list</a>'; $("patientBanner").appendChild(b);
        return;
    }
    refreshCare(); renderBanner(); bindEvents(); renderAll();
    if (!repo.isPersistent()) notice("Browser storage is unavailable. Records will not be kept after closing this page.", true);
}
document.addEventListener("DOMContentLoaded", () => { if (!document.getElementById("dcTabs")) document.addEventListener("doctorNavbarReady", init, { once: true }); else init(); });
})();
