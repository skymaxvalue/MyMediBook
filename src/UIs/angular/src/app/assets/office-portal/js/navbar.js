document.addEventListener("DOMContentLoaded", () => {

    const navbarContainer = document.getElementById("navbar-container");

    if (!navbarContainer) return;

    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {

            navbarContainer.innerHTML = data;

            initializeNavbar();

        })
        .catch(error => console.error("Error loading navbar:", error));

});


function initializeNavbar() {

    updateDate();

    updateTime();

    setInterval(updateTime, 1000);

    setupProfileDropdown();

    setupNavigation();

    loadUser();
    setupProfileActions();

}



function updateDate() {

    const dateElement = document.getElementById("currentDate");

    if (!dateElement) return;

    const options = {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    };

    dateElement.textContent =
        new Date().toLocaleDateString("en-IN", options);

}

function updateTime() {

    const timeElement = document.getElementById("currentTime");

    if (!timeElement) return;

    const options = {

        hour: "2-digit",
        minute: "2-digit",
        
        hour12: true

    };

    timeElement.textContent =
        new Date().toLocaleTimeString("en-IN", options);

}

function loadUser() {

    const username = document.getElementById("username");

    if (!username) return;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user && user.name) {

        username.textContent = user.name;

    } else {

        username.textContent = "Front Office";

    }

}


function setupProfileDropdown() {

    const profile = document.getElementById("userProfile");

    const toggle = document.getElementById("profileToggle");

    const dropdown = document.getElementById("profileDropdown");

    if (!profile || !toggle || !dropdown) return;

    toggle.addEventListener("click", function (e) {

        e.stopPropagation();

        dropdown.classList.toggle("show");

    });

    document.addEventListener("click", function () {

        dropdown.classList.remove("show");

    });

    dropdown.addEventListener("click", function (e) {

        e.stopPropagation();

    });

}


function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");

    /* Set active item based on current page */
    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

    navItems.forEach(item => {

        const page =
            item.dataset.page;

        if (page === currentPage) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }


        /* Navigation */
        item.addEventListener("click", function () {

            const page =
                this.dataset.page;

            navigate(page);

        });

    });

}

function navigate(page) {

    switch (page) {

        case "dashboard":
            window.location.href = "dashboard.html";
            break;

        case "patient-registration":
            window.location.href = "patient-registration.html";
            break;

        case "book-appointment":
            window.location.href = "book-appointment.html";
            break;

        case "patient-checkin":
            window.location.href = "patient-checkin.html";
            break;

        case "lab-service":
            window.location.href = "lab-service.html";
            break;

        case "insurance":
            window.location.href = "insurance-billing.html";
            break;

        case "queue":
            window.location.href = "queue-management.html";
            break;

        case "doctor-schedule":
            window.location.href = "doctor-schedule.html";
            break;

        case "reports":
            window.location.href = "reports.html";
            break;

        case "settings":
            window.location.href = "settings.html";
            break;

    }

}


function setupProfileActions() {
    const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");
const closeLogoutModal = document.getElementById("closeLogoutModal");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        document.getElementById("profileDropdown").classList.remove("show");
        logoutModal.classList.add("show");
    });
}

cancelLogout.onclick = () => logoutModal.classList.remove("show");
closeLogoutModal.onclick = () => logoutModal.classList.remove("show");

confirmLogout.onclick = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
};

logoutModal.addEventListener("click", (e) => {
    if (e.target === logoutModal) {
        logoutModal.classList.remove("show");
    }
});
}