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

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", function () {

            navItems.forEach(nav => {

                nav.classList.remove("active");

            });

            this.classList.add("active");

            const page = this.dataset.page;

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


const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {

    profileBtn.addEventListener("click", () => {

        window.location.href = "profile.html";

    });

}


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        if (confirm("Are you sure you want to logout?")) {

            localStorage.removeItem("loggedInUser");

            localStorage.removeItem("isLoggedIn");

            window.location.href = "login.html";

        }

    });

}