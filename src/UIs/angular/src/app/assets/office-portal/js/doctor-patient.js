const PATIENT_NOT_FOUND = "No patient record was found for the selected patient.";

let selectedPatient = null;

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("dcTabs")) {
        document.addEventListener("doctorNavbarReady", initializeDoctorPatient, { once: true });
        return;
    }

    initializeDoctorPatient();

});

function initializeDoctorPatient() {

    const session = HHAuth.requireRole("doctor");

    if (!session) {
        return;
    }

    document.body.classList.remove("auth-pending");

    fillUser(session);

    startClock();

    setupNavigation();

    resolveSelectedPatient();

    renderPatientScreen();

    setupPatientTabs();

    setupProfileMenu();

    setupModals();

}

function setupNavigation() {

    document.querySelectorAll("#dcTabs .nav-item").forEach(tab => {

        tab.classList.toggle("active", tab.dataset.tab === "patients");

        tab.addEventListener("click", () => {

            if (tab.dataset.tab !== "patients") {
                window.location.href = "doctor-dashboard.html?tab=" + encodeURIComponent(tab.dataset.tab);
            }

        });

    });

}

function resolveSelectedPatient() {

    const requested = new URLSearchParams(window.location.search).get("patient");

    if (!requested) {
        selectedPatient = DEMO_APPOINTMENTS[0] || null;
        return;
    }

    selectedPatient = DEMO_APPOINTMENTS.find(item => item.name === requested) || null;

    if (!selectedPatient) {
        const notice = document.getElementById("dcNotice");
        notice.textContent = PATIENT_NOT_FOUND;
        notice.hidden = false;
    }

}

function createCell(text) {

    const cell = document.createElement("td");

    cell.textContent = text;

    return cell;

}

function createStatusCell(status) {

    const cell = document.createElement("td");

    const badge = document.createElement("span");

    badge.className = "badge " + (status === "Completed" ? "completed" : "waiting");

    badge.textContent = status;

    cell.appendChild(badge);

    return cell;

}

function setFieldValue(id, value) {

    document.getElementById(id).value = value || "";

}

function renderPatientScreen() {

    const patient = selectedPatient;

    const gender = document.getElementById("ptGender");

    setFieldValue("ptName", patient ? patient.name : "");

    setFieldValue("ptAge", patient ? patient.age + " years" : "");

    setFieldValue("ptMobile", patient && patient.mobile);

    setFieldValue("ptEmail", patient && patient.email);

    setFieldValue("ptWeight", patient && patient.weight);

    setFieldValue("ptHeight", patient && patient.height);

    setFieldValue("ptBloodPressure", patient && patient.bloodPressure);

    setFieldValue("ptBloodSugar", patient && patient.bloodSugar);

    setFieldValue("ptPurpose", patient && patient.purpose);

    gender.value = patient ? patient.gender : "";

    if (!patient) {
        gender.selectedIndex = -1;
    }

    renderPatientReferrals();

}

function renderPatientReferrals() {

    const body = document.getElementById("dcPatientReferralRows");

    body.replaceChildren();

    const items = selectedPatient
        ? DEMO_REFERRALS.filter(item => item.patient === selectedPatient.name)
        : [];

    if (items.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 3;

        cell.className = "dc-empty";

        cell.textContent = "No referrals to show for this patient.";

        row.appendChild(cell);

        body.appendChild(row);

        return;

    }

    items.forEach(item => {

        const row = document.createElement("tr");

        row.appendChild(createCell(item.receivingDoctor || "---"));
        row.appendChild(createCell(item.department || "---"));
        row.appendChild(createStatusCell(item.status));

        body.appendChild(row);

    });

}

function activatePatientTab(key) {

    document.querySelectorAll(".dc-pt-tab").forEach(tab => {

        const active = tab.dataset.pt === key;

        tab.classList.toggle("active", active);

        tab.setAttribute("aria-selected", String(active));

    });

    document.querySelectorAll(".dc-pt-panel").forEach(panel => {
        panel.hidden = panel.id !== "ptPanel-" + key;
    });

}

function setupPatientTabs() {

    document.querySelectorAll(".dc-pt-tab").forEach(tab => {
        tab.addEventListener("click", () => activatePatientTab(tab.dataset.pt));
    });

}
