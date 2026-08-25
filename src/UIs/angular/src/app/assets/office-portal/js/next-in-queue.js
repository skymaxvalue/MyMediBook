document.addEventListener("DOMContentLoaded", function () {
    const doctorInput = document.getElementById("doctorSearch");
    const dropdownButton = document.getElementById("doctorDropdownButton");
    const doctorDropdown = document.getElementById("doctorDropdown");
    const doctorOptions = Array.from(
        document.querySelectorAll(".doctor-option")
    );
    const noDoctorsMessage = document.getElementById("noDoctorsMessage");
    const viewQueueButton = document.getElementById("viewQueueButton");
    const clearButton = document.getElementById("clearButton");

    const doctorSelectWrapper = document.getElementById(
        "doctorSelectWrapper"
    );
    const doctorSelection = doctorInput.closest(".doctor-selection");
    const doctorPreview = document.getElementById("doctorPreview");
    const doctorPreviewTitle = document.getElementById("doctorPreviewTitle");
    const doctorPreviewText = document.getElementById("doctorPreviewText");

    const DEFAULT_PREVIEW_TITLE = "No doctor selected";
    const DEFAULT_PREVIEW_TEXT =
        "Please select a doctor from the list to view their patient queue.";

    let selectedDoctor = "";

    function openDropdown() {
        doctorDropdown.classList.add("active");
        doctorInput.setAttribute("aria-expanded", "true");
    }

    function closeDropdown() {
        doctorDropdown.classList.remove("active");
        doctorInput.setAttribute("aria-expanded", "false");
    }

    function optionName(option) {
        return (option.dataset.doctor || option.textContent)
            .trim()
            .toLowerCase();
    }

    // Show every option again and hide the "no matches" message —
    // used whenever the search term is cleared or a pick is made.
    function resetOptionsVisibility() {
        doctorOptions.forEach(function (option) {
            option.style.display = "";
        });

        if (noDoctorsMessage) {
            noDoctorsMessage.style.display = "none";
        }
    }

    // Filters the dropdown list in place as the user types.
    function filterDoctors(query) {
        const term = query.trim().toLowerCase();
        let visibleCount = 0;

        doctorOptions.forEach(function (option) {
            const isMatch = term === "" || optionName(option).includes(term);
            option.style.display = isMatch ? "" : "none";

            if (isMatch) {
                visibleCount += 1;
            }
        });

        if (noDoctorsMessage) {
            noDoctorsMessage.style.display =
                visibleCount === 0 ? "flex" : "none";
        }
    }

    // Single source of truth for everything that depends on whether a
    // doctor is currently selected: the red required/invalid state,
    // the preview panel on the right, and the View Queue button.
    function syncSelectionUI() {
        const hasSelection = Boolean(selectedDoctor);

        doctorSelectWrapper.classList.toggle("invalid", !hasSelection);

        if (doctorSelection) {
            doctorSelection.classList.toggle("has-error", !hasSelection);
        }

        if (doctorPreview) {
            doctorPreview.classList.toggle("has-doctor", hasSelection);
        }

        if (doctorPreviewTitle && doctorPreviewText) {
            if (hasSelection) {
                doctorPreviewTitle.textContent = selectedDoctor;
                doctorPreviewText.textContent =
                    "Ready to view " +
                    selectedDoctor +
                    "'s appointment queue.";
            } else {
                doctorPreviewTitle.textContent = DEFAULT_PREVIEW_TITLE;
                doctorPreviewText.textContent = DEFAULT_PREVIEW_TEXT;
            }
        }

        viewQueueButton.disabled = !hasSelection;
    }

    function clearSelection() {
        selectedDoctor = "";

        doctorOptions.forEach(function (option) {
            option.classList.remove("selected");
            option.setAttribute("aria-selected", "false");
        });

        syncSelectionUI();
    }

    // Clicking the field opens the list (showing whatever the
    // current search term already matches).
    doctorInput.addEventListener("click", function () {
        openDropdown();
    });

    // Live filter as the user types. Typing something that no
    // longer matches the previously selected doctor clears that
    // selection, since the field is now being used to search again.
    doctorInput.addEventListener("input", function () {
        if (this.value.trim() !== selectedDoctor) {
            clearSelection();
        }

        filterDoctors(this.value);
        openDropdown();
    });

    // The chevron button always browses the full list, ignoring
    // whatever partial search term is currently typed.
    dropdownButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (doctorDropdown.classList.contains("active")) {
            closeDropdown();
        } else {
            resetOptionsVisibility();
            openDropdown();
        }
    });

    doctorOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            selectedDoctor = this.dataset.doctor || this.textContent.trim();

            doctorInput.value = selectedDoctor;

            doctorOptions.forEach(function (item) {
                item.classList.remove("selected");
                item.setAttribute("aria-selected", "false");
            });

            this.classList.add("selected");
            this.setAttribute("aria-selected", "true");

            resetOptionsVisibility();
            closeDropdown();
            syncSelectionUI();
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".doctor-select-wrapper")) {
            closeDropdown();
        }
    });

    viewQueueButton.addEventListener("click", function () {
        if (!selectedDoctor) {
            syncSelectionUI();
            doctorInput.focus();
            return;
        }

        localStorage.setItem("selectedQueueDoctor", selectedDoctor);

        window.location.href = "doctor-queue.html";
    });

    clearButton.addEventListener("click", function () {
        clearSelection();
        doctorInput.value = "";

        resetOptionsVisibility();
        localStorage.removeItem("selectedQueueDoctor");

        closeDropdown();
    });

    resetOptionsVisibility();

    const savedDoctor = localStorage.getItem("selectedQueueDoctor");

    if (savedDoctor) {
        const matchingOption = doctorOptions.find(function (option) {
            return optionName(option) === savedDoctor.trim().toLowerCase();
        });

        if (matchingOption) {
            selectedDoctor = savedDoctor;
            doctorInput.value = savedDoctor;

            matchingOption.classList.add("selected");
            matchingOption.setAttribute("aria-selected", "true");
        }
    }

    // Establish the correct validation / preview / button state on
    // load, whether or not a doctor was restored from localStorage.
    syncSelectionUI();
});
