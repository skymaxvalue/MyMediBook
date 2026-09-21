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
    setupHospitalModal();
    restoreSavedHospital();
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
    const routes = {
        "appointments": "dashboard.html",
        "specialities": "specialities.html",
        "medicine": "medicine-orders.html",
        "lab-results": "lab-results.html",
        "billing": "billing.html",
        "messages": "messages.html",
        "settings": "settings.html"
    };

    document.querySelectorAll(".nav-item").forEach(item => {
        item.onclick = () => {

            const nav = document.getElementById("navbar");
            const btn = document.getElementById("mobileMenuBtn");

            nav?.classList.remove("show");
            if (btn) btn.textContent = "☰";

            const page = item.getAttribute("data-page");
            const target = routes[page];
            if (!target) return;

            document.body.classList.add("page-exit");

            setTimeout(() => {
                window.location.href = target;
            }, 120);
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



// ============ Select Hospital modal ============

let pendingHospital = null;

function openHospitalModal() {
    document.getElementById("hospitalModal")?.classList.add("show");
}

function closeHospitalModal() {
    document.getElementById("hospitalModal")?.classList.remove("show");
}

function setupHospitalModal() {

    const hospitalModalEl = document.getElementById("hospitalModal");
    if (!hospitalModalEl) return;

    hospitalModalEl.addEventListener("click", function (e) {
        if (e.target === this) {
            closeHospitalModal();
        }
    });

    const hospitalOptions = hospitalModalEl.querySelectorAll(".hospital-option:not(.no-results)");

    hospitalOptions.forEach(option => {

        option.onclick = () => {

            hospitalOptions.forEach(o => {
                o.classList.remove("selected");
                o.querySelector(".hospital-radio").classList.remove("checked");
            });

            option.classList.add("selected");
            option.querySelector(".hospital-radio").classList.add("checked");

            pendingHospital = {
                name: option.dataset.name,
                location: option.dataset.location
            };

        };

    });

    const hospitalSearchInput = document.getElementById("hospitalSearch");
    const noHospitalResults = document.getElementById("noHospitalResults");

    if (!hospitalSearchInput || !noHospitalResults) return;

    hospitalSearchInput.addEventListener("keyup", () => {

        const value = hospitalSearchInput.value.toLowerCase();
        let visibleCount = 0;

        hospitalOptions.forEach(option => {

            const matches =
                option.dataset.name.toLowerCase().includes(value) ||
                option.dataset.location.toLowerCase().includes(value);

            option.style.display = matches ? "flex" : "none";

            if (matches) visibleCount++;

        });

        noHospitalResults.style.display = visibleCount === 0 ? "block" : "none";

    });

}

function confirmSwitchHospital() {

    if (pendingHospital) {

        applyHospital(pendingHospital);

        localStorage.setItem("currentHospital", JSON.stringify(pendingHospital));

    }

    closeHospitalModal();

}

function applyHospital(hospital) {

    const nameEl = document.getElementById("currentHospitalName");
    const locationEl = document.getElementById("currentHospitalLocation");
    const headerNameEl = document.getElementById("headerHospitalName");

    if (nameEl) nameEl.innerText = hospital.name;
    if (locationEl) locationEl.innerText = hospital.location;
    if (headerNameEl) headerNameEl.innerText = hospital.name.toUpperCase();

    const hospitalOptions = document.querySelectorAll("#hospitalList .hospital-option:not(.no-results)");

    hospitalOptions.forEach(option => {

        const isMatch = option.dataset.name === hospital.name;
        const radio = option.querySelector(".hospital-radio");

        option.classList.toggle("selected", isMatch);
        if (radio) radio.classList.toggle("checked", isMatch);

        let badge = option.querySelector(".current-badge");

        if (isMatch && !badge) {
            badge = document.createElement("span");
            badge.className = "current-badge";
            badge.innerText = "Current";
            option.insertBefore(badge, radio);
        } else if (!isMatch && badge) {
            badge.remove();
        }

    });

    pendingHospital = hospital;

}

function restoreSavedHospital() {

    const saved = localStorage.getItem("currentHospital");
    if (!saved) return;

    try {
        applyHospital(JSON.parse(saved));
    } catch (e) {
        console.error("Failed to restore saved hospital:", e);
    }

}
