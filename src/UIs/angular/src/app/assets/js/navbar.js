const navbarContainer = document.getElementById("navbar-container");

if (navbarContainer) {
    fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
        navbarContainer.innerHTML = data;
        initNavbar();
    })
    .catch(error => {
        console.error("Failed to load navbar:", error);
    });
}

function initNavbar() {
    setUsername();
    setDate();
    setupNavbar();
    setActiveTab();
    setupDropdown();
    setupMobileMenu();
}

function setUsername() {
    const user = localStorage.getItem("username");
    const el = document.getElementById("username");

    if (el) el.innerText = user || "User Name";
}

function setDate() {
    const el = document.getElementById("current-date");
    if (!el) return;

    const today = new Date();

    const day = today.getDate();

    const suffix =
        (day % 10 === 1 && day !== 11) ? "st" :
        (day % 10 === 2 && day !== 12) ? "nd" :
        (day % 10 === 3 && day !== 13) ? "rd" :
        "th";

    const month = today.toLocaleString("en-US", {
        month: "short"
    });

    const year = today.getFullYear();

    const weekday = today.toLocaleString("en-US", {
        weekday: "long"
    });

    el.innerText =
        `${month} ${day}${suffix} ${year} | ${weekday}`;
}

function setupNavbar() {
    document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = () => {

        const nav = document.getElementById("navbar");
        const btn = document.getElementById("mobileMenuBtn");

        nav?.classList.remove("show");

        if (btn) {
            btn.textContent = "☰";
        }

        const page = item.getAttribute("data-page");

        if (page === "appointments")
            location.href = "dashboard.html";

        if (page === "specialities")
            location.href = "specialities.html";

        if (page === "medicine")
            location.href = "medicine-orders.html";

        if (page === "lab-results")
            location.href = "lab-results.html";

        if (page === "billing")
            location.href = "billing.html";

        if (page === "messages")
            location.href = "messages.html";

        if (page === "settings")
            location.href = "settings.html";
    };
});
}

function setActiveTab() {
    const file = window.location.pathname.split("/").pop();

const map = {
    "dashboard.html": "appointments",
    "specialities.html": "specialities",
    "availability.html": "specialities",
    "booking.html": "specialities",
    "otp-verification.html": "specialities",
    "success.html": "specialities",
        "failed.html": "specialities",

        "medicine-orders.html": "medicine",

        "lab-results.html": "lab-results",

        "billing.html": "billing",

        "messages.html": "messages",

        "settings.html": "settings"
};

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    const activeKey = map[file];
    if (!activeKey) return;

    document.querySelector(`[data-page="${activeKey}"]`)?.classList.add("active");
}

function setupDropdown() {
    const dropdownToggle = document.getElementById("profileToggle");
    const dropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!dropdownToggle || !dropdown || !logoutBtn) return;

    dropdownToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });

    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", () => {
        dropdown.classList.remove("show");
    });

    logoutBtn.onclick = logout;
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}


function setupMobileMenu() {

    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("navbar");

    if (!btn || !nav) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    nav.classList.toggle("show");

    btn.textContent =
        nav.classList.contains("show")
            ? "✕"
            : "☰";
});
    nav.addEventListener("click", (e) => {
        e.stopPropagation();
    });

   document.addEventListener("click", () => {
    nav.classList.remove("show");
    btn.textContent = "☰";
});

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            nav.classList.remove("show");
        }
    });
}

