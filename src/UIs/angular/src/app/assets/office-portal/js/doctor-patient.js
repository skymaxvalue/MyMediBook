const PATIENT_DEMO_FALLBACK = {
    name: "Sundaram S",
    age: 40,
    gender: "Male",
    mobile: "Not provided",
    email: "Not provided",
    weight: "68",
    height: "172",
    bloodPressure: "120/80",
    bloodSugar: "98",
    purpose: "General consultation"
};

const PATIENT_DEMO_REFERRALS = [
    { patient: "Sundaram S", receivingDoctor: "Dr. Morgan Maxwell", department: "Cardiology", status: "Pending" }
];

const PATIENT_DEMO_TESTS = [
    { name: "Complete Blood Count (CBC)", date: "03-11-2026", result: "Awaiting result", status: "Requested" },
    { name: "Fasting Blood Sugar", date: "03-11-2026", result: "98 mg/dL", status: "Completed" }
];

const PATIENT_DEMO_HISTORY = [
    {
        date: "20-02-2025 11:00 AM",
        doctor: "Dr. Kumaravel",
        purpose: "Routine follow-up",
        weight: "68 kg",
        height: "172 cm",
        bloodPressure: "120/80 mmHg",
        bloodSugar: "98 mg/dL",
        observation: "No new complaints reported. Vitals are stable and within the normal range.",
        treatment: "Continue the current management plan.",
        suggestion: "Maintain regular exercise and a balanced diet. Review in six months.",
        prescription: "Vitamin D3 60,000 IU once weekly for 8 weeks."
    },
    {
        date: "29-11-2024 09:30 AM",
        doctor: "Dr. Morgan Maxwell",
        purpose: "General consultation",
        weight: "69 kg",
        height: "172 cm",
        bloodPressure: "126/82 mmHg",
        bloodSugar: "104 mg/dL",
        observation: "Mild fatigue and occasional headaches for two weeks. No fever or chest pain.",
        treatment: "Rest, adequate hydration and a regular sleep schedule.",
        suggestion: "Monitor blood pressure at home and return if symptoms persist.",
        prescription: "Paracetamol 500 mg as needed, up to three times daily for 3 days."
    },
    {
        date: "12-09-2024 10:00 AM",
        doctor: "Dr. Kumaravel",
        purpose: "Initial consultation",
        weight: "70 kg",
        height: "172 cm",
        bloodPressure: "122/80 mmHg",
        bloodSugar: "96 mg/dL",
        observation: "First visit. General examination normal. Baseline vitals recorded.",
        treatment: "No active treatment required.",
        suggestion: "Routine blood tests and a follow-up visit in three months.",
        prescription: "None prescribed."
    }
];

const PATIENT_DEMO_DOCTORS = [
    ["Dr. Morgan Maxwell", "Cardiology"],
    ["Dr. Anitha Raman", "Cardiology"],
    ["Dr. Rohan Mehta", "Cardiology"],
    ["Dr. Priya Nair", "Dermatology"],
    ["Dr. Karthik Subramanian", "Dermatology"],
    ["Dr. Lakshmi Venkat", "Endocrinology"],
    ["Dr. Imran Qureshi", "Endocrinology"],
    ["Dr. Suresh Iyer", "ENT"],
    ["Dr. Neha Kapoor", "ENT"],
    ["Dr. Kumaravel", "General Medicine"],
    ["Dr. Deepa Krishnan", "General Medicine"],
    ["Dr. Arvind Pillai", "Neurology"],
    ["Dr. Sunita Rao", "Neurology"],
    ["Dr. Vikram Shetty", "Orthopaedics"],
    ["Dr. Meera Joshi", "Orthopaedics"]
].map(([name, specialisation], index) => ({
    name,
    specialisation,
    address: "Health Haven Medical Center, " + specialisation + " Wing, Floor " + (index % 4 + 1),
    phone: "+91 98400 11" + String(index + 1).padStart(3, "0") + ", +91 44 2000 " + (1100 + index),
    email: name.replace(/^Dr\. /, "").toLowerCase().replace(/\s+/g, ".") + "@healthhaven.example",
    hours: "Mon–Fri, 9:00 AM – 1:00 PM"
}));

let selectedPatient = null;
let selectedDoctorIndex = -1;
let detailDoctorIndex = -1;
let patientTests = [];
let patientReferrals = [];
let activeModal = null;
let modalOpener = null;

function initializeDoctorPatient() {
    const session = window.HHAuth && HHAuth.requireRole ? HHAuth.requireRole("doctor") : null;
    if (window.HHAuth && !session) return;

    document.body.classList.remove("auth-pending");
    if (session && typeof fillUser === "function") fillUser(session);
    if (typeof startClock === "function") startClock();
    setupNavigation();
    resolveSelectedPatient();
    loadPatientRecords();
    renderPatientScreen();
    setupPatientTabs();
    setupPatientActions();
    setupPatientExtras();
    if (typeof setupProfileMenu === "function") setupProfileMenu();
    if (typeof setupModals === "function") setupModals();
}

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("dcTabs")) {
        document.addEventListener("doctorNavbarReady", initializeDoctorPatient, { once: true });
        return;
    }
    initializeDoctorPatient();
});

function setupNavigation() {
    document.querySelectorAll("#dcTabs .nav-item").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === "patients");
        tab.addEventListener("click", () => {
            if (tab.dataset.tab !== "patients") window.location.href = "doctor-dashboard.html?tab=" + encodeURIComponent(tab.dataset.tab);
        });
    });
}

function getAppointmentData() {
    return Array.isArray(window.DEMO_APPOINTMENTS) ? window.DEMO_APPOINTMENTS : [];
}

function resolveSelectedPatient() {
    const records = getAppointmentData();
    const requested = new URLSearchParams(window.location.search).get("patient");
    selectedPatient = requested ? records.find(item => item.name === requested) : records[0];
    selectedPatient = selectedPatient || PATIENT_DEMO_FALLBACK;
}

function loadPatientRecords() {
    patientTests = PATIENT_DEMO_TESTS.map(item => ({ ...item }));
    const referrals = Array.isArray(window.DEMO_REFERRALS) ? window.DEMO_REFERRALS : [];
    let items = referrals.filter(item => !item.patient || item.patient === selectedPatient.name).map(item => ({ ...item }));
    if (!items.length) items = [{ ...PATIENT_DEMO_REFERRALS[0], patient: selectedPatient.name }];
    patientReferrals = items;
}

function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value === undefined || value === null || value === "" ? "Not provided" : value;
}

function renderPatientScreen() {
    const patient = { ...PATIENT_DEMO_FALLBACK, ...(selectedPatient || {}) };
    setFieldValue("ptName", patient.name);
    setFieldValue("ptAge", patient.age ? patient.age + " years" : "Not provided");
    setFieldValue("ptMobile", patient.mobile);
    setFieldValue("ptEmail", patient.email);
    setEditableValue("ptWeight", patient.weight);
    setEditableValue("ptHeight", patient.height);
    setEditableValue("ptBloodPressure", patient.bloodPressure);
    setEditableValue("ptBloodSugar", patient.bloodSugar);
    setEditableValue("ptPurpose", patient.purpose);
    setFieldValue("ptReferName", patient.name);
    setFieldValue("ptReferAge", patient.age ? patient.age + " years" : "Not provided");
    setFieldValue("ptConsultName", patient.name);
    setFieldValue("ptConsultAge", patient.age ? patient.age + " years" : "Not provided");
    const gender = document.getElementById("ptGender");
    if (gender) gender.value = patient.gender || "Other";
    renderDoctorList();
    renderPatientReferrals();
    renderPatientTests();
    renderPatientHistory();
}

function setEditableValue(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value === undefined || value === null ? "" : value;
}

function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value || "—";
    return cell;
}

function createStatusCell(status) {
    const cell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + (status === "Completed" ? "completed" : "waiting");
    badge.textContent = status || "Pending";
    cell.appendChild(badge);
    return cell;
}

function fillRows(id, records, columns, emptyMessage) {
    const body = document.getElementById(id);
    if (!body) return;
    body.replaceChildren();
    if (!records.length) {
        const row = document.createElement("tr");
        const cell = createCell(emptyMessage);
        cell.colSpan = columns;
        cell.className = "dc-empty";
        row.appendChild(cell);
        body.appendChild(row);
        return;
    }
    records.forEach(record => {
        const row = document.createElement("tr");
        columns === 3 && id === "dcPatientReferralRows"
            ? [record.receivingDoctor, record.department].forEach(value => row.appendChild(createCell(value)))
            : null;
        if (id === "dcPatientReferralRows") row.appendChild(createStatusCell(record.status));
        if (id === "dcPatientTestRows") {
            [record.name, record.date, record.result].forEach(value => row.appendChild(createCell(value)));
            row.appendChild(createStatusCell(record.status));
        }
        if (id === "dcPatientHistoryRows") {
            [record.date, record.doctor, record.purpose].forEach(value => row.appendChild(createCell(value)));
            const action = document.createElement("td");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dc-pt-link-button";
            button.textContent = "View Details";
            button.addEventListener("click", () => openHistoryDetails(record));
            action.appendChild(button);
            row.appendChild(action);
        }
        body.appendChild(row);
    });
}

function renderPatientReferrals() {
    fillRows("dcPatientReferralRows", patientReferrals, 3, "No referrals recorded for this patient.");
}

function renderPatientTests() {
    fillRows("dcPatientTestRows", patientTests, 4, "No tests or scans recorded.");
}

function renderPatientHistory() {
    fillRows("dcPatientHistoryRows", PATIENT_DEMO_HISTORY, 4, "No previous consultations recorded.");
}

function activatePatientTab(key) {
    document.querySelectorAll(".dc-pt-tab").forEach(tab => {
        const active = tab.dataset.pt === key;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".dc-pt-panel").forEach(panel => panel.hidden = panel.id !== "ptPanel-" + key);
    updatePatientButtons();
}

function setupPatientTabs() {
    document.querySelectorAll(".dc-pt-tab").forEach(tab => tab.addEventListener("click", () => activatePatientTab(tab.dataset.pt)));
}

function updatePatientButtons() {
    const order = ["info", "observation", "tests", "history", "referrals"];
    const active = document.querySelector(".dc-pt-tab.active");
    const index = Math.max(0, order.indexOf(active ? active.dataset.pt : "info"));
    const back = document.getElementById("ptBackBtn");
    const next = document.getElementById("ptNextBtn");
    const isLast = index === order.length - 1;
    back.disabled = index === 0;
    next.disabled = false;
    if (isLast) next.textContent = "Complete Consultation";
    else next.innerHTML = 'Continue <span aria-hidden="true">→</span>';
}

function setupPatientActions() {
    const order = ["info", "observation", "tests", "history", "referrals"];
    document.getElementById("ptBackBtn").addEventListener("click", () => {
        const active = document.querySelector(".dc-pt-tab.active");
        const index = order.indexOf(active ? active.dataset.pt : "info");
        if (index > 0) activatePatientTab(order[index - 1]);
    });
    document.getElementById("ptNextBtn").addEventListener("click", () => {
        const active = document.querySelector(".dc-pt-tab.active");
        const index = order.indexOf(active ? active.dataset.pt : "info");
        if (index < order.length - 1) activatePatientTab(order[index + 1]);
        else completeConsultation();
    });
    document.getElementById("ptSaveBtn").addEventListener("click", () => {
        saveDraft();
        showNotice("Draft saved in this browser session.");
    });
    updatePatientButtons();
}

function saveDraft() {
    const draft = {};
    ["ptWeight", "ptHeight", "ptBloodPressure", "ptBloodSugar", "ptPurpose", "ptObservation", "ptTreatment", "ptSuggestion", "ptPrescription"].forEach(id => draft[id] = document.getElementById(id)?.value || "");
    try { sessionStorage.setItem("doctorPatientDraft_" + selectedPatient.name, JSON.stringify(draft)); } catch (error) {}
}

function completeConsultation() {
    if (activeModal) return;
    saveDraft();
    document.getElementById("ptCompleteText").textContent = "The consultation for " + selectedPatient.name + " has been completed and saved.";
    openPatientModal("ptCompleteModal", "ptCompleteBack");
}

function goToAppointments() {
    window.location.href = "doctor-dashboard.html?tab=appointments";
}

function setupPatientExtras() {
    document.getElementById("ptAddTest")?.addEventListener("click", openAddTest);
    setupSpecialisationOptions();
    document.getElementById("ptSpecialisation")?.addEventListener("change", renderDoctorList);
    document.getElementById("ptReferBtn")?.addEventListener("click", createReferral);
    document.getElementById("ptDocSelect")?.addEventListener("click", () => {
        if (detailDoctorIndex >= 0) selectDoctor(detailDoctorIndex);
        closePatientModal();
    });
    document.getElementById("ptTestForm")?.addEventListener("submit", submitTest);
    ["ptTestName", "ptTestDate"].forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener("input", () => clearFieldError(id));
        field.addEventListener("change", () => clearFieldError(id));
    });
    setupPatientModals();
    document.getElementById("ptCompleteBack")?.addEventListener("click", goToAppointments);
    try {
        const saved = JSON.parse(sessionStorage.getItem("doctorPatientDraft_" + selectedPatient.name) || "{}");
        Object.entries(saved).forEach(([id, value]) => { const field = document.getElementById(id); if (field) field.value = value; });
    } catch (error) {}
}

function showNotice(message) {
    const notice = document.getElementById("dcNotice");
    notice.textContent = message;
    notice.hidden = false;
    notice.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setupPatientModals() {
    document.querySelectorAll(".dc-pt-modal").forEach(modal => {
        modal.addEventListener("click", event => {
            if (modal.id === "ptCompleteModal") return;
            if (event.target === modal || event.target.closest("[data-pt-close]")) closePatientModal();
        });
    });
    document.addEventListener("keydown", event => {
        if (!activeModal) return;
        if (event.key === "Escape") {
            event.preventDefault();
            if (activeModal.id === "ptCompleteModal") goToAppointments();
            else closePatientModal();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = Array.from(activeModal.querySelectorAll("button, input, select, textarea")).filter(item => !item.disabled && item.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

function openPatientModal(id, focusId) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modalOpener = document.activeElement;
    modal.hidden = false;
    activeModal = modal;
    document.body.classList.add("dc-pt-modal-open");
    const target = document.getElementById(focusId) || modal.querySelector("button");
    if (target) target.focus();
}

function closePatientModal() {
    if (!activeModal) return;
    activeModal.hidden = true;
    activeModal = null;
    document.body.classList.remove("dc-pt-modal-open");
    if (modalOpener && typeof modalOpener.focus === "function") modalOpener.focus();
    modalOpener = null;
}

function setFieldError(id, message) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    if (field) field.setAttribute("aria-invalid", "true");
    if (error) {
        error.textContent = message;
        error.hidden = false;
    }
}

function clearFieldError(id) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    if (field) field.removeAttribute("aria-invalid");
    if (error) {
        error.textContent = "";
        error.hidden = true;
    }
}

function getTodayIso() {
    const now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
}

function formatDisplayDate(iso) {
    const parts = iso.split("-");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
}

function openAddTest() {
    document.getElementById("ptTestForm").reset();
    document.getElementById("ptTestDate").value = getTodayIso();
    ["ptTestName", "ptTestDate"].forEach(clearFieldError);
    openPatientModal("ptTestModal", "ptTestName");
}

function submitTest(event) {
    event.preventDefault();
    const name = document.getElementById("ptTestName").value.trim();
    const date = document.getElementById("ptTestDate").value;
    const notes = document.getElementById("ptTestNotes").value.trim();
    ["ptTestName", "ptTestDate"].forEach(clearFieldError);
    let valid = true;
    if (!name) {
        setFieldError("ptTestName", "Enter or select a test name.");
        valid = false;
    }
    if (!date) {
        setFieldError("ptTestDate", "Select the requested date.");
        valid = false;
    }
    if (!valid) {
        const firstInvalid = document.querySelector("#ptTestForm [aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
    }
    patientTests.push({ name, date: formatDisplayDate(date), result: "Awaiting result", status: "Requested", notes });
    renderPatientTests();
    closePatientModal();
    showNotice(name + " added to Tests and Scans.");
}

function setupSpecialisationOptions() {
    const select = document.getElementById("ptSpecialisation");
    if (!select) return;
    Array.from(new Set(PATIENT_DEMO_DOCTORS.map(doctor => doctor.specialisation))).sort().forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

function renderDoctorList() {
    const body = document.getElementById("dcReferralDoctorRows");
    const filter = document.getElementById("ptSpecialisation");
    if (!body || !filter) return;
    const visible = PATIENT_DEMO_DOCTORS.map((doctor, index) => ({ doctor, index })).filter(item => !filter.value || item.doctor.specialisation === filter.value);
    if (!visible.some(item => item.index === selectedDoctorIndex)) selectedDoctorIndex = -1;
    body.replaceChildren();
    visible.forEach(({ doctor, index }) => {
        const row = document.createElement("tr");
        row.className = "dc-pt-doctor-row";
        row.classList.toggle("dc-pt-selected", index === selectedDoctorIndex);
        const pickCell = document.createElement("td");
        const label = document.createElement("label");
        label.className = "dc-pt-doctor-pick";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "ptDoctorPick";
        radio.value = String(index);
        radio.checked = index === selectedDoctorIndex;
        radio.addEventListener("change", () => selectDoctor(index));
        label.appendChild(radio);
        label.appendChild(document.createTextNode(doctor.name));
        pickCell.appendChild(label);
        row.appendChild(pickCell);
        row.appendChild(createCell(doctor.address));
        row.appendChild(createCell(doctor.phone));
        const action = document.createElement("td");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dc-pt-link-button";
        button.textContent = "Detail";
        button.addEventListener("click", () => openDoctorDetails(index));
        action.appendChild(button);
        row.appendChild(action);
        row.addEventListener("click", event => {
            if (!event.target.closest("button, label")) selectDoctor(index);
        });
        body.appendChild(row);
    });
}

function selectDoctor(index) {
    selectedDoctorIndex = index;
    document.querySelectorAll("#dcReferralDoctorRows tr").forEach(row => {
        const radio = row.querySelector("input[type='radio']");
        const active = radio && Number(radio.value) === index;
        row.classList.toggle("dc-pt-selected", active);
        if (radio) radio.checked = active;
    });
    clearFieldError("ptReferral");
}

function openDoctorDetails(index) {
    const doctor = PATIENT_DEMO_DOCTORS[index];
    if (!doctor) return;
    detailDoctorIndex = index;
    const text = {
        ptDocName: doctor.name,
        ptDocSpec: doctor.specialisation,
        ptDocAddress: doctor.address,
        ptDocPhone: doctor.phone,
        ptDocEmail: doctor.email,
        ptDocHours: doctor.hours
    };
    Object.entries(text).forEach(([id, value]) => {
        document.getElementById(id).textContent = value || "—";
    });
    openPatientModal("ptDoctorModal", "ptDocSelect");
}

function createReferral() {
    clearFieldError("ptReferral");
    const doctor = PATIENT_DEMO_DOCTORS[selectedDoctorIndex];
    if (!doctor) {
        setFieldError("ptReferral", "Select a doctor to refer this patient.");
        return;
    }
    const procedure = document.getElementById("ptReferProcedure").value.trim();
    patientReferrals.push({ patient: selectedPatient.name, receivingDoctor: doctor.name, department: doctor.specialisation, status: "Pending", procedure });
    renderPatientReferrals();
    selectedDoctorIndex = -1;
    document.getElementById("ptReferProcedure").value = "";
    renderDoctorList();
    showNotice("Referral to " + doctor.name + " (" + doctor.specialisation + ") created with status Pending.");
}

function openHistoryDetails(record) {
    const text = {
        ptHistDate: record.date,
        ptHistDoctor: record.doctor,
        ptHistPurpose: record.purpose,
        ptHistWeight: record.weight,
        ptHistHeight: record.height,
        ptHistBloodPressure: record.bloodPressure,
        ptHistBloodSugar: record.bloodSugar,
        ptHistObservation: record.observation,
        ptHistTreatment: record.treatment,
        ptHistSuggestion: record.suggestion,
        ptHistPrescription: record.prescription
    };
    Object.entries(text).forEach(([id, value]) => {
        document.getElementById(id).textContent = value || "—";
    });
    openPatientModal("ptHistoryModal");
}
