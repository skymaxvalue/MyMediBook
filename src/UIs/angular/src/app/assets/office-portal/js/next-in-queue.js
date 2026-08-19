document.addEventListener("DOMContentLoaded", function () {
    const doctorInput = document.getElementById("doctorSearch");
    const dropdownButton = document.getElementById("doctorDropdownButton");
    const doctorDropdown = document.getElementById("doctorDropdown");
    const doctorOptions = document.querySelectorAll(".doctor-option");
    const viewQueueButton = document.getElementById("viewQueueButton");
    const clearButton = document.getElementById("clearButton");

    let selectedDoctor = "";

    function openDropdown() {
        doctorDropdown.classList.add("active");
        doctorInput.setAttribute("aria-expanded", "true");
    }

    function closeDropdown() {
        doctorDropdown.classList.remove("active");
        doctorInput.setAttribute("aria-expanded", "false");
    }

    function toggleDropdown() {
        if (doctorDropdown.classList.contains("active")) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    doctorInput.addEventListener("click", function () {
        toggleDropdown();
    });

    dropdownButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown();
    });

    doctorOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            selectedDoctor =
                this.dataset.doctor || this.textContent.trim();

            doctorInput.value = selectedDoctor;

            doctorOptions.forEach(function (item) {
                item.classList.remove("selected");
                item.setAttribute("aria-selected", "false");
            });

            this.classList.add("selected");
            this.setAttribute("aria-selected", "true");

            closeDropdown();
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".doctor-select-wrapper")) {
            closeDropdown();
        }
    });

    viewQueueButton.addEventListener("click", function () {
        if (!selectedDoctor) {
            openDropdown();
            return;
        }

        localStorage.setItem(
            "selectedQueueDoctor",
            selectedDoctor
        );

        window.location.href = "doctor-queue.html";
    });

    clearButton.addEventListener("click", function () {
        selectedDoctor = "";
        doctorInput.value = "";

        doctorOptions.forEach(function (option) {
            option.classList.remove("selected");
            option.setAttribute("aria-selected", "false");
        });

        localStorage.removeItem("selectedQueueDoctor");

        closeDropdown();
    });

    const savedDoctor =
        localStorage.getItem("selectedQueueDoctor");

    if (savedDoctor) {
        const matchingOption = Array.from(doctorOptions).find(
            function (option) {
                return (
                    (option.dataset.doctor ||
                        option.textContent.trim()) === savedDoctor
                );
            }
        );

        if (matchingOption) {
            selectedDoctor = savedDoctor;
            doctorInput.value = savedDoctor;

            matchingOption.classList.add("selected");
            matchingOption.setAttribute("aria-selected", "true");
        }
    }

    const queueNavbarObserver = new MutationObserver(function () {
        const queueItem = document.querySelector(
            '.nav-item[data-page="queue"]'
        );

        if (!queueItem) {
            return;
        }

        document.querySelectorAll(".nav-item").forEach(function (item) {
            item.classList.remove("active");
        });

        queueItem.classList.add("active");
        queueNavbarObserver.disconnect();
    });

    const queueNavbarContainer =
        document.getElementById("navbar-container");

    if (queueNavbarContainer) {
        queueNavbarObserver.observe(queueNavbarContainer, {
            childList: true,
            subtree: true
        });
    }
});