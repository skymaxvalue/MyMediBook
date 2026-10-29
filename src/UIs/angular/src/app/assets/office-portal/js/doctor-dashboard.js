const DEMO_INPATIENTS = [];

const TAB_TITLES = {
    appointments: "APPOINTMENT LIST",
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

const PAGE_SIZE = 10;

const ICON_CHEVRON_LEFT = '<img src="/images/arrow-left.png" alt="">';

const ICON_CHEVRON_RIGHT = '<img src="/images/arrow-right.png" alt="">';

let selectedDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

let searchTerm = "";

let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("dcTabs")) {
        document.addEventListener("doctorNavbarReady", initializeDoctorDashboard, { once: true });
        return;
    }

    initializeDoctorDashboard();

});

function initializeDoctorDashboard() {

    const session = HHAuth.requireRole("doctor");

    if (!session) {
        return;
    }

    document.body.classList.remove("auth-pending");

    fillUser(session);

    startClock(renderDateBanner);

    renderAppointments();

    renderReferrals();

    renderInpatients();

    renderStats();

    setupTabs();

    openRequestedTab();

    setupAppointmentControls();

    setupProfileMenu();

    setupModals();

}

function renderDateBanner() {

    const date = selectedDate;
    document.getElementById("dcDateBanner").textContent =
        String(date.getDate()).padStart(2, "0") + "-" +
        MONTHS[date.getMonth()] + "-" +
        date.getFullYear() +
        " (" + WEEKDAYS[date.getDay()] + ")";

    const picker = document.getElementById("dcDatePicker");
    if (picker) {
        picker.value = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    }

}

function isSelectedDateToday() {
    const today = new Date();
    return selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getDate() === today.getDate();
}

function setSelectedDate(value) {
    if (!value) return;
    const parts = value.split("-").map(Number);
    selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    currentPage = 1;
    renderDateBanner();
    renderAppointments();
}

function createCell(text) {

    const cell = document.createElement("td");

    cell.textContent = text;

    return cell;

}

function createPatientCell(name) {

    const cell = document.createElement("td");

    const link = document.createElement("a");

    link.href = "doctor-patient.html?patient=" + encodeURIComponent(name);

    link.className = "dc-patient-link";

    link.textContent = name;

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

function getVisibleAppointments() {

    if (!isSelectedDateToday()) {
        return [];
    }

    const term = searchTerm.trim().toLowerCase();

    return DEMO_APPOINTMENTS.filter(item => item.name.toLowerCase().includes(term));

}

function getEmptyMessage() {

    if (!isSelectedDateToday()) {
        return "No appointments are scheduled for this date.";
    }

    if (DEMO_APPOINTMENTS.length > 0) {
        return "No patients match your search.";
    }

    return "No appointments are scheduled for today.";

}

function renderAppointments() {

    const body = document.getElementById("dcAppointmentRows");

    body.replaceChildren();

    const items = getVisibleAppointments();

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;

    const pageItems = items.slice(start, start + PAGE_SIZE);

    if (pageItems.length === 0) {
        renderEmpty("dcAppointmentRows", 6, getEmptyMessage());
    }

    pageItems.forEach(item => {

        const row = document.createElement("tr");

        row.appendChild(createCell(item.time));
        row.appendChild(createPatientCell(item.name));
        row.appendChild(createCell(item.age + " years"));
        row.appendChild(createCell(item.gender));
        row.appendChild(createStatusCell(item.status));
        row.appendChild(createCell(item.compliance));

        body.appendChild(row);

    });

    renderRecordCount(items.length, start, pageItems.length);

    renderPager(totalPages);

}

function renderRecordCount(total, start, shown) {

    const label = total === 0
        ? "Showing 0 to 0 of 0 records"
        : "Showing " + (start + 1) + " to " + (start + shown) + " of " + total + " records";

    document.getElementById("dcRecordCount").textContent = label;

}

function createPagerButton(label, disabled, onClick) {

    const button = document.createElement("button");

    button.type = "button";

    button.className = "dc-page-btn";

    button.setAttribute("aria-label", label);

    button.disabled = disabled;

    button.addEventListener("click", onClick);

    return button;

}

function renderPager(totalPages) {

    const pager = document.getElementById("dcPager");

    pager.replaceChildren();

    const previous = createPagerButton("Previous page", currentPage === 1, () => goToPage(currentPage - 1));

    previous.innerHTML = ICON_CHEVRON_LEFT;

    pager.appendChild(previous);

    for (let page = 1; page <= totalPages; page++) {

        const button = createPagerButton("Page " + page, false, () => goToPage(page));

        button.textContent = page;

        if (page === currentPage) {

            button.classList.add("active");

            button.setAttribute("aria-current", "page");

        }

        pager.appendChild(button);

    }

    const next = createPagerButton("Next page", currentPage === totalPages, () => goToPage(currentPage + 1));

    next.innerHTML = ICON_CHEVRON_RIGHT;

    pager.appendChild(next);

}

function goToPage(page) {

    currentPage = page;

    renderAppointments();

}

function shiftDate(days) {

    selectedDate.setDate(selectedDate.getDate() + days);
    currentPage = 1;
    renderDateBanner();
    renderAppointments();

}

function setupAppointmentControls() {

    const searchInput = document.getElementById("dcSearch");

    searchInput.addEventListener("input", () => {

        searchTerm = searchInput.value;

        currentPage = 1;

        renderAppointments();

    });

    document.getElementById("dcSearchBtn").addEventListener("click", () => searchInput.focus());

    document.getElementById("dcDatePrev").addEventListener("click", () => shiftDate(-1));

    document.getElementById("dcDateNext").addEventListener("click", () => shiftDate(1));

    const picker = document.getElementById("dcDatePicker");
    const calendarTrigger = document.getElementById("dcCalendarTrigger");
    calendarTrigger.addEventListener("click", () => {
        if (typeof picker.showPicker === "function") picker.showPicker();
        else picker.click();
    });
    picker.addEventListener("change", () => setSelectedDate(picker.value));
    renderDateBanner();

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

function activateTab(target) {

    document.querySelectorAll("#dcTabs .nav-item").forEach(item => {
        item.classList.toggle("active", item.dataset.tab === target);
    });

    document.querySelectorAll(".dc-tab-panel").forEach(panel => {
        panel.hidden = panel.id !== "panel-" + target;
    });

    document.getElementById("dcPanelTitle").textContent = TAB_TITLES[target];

    hideNotice();

}

function setupTabs() {

    document.querySelectorAll("#dcTabs .nav-item").forEach(tab => {

        tab.addEventListener("click", () => {

            if (tab.dataset.tab === "patients") {
                window.location.href = "doctor-patient.html";
                return;
            }

            activateTab(tab.dataset.tab);

        });

    });

}

function openRequestedTab() {

    const requested = new URLSearchParams(window.location.search).get("tab");

    if (requested && TAB_TITLES[requested]) {
        activateTab(requested);
    }

}

function showNotice(message) {

    const notice = document.getElementById("dcNotice");

    notice.textContent = message;

    notice.hidden = false;

}

function hideNotice() {

    document.getElementById("dcNotice").hidden = true;

}
