(function () {
  "use strict";

  const PATIENTS_KEY = "labServicePatients_v1";
  const DRAFTS_KEY = "prescriptionRefillDrafts_v1";
  const REQUESTS_KEY = "prescriptionRefillRequests_v1";
  const DRAFT_COUNTER_KEY = "prescriptionRefillDraftCounter_v1";
  const REQUEST_COUNTER_KEY = "prescriptionRefillRequestCounter_v1";
  const REQUEST_STATUS = "Pending Review";

  const STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
    "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
    "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "West Bengal", "Other"
  ];

  const PHARMACIES = {
    hhp: {
      name: "Health Haven Pharmacy",
      phone: "(212) 555-0189",
      address: "123 Medical Center Drive, New York, NY 10001"
    },
    other: {
      name: "Other pharmacy",
      phone: "",
      address: ""
    }
  };

  const PHYSICIANS = [
    { id: "dr-chen", name: "Dr. Chen", department: "Cardiology", phone: "(650) 123-4567" },
    { id: "dr-mehta", name: "Dr. Mehta", department: "Internal Medicine", phone: "" },
    { id: "dr-roy", name: "Dr. Roy", department: "Endocrinology", phone: "" }
  ];

  const MEDICATIONS = [
    {
      id: "m1", name: "Lisinopril", drugClass: "ACE Inhibitor", strength: "10 mg", form: "Tablet",
      directions: "Take 1 tablet by mouth once daily", lastFilled: "2026-04-10", refills: 2,
      status: "Active", pharmacy: "Health Haven Pharmacy"
    },
    {
      id: "m2", name: "Amlodipine", drugClass: "Calcium channel blocker", strength: "5 mg", form: "Tablet",
      directions: "Take 1 tablet by mouth once daily", lastFilled: "2026-04-10", refills: 1,
      status: "Active", pharmacy: "Health Haven Pharmacy"
    },
    {
      id: "m3", name: "Atorvastatin", drugClass: "Statin", strength: "20 mg", form: "Tablet",
      directions: "Take 1 tablet by mouth at bedtime", lastFilled: "2026-03-08", refills: 0,
      status: "Active", pharmacy: "Health Haven Pharmacy"
    },
    {
      id: "m4", name: "Metformin", drugClass: "Antidiabetic", strength: "500 mg", form: "Tablet",
      directions: "Take 1 tablet by mouth twice daily with meals", lastFilled: "2026-02-12", refills: 1,
      status: "Active", pharmacy: "Health Haven Pharmacy"
    }
  ];

  const state = {
    patient: null,
    physician: null,
    selected: new Set(),
    signature: "",
    submitting: false
  };

  const $ = (id) => document.getElementById(id);

  let activeModal = null;
  let lastFocused = null;
  let debounceTimer = null;

  function seedPatients() {
    return [
      { id: "p1", mrn: "MRN-000001", firstName: "Rajesh", lastName: "Sharma", dob: "1990-05-12", gender: "Male", phone: "9998887770", insurance: "Star Health", memberId: "SH-778215" },
      { id: "p2", mrn: "MRN-000002", firstName: "Harshit", lastName: "Bhardwaj", dob: "1997-02-10", gender: "Male", phone: "9123456780", insurance: "", memberId: "" },
      { id: "p3", mrn: "MRN-000003", firstName: "Kavya", lastName: "Bhardwaj", dob: "2000-07-21", gender: "Female", phone: "9123456781", insurance: "", memberId: "" },
      { id: "p4", mrn: "MRN-000004", firstName: "Meera", lastName: "Sharma", dob: "2016-11-04", gender: "Female", phone: "9876543210", insurance: "", memberId: "" },
      { id: "p5", mrn: "MRN-000005", firstName: "Kabir", lastName: "Sharma", dob: "2012-01-19", gender: "Male", phone: "9876543210", insurance: "", memberId: "" },
      { id: "p6", mrn: "MRN-000006", firstName: "Priya", lastName: "Sharma", dob: "1985-03-22", gender: "Female", phone: "9876543210", insurance: "Care Plus", memberId: "CP-552310" }
    ];
  }

  function loadPatients() {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) {
      const seeded = seedPatients();
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : seedPatients();
    } catch (e) {
      return seedPatients();
    }
  }

  const patients = loadPatients();

  function buildProfile(patient) {
    return {
      email: (patient.firstName + "." + patient.lastName).toLowerCase() + "@example.com",
      address1: "123 Medical Center Drive",
      address2: "",
      city: "New York",
      state: "NY",
      postal: "10001",
      lastVisit: "2026-05-14",
      physicianId: "dr-chen",
      diagnoses: ["Hypertension", "Hyperlipidemia"],
      monitoring: ["BP: 120/80 mmHg (May 14, 2026)", "Lipid Panel: Completed (May 12, 2026)"]
    };
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function todayIso() {
    const t = new Date();
    return t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  }

  function formatDate(iso) {
    if (!iso) return "--";
    const d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatLongDate(iso) {
    if (!iso) return "--";
    const d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function formatAge(iso) {
    if (!iso) return "";
    const dob = new Date(iso + "T00:00:00");
    const today = new Date();
    if (Number.isNaN(dob.getTime()) || dob > today) return "";
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    if (today.getDate() < dob.getDate()) months--;
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years <= 0) {
      return months + (months === 1 ? " month" : " months");
    }
    return years + (years === 1 ? " year" : " years");
  }

  function nextId(prefix, counterKey) {
    const next = parseInt(localStorage.getItem(counterKey) || "0", 10) + 1;
    localStorage.setItem(counterKey, String(next));
    return prefix + "-" + String(next).padStart(6, "0");
  }

  function appendToList(key, entry) {
    let list = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      list = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      list = [];
    }
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
  }

  function getFocusable(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      (el) => el.getClientRects().length > 0
    );
  }

  function onModalKey(e) {
    if (!activeModal) return;
    if (e.key === "Escape") {
      closeModal(activeModal);
      return;
    }
    if (e.key !== "Tab") return;
    const items = getFocusable(activeModal);
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

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("show");
    activeModal = modal;
    document.addEventListener("keydown", onModalKey);
    const items = getFocusable(modal);
    (items[0] || modal).focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("show");
    document.removeEventListener("keydown", onModalKey);
    activeModal = null;
    if (modal.id === "prSuccessModal") {
      clearAll();
    } else if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function clearErrors() {
    document.querySelectorAll(".pr-error[data-dynamic]").forEach((el) => el.remove());
    document.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute("aria-invalid"));
    ["prPatientError", "prMedError", "prReasonError", "prSignatureError"].forEach((id) => {
      $(id).hidden = true;
    });
    $("prSignatureBox").classList.remove("is-invalid");
  }

  function flagField(input, message) {
    const field = input.closest(".pr-field");
    input.setAttribute("aria-invalid", "true");
    if (!field) return;
    const p = document.createElement("p");
    p.className = "pr-error";
    p.setAttribute("role", "alert");
    p.setAttribute("data-dynamic", "true");
    p.textContent = message;
    field.appendChild(p);
  }

  function flagStatic(id, message) {
    const el = $(id);
    if (message) el.textContent = message;
    el.hidden = false;
  }

  function clearFieldError(input) {
    input.removeAttribute("aria-invalid");
    const field = input.closest(".pr-field");
    if (!field) return;
    const err = field.querySelector(".pr-error[data-dynamic]");
    if (err) err.remove();
  }

  function populateStates() {
    const select = $("prState");
    select.innerHTML = '<option value="" selected>Select</option>' +
      STATES.map((s) => '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + "</option>").join("");
  }

  function updateAge() {
    $("prAge").value = formatAge($("prDob").value);
  }

  function renderMeds() {
    const body = $("prMedBody");
    if (!state.patient) {
      body.innerHTML = '<tr><td colspan="9" class="pr-table-empty">Select a patient profile to view current medications.</td></tr>';
      updateMedSummary();
      return;
    }
    body.innerHTML = MEDICATIONS.map((m) => {
      const checked = state.selected.has(m.id) ? " checked" : "";
      const refillClass = m.refills === 0 ? ' class="pr-refills-zero"' : "";
      return '<tr data-id="' + m.id + '"' + (checked ? ' class="is-selected"' : "") + ">" +
        '<td class="pr-col-check"><input type="checkbox" class="pr-checkbox pr-row-check" data-id="' + m.id + '" aria-label="Select ' + escapeHtml(m.name) + '"' + checked + "></td>" +
        '<td class="pr-left"><span class="pr-med-name">' + escapeHtml(m.name) + '</span><span class="pr-med-class">' + escapeHtml(m.drugClass) + "</span></td>" +
        '<td class="pr-strength"><strong>' + escapeHtml(m.strength) + "</strong><span>" + escapeHtml(m.form) + "</span></td>" +
        '<td class="pr-left">' + escapeHtml(m.directions) + "</td>" +
        "<td>" + formatDate(m.lastFilled) + "</td>" +
        "<td><span" + refillClass + ">" + m.refills + "</span></td>" +
        '<td><span class="pr-pill">' + escapeHtml(m.status) + "</span></td>" +
        '<td class="pr-pharmacy-link">' + escapeHtml(m.pharmacy) + "</td>" +
        '<td><input type="checkbox" class="pr-checkbox pr-request-check" data-id="' + m.id + '" aria-label="Request refill for ' + escapeHtml(m.name) + '"' + checked + "></td>" +
        "</tr>";
    }).join("");
    updateMedSummary();
  }

  function updateMedSummary() {
    const total = state.patient ? MEDICATIONS.length : 0;
    const count = state.selected.size;
    $("prMedCount").textContent = count + " of " + total + " medications selected";
    const all = $("prSelectAll");
    all.disabled = total === 0;
    all.checked = total > 0 && count === total;
    all.indeterminate = count > 0 && count < total;
  }

  function onMedChange(e) {
    const box = e.target.closest(".pr-row-check, .pr-request-check");
    if (!box) return;
    const id = box.dataset.id;
    if (box.checked) {
      state.selected.add(id);
    } else {
      state.selected.delete(id);
    }
    const row = box.closest("tr");
    row.querySelectorAll(".pr-row-check, .pr-request-check").forEach((cb) => {
      cb.checked = box.checked;
    });
    row.classList.toggle("is-selected", box.checked);
    $("prMedError").hidden = true;
    updateMedSummary();
  }

  function onSelectAll() {
    const checked = $("prSelectAll").checked;
    state.selected.clear();
    if (checked) {
      MEDICATIONS.forEach((m) => state.selected.add(m.id));
    }
    renderMeds();
    $("prMedError").hidden = true;
  }

  function renderHistory() {
    $("prHistoryBody").innerHTML = state.patient
      ? MEDICATIONS.map((m) =>
        '<tr><td class="pr-left"><span class="pr-med-name">' + escapeHtml(m.name) + '</span><span class="pr-med-class">' + escapeHtml(m.drugClass) + "</span></td>" +
        "<td>" + escapeHtml(m.strength) + "</td>" +
        "<td>" + formatDate(m.lastFilled) + "</td>" +
        "<td>" + m.refills + "</td>" +
        '<td><span class="pr-pill">' + escapeHtml(m.status) + "</span></td>" +
        "<td>" + escapeHtml(m.pharmacy) + "</td></tr>"
      ).join("")
      : '<tr><td colspan="6" class="pr-table-empty">Select a patient profile to view medication history.</td></tr>';
  }

  function applyPharmacy() {
    const usePreferred = $("prUsePreferred").checked;
    const select = $("prPharmacySelect");
    if (usePreferred) {
      select.value = "hhp";
    }
    select.disabled = usePreferred;
    const key = select.value;
    const phone = $("prPharmacyPhone");
    const address = $("prPharmacyAddress");
    const isOther = key === "other";
    phone.readOnly = !isOther;
    address.readOnly = !isOther;
    if (!isOther) {
      phone.value = PHARMACIES[key].phone;
      address.value = PHARMACIES[key].address;
    }
    clearFieldError(select);
    clearFieldError(phone);
  }

  function onPharmacyChange() {
    const key = $("prPharmacySelect").value;
    if (key === "other") {
      $("prPharmacyPhone").value = "";
      $("prPharmacyAddress").value = "";
    }
    applyPharmacy();
  }

  function setPhysician(physician) {
    state.physician = physician;
    $("prPhysician").value = physician ? physician.name + ", " + physician.department : "";
    $("prPhysicianPhone").value = physician ? physician.phone : "";
    clearFieldError($("prPhysician"));
    clearFieldError($("prPhysicianPhone"));
  }

  function renderPhysicians(filter) {
    const q = (filter || "").trim().toLowerCase();
    const list = PHYSICIANS.filter((p) => !q || p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q));
    $("prPhysicianList").innerHTML = list.length
      ? list.map((p) =>
        '<button type="button" class="pr-person" data-id="' + p.id + '"><strong>' + escapeHtml(p.name) + "</strong><span>" + escapeHtml(p.department) + "</span></button>"
      ).join("")
      : '<div class="pr-empty-result">No matching physician found</div>';
  }

  function setInfoLines(id, lines) {
    $(id).innerHTML = lines && lines.length
      ? lines.map((l) => "<span>" + escapeHtml(l) + "</span>").join("")
      : "<span>--</span>";
  }

  function populatePatient(patient) {
    const profile = buildProfile(patient);
    state.patient = patient;
    state.selected.clear();

    $("prPatientId").value = patient.id;
    $("prFirstName").value = patient.firstName;
    $("prLastName").value = patient.lastName;
    $("prDob").value = patient.dob;
    $("prGender").value = patient.gender || "";
    $("prMrn").value = patient.mrn;
    $("prPhone").value = patient.phone;
    $("prEmail").value = profile.email;
    $("prAddress1").value = profile.address1;
    $("prAddress2").value = profile.address2;
    $("prCity").value = profile.city;
    $("prState").value = profile.state;
    $("prPostal").value = profile.postal;
    updateAge();

    $("prLastNameSearch").value = patient.lastName;
    $("prDobSearch").value = patient.dob;
    $("prMobileSearch").value = patient.phone;
    closeResults();

    $("prLastVisit").textContent = formatLongDate(profile.lastVisit);
    setInfoLines("prDiagnosis", profile.diagnoses);
    setInfoLines("prMonitoring", profile.monitoring);
    setPhysician(PHYSICIANS.find((p) => p.id === profile.physicianId) || null);

    $("prUsePreferred").checked = true;
    applyPharmacy();
    renderMeds();
    renderHistory();
    clearErrors();
  }

  function resetPatientFields() {
    state.patient = null;
    state.selected.clear();
    ["prPatientId", "prFirstName", "prLastName", "prDob", "prAge", "prMrn", "prPhone", "prEmail", "prAddress1", "prAddress2", "prCity", "prPostal"].forEach((id) => {
      $(id).value = "";
    });
    $("prGender").value = "";
    $("prState").value = "";
    $("prLastVisit").textContent = "--";
    setInfoLines("prDiagnosis", []);
    setInfoLines("prMonitoring", []);
    setPhysician(null);
    renderMeds();
    renderHistory();
  }

  function closeResults() {
    const box = $("prSearchResults");
    box.classList.remove("show");
    box.innerHTML = "";
  }

  function searchPatients() {
    const ln = $("prLastNameSearch").value.trim().toLowerCase();
    const dob = $("prDobSearch").value;
    const phone = $("prMobileSearch").value.replace(/\D/g, "");
    if (!ln && !dob && !phone) {
      closeResults();
      return;
    }
    const found = patients.filter((p) => {
      const nameMatch = (ln !== "" || dob !== "") &&
        (ln === "" || p.lastName.toLowerCase().includes(ln)) &&
        (dob === "" || p.dob === dob);
      const phoneMatch = phone !== "" && String(p.phone).replace(/\D/g, "").includes(phone);
      return nameMatch || phoneMatch;
    });
    renderResults(found);
  }

  function renderResults(list) {
    const box = $("prSearchResults");
    box.classList.add("show");
    if (!list.length) {
      box.innerHTML = '<div class="pr-empty-result" role="status">No Matching Record Found</div>';
      return;
    }
    box.innerHTML = list.map((p) =>
      '<div class="pr-result-item" role="option" aria-selected="false">' +
      '<div class="pr-result-left"><div class="pr-result-avatar"><img src="images/profile-outline.png" alt=""></div>' +
      '<div><div class="pr-result-name">' + escapeHtml(p.firstName + " " + p.lastName) + "</div>" +
      '<div class="pr-result-meta">' + escapeHtml(p.phone) + " &bull; " + escapeHtml(p.mrn) + "</div></div></div>" +
      '<button type="button" class="pr-btn pr-btn--outline pr-btn--sm" data-id="' + escapeHtml(p.id) + '" aria-label="Select ' + escapeHtml(p.firstName + " " + p.lastName) + ' as patient">Select Patient</button></div>'
    ).join("");
  }

  function clearSearch() {
    $("prLastNameSearch").value = "";
    $("prDobSearch").value = "";
    $("prMobileSearch").value = "";
    closeResults();
    resetPatientFields();
    $("prUsePreferred").checked = true;
    applyPharmacy();
    $("prPatientError").hidden = true;
  }

  function selectedReason() {
    const r = document.querySelector('input[name="refillReason"]:checked');
    return r ? r.value : "";
  }

  function selectedMedications() {
    return MEDICATIONS.filter((m) => state.selected.has(m.id));
  }

  function pharmacyData() {
    const key = $("prPharmacySelect").value;
    return {
      name: PHARMACIES[key].name,
      phone: $("prPharmacyPhone").value.trim(),
      address: $("prPharmacyAddress").value.trim(),
      preferred: $("prUsePreferred").checked
    };
  }

  function collectData() {
    const physician = state.physician;
    return {
      patientId: state.patient ? state.patient.id : "",
      patientName: $("prFirstName").value.trim() + " " + $("prLastName").value.trim(),
      mrn: $("prMrn").value.trim(),
      contact: {
        phone: $("prPhone").value.trim(),
        email: $("prEmail").value.trim(),
        address1: $("prAddress1").value.trim(),
        address2: $("prAddress2").value.trim(),
        city: $("prCity").value.trim(),
        state: $("prState").value,
        postal: $("prPostal").value.trim()
      },
      medications: selectedMedications().map((m) => ({ id: m.id, name: m.name, strength: m.strength, refills: m.refills })),
      pharmacy: pharmacyData(),
      reason: selectedReason(),
      notes: $("prNotes").value.trim(),
      physician: {
        name: physician ? physician.name : "",
        department: physician ? physician.department : "",
        phone: $("prPhysicianPhone").value.trim()
      },
      signature: state.signature,
      signedOn: $("prSignDate").value
    };
  }

  function validate() {
    clearErrors();
    const invalid = [];

    function fail(focusEl, flagFn) {
      flagFn();
      invalid.push(focusEl);
    }

    if (!state.patient) {
      fail($("prLastNameSearch"), () => flagStatic("prPatientError"));
    }

    const phone = $("prPhone");
    const phoneDigits = phone.value.replace(/\D/g, "");
    if (!phone.value.trim()) {
      fail(phone, () => flagField(phone, "Phone number is required."));
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      fail(phone, () => flagField(phone, "Enter a valid phone number."));
    }

    const email = $("prEmail");
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      fail(email, () => flagField(email, "Enter a valid email address."));
    }

    const address1 = $("prAddress1");
    if (!address1.value.trim()) {
      fail(address1, () => flagField(address1, "Address line 1 is required."));
    }

    const city = $("prCity");
    if (!city.value.trim()) {
      fail(city, () => flagField(city, "City is required."));
    }

    const postal = $("prPostal");
    if (postal.value.trim() && !/^[A-Za-z0-9\- ]{3,10}$/.test(postal.value.trim())) {
      fail(postal, () => flagField(postal, "Enter a valid postal / zip code."));
    }

    const meds = selectedMedications();
    if (!meds.length) {
      fail($("prSelectAll"), () => flagStatic("prMedError"));
    }

    const pharmacySelect = $("prPharmacySelect");
    if (pharmacySelect.value === "other") {
      const pPhone = $("prPharmacyPhone");
      const pAddress = $("prPharmacyAddress");
      if (!pPhone.value.trim() && !pAddress.value.trim()) {
        fail(pPhone, () => flagField(pPhone, "Enter the pharmacy phone number or address."));
      }
    }

    const reason = selectedReason();
    if (!reason) {
      fail(document.querySelector('input[name="refillReason"]'), () => flagStatic("prReasonError", "Select a reason for the refill."));
    } else if (reason === "Refill remaining medication" && meds.some((m) => m.refills === 0)) {
      fail(document.querySelector('input[name="refillReason"]'), () =>
        flagStatic("prReasonError", "A selected medication has no refills remaining. Choose \"No refills remaining\" instead."));
    }

    const notes = $("prNotes");
    if (reason === "Other" && !notes.value.trim()) {
      fail(notes, () => flagField(notes, "Please describe the reason in additional information."));
    }

    if (!state.physician) {
      fail($("prPhysicianBtn"), () => flagField($("prPhysician"), "Prescribing physician is required."));
    }

    const physicianPhone = $("prPhysicianPhone");
    const physicianDigits = physicianPhone.value.replace(/\D/g, "");
    if (physicianPhone.value.trim() && (physicianDigits.length < 7 || physicianDigits.length > 15)) {
      fail(physicianPhone, () => flagField(physicianPhone, "Enter a valid phone number."));
    }

    if (!state.signature) {
      fail($("prSignatureBtn"), () => {
        flagStatic("prSignatureError");
        $("prSignatureBox").classList.add("is-invalid");
      });
    }

    const signDate = $("prSignDate");
    if (!signDate.value) {
      fail(signDate, () => flagField(signDate, "Date signed is required."));
    } else if (signDate.value > todayIso()) {
      fail(signDate, () => flagField(signDate, "Date signed cannot be in the future."));
    }

    if (invalid.length) {
      const target = invalid[0];
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function saveDraft() {
    clearErrors();
    if (!state.patient) {
      flagStatic("prPatientError");
      $("prLastNameSearch").scrollIntoView({ behavior: "smooth", block: "center" });
      $("prLastNameSearch").focus({ preventScroll: true });
      return;
    }
    const draftId = nextId("DFT", DRAFT_COUNTER_KEY);
    const draft = collectData();
    draft.draftId = draftId;
    draft.status = "Draft";
    draft.savedAt = new Date().toISOString();
    appendToList(DRAFTS_KEY, draft);
    $("prDraftId").textContent = draftId;
    openModal($("prDraftModal"));
  }

  function submitRequest(e) {
    e.preventDefault();
    if (state.submitting) return;
    if (!validate()) return;
    state.submitting = true;
    $("prSubmitBtn").disabled = true;

    const requestId = nextId("RFL", REQUEST_COUNTER_KEY);
    const request = collectData();
    request.requestId = requestId;
    request.status = REQUEST_STATUS;
    request.submittedAt = new Date().toISOString();
    appendToList(REQUESTS_KEY, request);

    $("prSuccessId").textContent = requestId;
    $("prSuccessPatient").textContent = request.patientName;
    $("prSuccessMeds").textContent = request.medications.map((m) => m.name).join(", ");
    $("prSuccessPharmacy").textContent = request.pharmacy.name;
    $("prSuccessStatus").textContent = REQUEST_STATUS;
    openModal($("prSuccessModal"));
  }

  function clearAll() {
    clearSearch();
    document.querySelector('input[name="refillReason"][value="Refill remaining medication"]').checked = true;
    $("prNotes").value = "";
    $("prNotesCount").textContent = "0/500";
    clearSignature();
    $("prSignDate").value = todayIso();
    clearErrors();
    state.submitting = false;
    $("prSubmitBtn").disabled = false;
  }

  function clearSignature() {
    state.signature = "";
    const img = $("prSignaturePreview");
    img.removeAttribute("src");
    img.hidden = true;
    $("prSignaturePlaceholder").hidden = false;
  }

  const canvas = $("prSignatureCanvas");
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let hasInk = false;

  function setupCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#183153";
    hasInk = false;
  }

  function canvasPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e) {
    drawing = true;
    const p = canvasPoint(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.01, p.y + 0.01);
    ctx.stroke();
    hasInk = true;
    $("prSignatureModalError").hidden = true;
    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!drawing) return;
    const p = canvasPoint(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }

  function onPointerUp() {
    drawing = false;
  }

  function applySignature() {
    if (!hasInk) {
      $("prSignatureModalError").hidden = false;
      return;
    }
    state.signature = canvas.toDataURL("image/png");
    const img = $("prSignaturePreview");
    img.src = state.signature;
    img.hidden = false;
    $("prSignaturePlaceholder").hidden = true;
    $("prSignatureError").hidden = true;
    $("prSignatureBox").classList.remove("is-invalid");
    closeModal($("prSignatureModal"));
  }

  function openSignature() {
    openModal($("prSignatureModal"));
    setupCanvas();
    $("prSignatureModalError").hidden = true;
  }

  function init() {
    populateStates();
    renderMeds();
    renderHistory();
    applyPharmacy();
    renderPhysicians("");
    $("prSignDate").value = todayIso();
    $("prSignDate").max = todayIso();
    $("prDobSearch").max = todayIso();

    ["prLastNameSearch", "prMobileSearch", "prDobSearch"].forEach((id) => {
      const el = $(id);
      el.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(searchPatients, 250);
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          clearTimeout(debounceTimer);
          searchPatients();
        } else if (e.key === "Escape") {
          closeResults();
        }
      });
    });

    $("prSearchBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      clearTimeout(debounceTimer);
      searchPatients();
    });
    $("prClearBtn").addEventListener("click", clearSearch);

    $("prSearchResults").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      const patient = patients.find((p) => p.id === btn.dataset.id);
      if (patient) populatePatient(patient);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".pr-search-grid") && !e.target.closest("#prSearchResults")) {
        closeResults();
      }
    });

    $("prMedBody").addEventListener("change", onMedChange);
    $("prSelectAll").addEventListener("change", onSelectAll);

    $("prHistoryBtn").addEventListener("click", () => {
      renderHistory();
      openModal($("prHistoryModal"));
    });

    $("prUsePreferred").addEventListener("change", applyPharmacy);
    $("prPharmacySelect").addEventListener("change", onPharmacyChange);

    document.querySelectorAll('input[name="refillReason"]').forEach((r) => {
      r.addEventListener("change", () => {
        $("prReasonError").hidden = true;
        clearFieldError($("prNotes"));
      });
    });

    $("prNotes").addEventListener("input", () => {
      $("prNotesCount").textContent = $("prNotes").value.length + "/500";
    });

    ["prPhone", "prEmail", "prAddress1", "prCity", "prPostal", "prPhysicianPhone", "prPharmacyPhone", "prPharmacyAddress", "prNotes", "prSignDate"].forEach((id) => {
      $(id).addEventListener("input", () => clearFieldError($(id)));
    });

    const openPhysician = () => {
      $("prPhysicianSearch").value = "";
      renderPhysicians("");
      openModal($("prPhysicianModal"));
    };
    $("prPhysicianBtn").addEventListener("click", openPhysician);
    $("prPhysician").addEventListener("click", openPhysician);
    $("prPhysicianSearch").addEventListener("input", (e) => renderPhysicians(e.target.value));
    $("prPhysicianList").addEventListener("click", (e) => {
      const btn = e.target.closest(".pr-person");
      if (!btn) return;
      setPhysician(PHYSICIANS.find((p) => p.id === btn.dataset.id) || null);
      closeModal($("prPhysicianModal"));
    });

    $("prSignatureBtn").addEventListener("click", openSignature);
    $("prSignatureBox").addEventListener("click", (e) => {
      if (!e.target.closest("#prSignatureBtn")) openSignature();
    });
    $("prSignatureClear").addEventListener("click", () => {
      setupCanvas();
      $("prSignatureModalError").hidden = true;
    });
    $("prSignatureApply").addEventListener("click", applySignature);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    $("prSaveDraftBtn").addEventListener("click", saveDraft);
    $("prForm").addEventListener("submit", submitRequest);

    $("prCancelBtn").addEventListener("click", () => openModal($("prCancelModal")));
    $("prCancelKeep").addEventListener("click", () => closeModal($("prCancelModal")));
    $("prCancelDiscard").addEventListener("click", () => {
      activeModal = null;
      $("prCancelModal").classList.remove("show");
      document.removeEventListener("keydown", onModalKey);
      clearAll();
      window.location.href = "dashboard.html";
    });

    $("prDraftOk").addEventListener("click", () => closeModal($("prDraftModal")));
    $("prSuccessDone").addEventListener("click", () => closeModal($("prSuccessModal")));

    document.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => closeModal($(el.dataset.close)));
    });

    document.querySelectorAll(".pr-modal").forEach((modal) => {
      modal.addEventListener("mousedown", (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    $("prForm").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "submit") {
        e.preventDefault();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
