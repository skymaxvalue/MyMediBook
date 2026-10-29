function getInitials(name) {

    const words = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/).filter(Boolean);

    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join("");

}

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

function updateClock(onTick) {

    const now = new Date();

    document.getElementById("dcHeaderDate").textContent =
        now.toLocaleDateString("en-US", { weekday: "long" }) + ", " +
        now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    document.getElementById("dcHeaderTime").textContent =
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase();

    if (onTick) {
        onTick();
    }

}

function startClock(onTick) {

    updateClock(onTick);

    setInterval(() => updateClock(onTick), 1000);

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
