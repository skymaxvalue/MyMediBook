const DEMO_APPOINTMENTS = [
    { time: "09:00 AM", name: "Sundaram S", age: 40, gender: "Male", status: "Completed", compliance: "---" },
    { time: "09:30 AM", name: "Balan Pradeep", age: 31, gender: "Male", status: "Checked In", compliance: "---" },
    { time: "10:00 AM", name: "Sharath Kumar", age: 24, gender: "Male", status: "Waiting", compliance: "---" },
    { time: "10:30 AM", name: "Prakash", age: 36, gender: "Male", status: "Waiting", compliance: "---" },
    { time: "11:00 AM", name: "Geetham", age: 33, gender: "Female", status: "Waiting", compliance: "---" }
];

const DEMO_REFERRALS = [];

const DEMO_INPATIENTS = [];

const TAB_TITLES = {
    appointments: "APPOINTMENT LIST",
    patients: "PATIENT",
    referrals: "REFERRAL LIST",
    inpatient: "IN-PATIENT CARE"
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const STATUS_CLASSES = {
    "Waiting": "waiting",
    "Checked In": "consultation",
    "Completed": "completed"
};

document.addEventListener("DOMContentLoaded", () => {

    const session = HHAuth.requireRole("doctor");

    if (!session) {
        return;
    }

    document.body.classList.remove("auth-pending");

    fillUser(session);

    startClock();

    renderAppointments();

    renderPatients();

    renderReferrals();

    renderInpatients();

    renderStats();

    setupTabs();

    setupProfileMenu();

    setupModals();

});

function fillUser(session) {

    const initials = getInitials(session.name);

    document.getElementById("dcUserName").textContent = session.name;

    document.getElementById("dcUserRole").textContent = session.title;

    document.getElementById("dcAvatar").textContent = initials;

    document.getElementById("dcProfileInitials").textContent = initials;

    document.getElementById("dcProfileTitle").textContent = session.name;

    document.getElementById("dcProfileMeta").textContent =
        session.title + " \u2022 Employee ID " + session.employeeId;

}

function getInitials(name) {

    const words = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/).filter(Boolean);

    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join("");

}

function startClock() {

    updateClock();

    setInterval(updateClock, 1000);

}

function updateClock() {

    const now = new Date();

    document.getElementById("dcHeaderDate").textContent =
        now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    document.getElementById("dcHeaderTime").textContent =
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    document.getElementById("dcDateBanner").textContent =
        String(now.getDate()).padStart(2, "0") + "-" +
        MONTHS[now.getMonth()] + "-" +
        now.getFullYear() +
        " (" + WEEKDAYS[now.getDay()] + ")";

}

function createCell(text) {

    const cell = document.createElement("td");

    cell.textContent = text;

    return cell;

}

function createPatientCell(name) {

    const cell = document.createElement("td");

    const link = document.createElement("a");

    link.href = "#";

    link.className = "dc-patient-link";

    link.textContent = name;

    link.addEventListener("click", event => {

        event.preventDefault();

        showNotice("Patient record pages are not connected to this demo yet.");

    });

    cell.appendChild(link);

    return cell;

}

function createStatusCell(status) {

    const cell = document.createElement("td");

    const badge = document.createElement("span");

    badge.className = "badge " + (STATUS_CLASSES[status] || "waiting");

    badge.textContent = status;

    cell.appendChild(badge);

    return cell;

}

function renderEmpty(bodyId, columns, message) {

    const body = document.getElementById(bodyId);

    const row = document.createElement("tr");

    const cell = document.createElement("td");

    cell.colSpan = columns;

    cell.className = "dc-empty";

    cell.textContent = message;

    row.appendChild(cell);

    body.appendChild(row);

}

function renderAppointments() {

    const body = document.getElementById("dcAppointmentRows");

    if (DEMO_APPOINTMENTS.length === 0) {
        renderEmpty("dcAppointmentRows", 6, "No appointments are scheduled for today.");
        return;
    }

    DEMO_APPOINTMENTS.forEach(item => {

        const row = document.createElement("tr");

        row.appendChild(createCell(item.time));
        row.appendChild(createPatientCell(item.name));
        row.appendChild(createCell(item.age + " years"));
        row.appendChild(createCell(item.gender));
        row.appendChild(createStatusCell(item.status));
        row.appendChild(createCell(item.compliance));

        body.appendChild(row);

    });

}

function renderPatients() {

    const body = document.getElementById("dcPatientRows");

    if (DEMO_APPOINTMENTS.length === 0) {
        renderEmpty("dcPatientRows", 4, "No patients to show yet.");
        return;
    }

    DEMO_APPOINTMENTS.forEach(item => {

        const row = document.createElement("tr");

        row.appendChild(createPatientCell(item.name));
        row.appendChild(createCell(item.age + " years"));
        row.appendChild(createCell(item.gender));
        row.appendChild(createCell(item.compliance));

        body.appendChild(row);

    });

}

function renderReferrals() {

    const body = document.getElementById("dcReferralRows");

    if (DEMO_REFERRALS.length === 0) {
        renderEmpty("dcReferralRows", 4, "No referrals to show. Referral data is not connected yet.");
        return;
    }

    DEMO_REFERRALS.forEach(item => {

        const row = document.createElement("tr");

        row.appendChild(createPatientCell(item.patient));
        row.appendChild(createCell(item.receivingDoctor || "---"));
        row.appendChild(createCell(item.department || "---"));
        row.appendChild(createStatusCell(item.status));

        body.appendChild(row);

    });

}

function renderInpatients() {

    const body = document.getElementById("dcInpatientRows");

    if (DEMO_INPATIENTS.length === 0) {
        renderEmpty("dcInpatientRows", 4, "No in-patients to show. In-patient data is not connected yet.");
        return;
    }

    DEMO_INPATIENTS.forEach(item => {

        const row = document.createElement("tr");

        row.appendChild(createPatientCell(item.patient));
        row.appendChild(createCell(item.room || "---"));
        row.appendChild(createCell(item.admittedOn || "---"));
        row.appendChild(createStatusCell(item.status));

        body.appendChild(row);

    });

}

function renderStats() {

    const waiting = DEMO_APPOINTMENTS.filter(item => item.status === "Waiting").length;

    const completed = DEMO_APPOINTMENTS.filter(item => item.status === "Completed").length;

    const pendingReferrals = DEMO_REFERRALS.filter(item => item.status === "Pending").length;

    document.getElementById("dcStatAppointments").textContent = DEMO_APPOINTMENTS.length;

    document.getElementById("dcStatWaiting").textContent = waiting;

    document.getElementById("dcStatCompleted").textContent = completed;

    document.getElementById("dcStatReferrals").textContent = pendingReferrals;

}

function setupTabs() {

    const tabs = document.querySelectorAll("#dcTabs .nav-item");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const target = tab.dataset.tab;

            tabs.forEach(item => item.classList.toggle("active", item === tab));

            document.querySelectorAll(".dc-tab-panel").forEach(panel => {
                panel.hidden = panel.id !== "panel-" + target;
            });

            document.getElementById("dcPanelTitle").textContent = TAB_TITLES[target];

            hideNotice();

        });

    });

}

function showNotice(message) {

    const notice = document.getElementById("dcNotice");

    notice.textContent = message;

    notice.hidden = false;

}

function hideNotice() {

    document.getElementById("dcNotice").hidden = true;

}

function setupProfileMenu() {

    const toggle = document.getElementById("dcProfileToggle");

    const dropdown = document.getElementById("dcProfileDropdown");

    function closeMenu() {

        dropdown.classList.remove("show");

        toggle.setAttribute("aria-expanded", "false");

    }

    toggle.addEventListener("click", event => {

        event.stopPropagation();

        const open = dropdown.classList.toggle("show");

        toggle.setAttribute("aria-expanded", String(open));

    });

    document.addEventListener("click", event => {

        if (!dropdown.contains(event.target)) {
            closeMenu();
        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });

    document.getElementById("dcProfileOpen").addEventListener("click", () => {

        closeMenu();

        openModal("dcProfileModal");

    });

    document.getElementById("dcLogoutOpen").addEventListener("click", () => {

        closeMenu();

        openModal("dcLogoutModal");

    });

}

function openModal(id) {

    document.getElementById(id).classList.add("show");

}

function closeModal(id) {

    document.getElementById(id).classList.remove("show");

}

function setupModals() {

    document.querySelectorAll("[data-close]").forEach(button => {

        button.addEventListener("click", () => closeModal(button.dataset.close));

    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                overlay.classList.remove("show");
            }

        });

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            document.querySelectorAll(".modal-overlay.show").forEach(overlay => overlay.classList.remove("show"));
        }

    });

    document.getElementById("dcLogoutConfirm").addEventListener("click", () => HHAuth.logout());

}
