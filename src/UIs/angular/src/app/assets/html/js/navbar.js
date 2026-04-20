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
        (day % 10 === 3 && day !== 13) ? "rd" : "th";

    const month = today.toLocaleString("en-US", { month: "short" });
    const year = today.getFullYear();

    el.innerText = `${month} ${day}${suffix} ${year}`;
}

function setupNavbar() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.onclick = () => {
            const page = item.getAttribute("data-page");

            if (page === "appointments") location.href = "dashboard.html";
            if (page === "specialities") location.href = "specialities.html";
            if (page === "medicine") alert("Coming soon");
            if (page === "support") alert("Coming soon");
        };
    });
}

function setActiveTab() {
    const file = window.location.pathname.split("/").pop();

    const map = {
        "dashboard.html": "appointments",
        "specialities.html": "specialities",
        "availability.html": "specialities",
        "booking.html": "specialities"
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