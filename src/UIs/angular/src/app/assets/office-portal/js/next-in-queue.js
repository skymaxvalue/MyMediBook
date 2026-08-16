document.addEventListener("DOMContentLoaded", () => {
    const doctorSearch = document.getElementById("doctorSearch");
    const doctorDropdownButton = document.getElementById("doctorDropdownButton");
    const doctorDropdown = document.getElementById("doctorDropdown");
    const selectedDoctorBox = document.getElementById("selectedDoctor");
    const selectedDoctorName = document.getElementById("selectedDoctorName");
    const validationMessage = document.getElementById("validationMessage");
    const viewQueueButton = document.getElementById("viewQueueButton");
    const clearButton = document.getElementById("clearButton");

    let selectedDoctor = null;

    const doctors = getDoctors();

    function getAppointments() {
        try {
            const storedAppointments = localStorage.getItem("myMediBookAppointments");

            if (!storedAppointments) {
                return [];
            }

            const appointments = JSON.parse(storedAppointments);

            return Array.isArray(appointments) ? appointments : [];
        } catch (error) {
            return [];
        }
    }

    function getDoctors() {
        const appointments = getAppointments();

        const doctorMap = new Map();

        appointments.forEach(appointment => {
            if (!appointment.doctor) {
                return;
            }

            const doctorName = appointment.doctor.trim();

            if (!doctorName) {
                return;
            }

            if (!doctorMap.has(doctorName)) {
                doctorMap.set(doctorName, {
                    name: doctorName,
                    department: appointment.department || "",
                    room: appointment.room || ""
                });
            }
        });

        return Array.from(doctorMap.values());
    }

    function renderDoctors(searchTerm = "") {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const filteredDoctors = doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(normalizedSearch)
        );

        doctorDropdown.innerHTML = "";

        if (filteredDoctors.length === 0) {
            doctorDropdown.innerHTML = `
                <div class="no-doctors">
                    No doctors found
                </div>
            `;

            return;
        }

        filteredDoctors.forEach(doctor => {
            const option = document.createElement("div");

            option.className = "doctor-option";

            option.innerHTML = `
                <strong>${escapeHtml(doctor.name)}</strong>
                ${
                    doctor.department
                        ? `<span>${escapeHtml(doctor.department)}</span>`
                        : ""
                }
            `;

            option.addEventListener("click", () => {
                selectDoctor(doctor);
            });

            doctorDropdown.appendChild(option);
        });
    }

    function selectDoctor(doctor) {
        selectedDoctor = doctor;

        doctorSearch.value = doctor.name;

        selectedDoctorName.textContent = doctor.name;

        selectedDoctorBox.classList.remove("hidden");
        validationMessage.classList.add("hidden");
        doctorDropdown.classList.remove("active");
    }

    function clearSelection() {
        selectedDoctor = null;

        doctorSearch.value = "";

        selectedDoctorName.textContent = "";

        selectedDoctorBox.classList.add("hidden");
        validationMessage.classList.add("hidden");
        doctorDropdown.classList.remove("active");

        doctorSearch.focus();
    }

    doctorSearch.addEventListener("focus", () => {
        renderDoctors(doctorSearch.value);
        doctorDropdown.classList.add("active");
    });

    doctorSearch.addEventListener("input", () => {
        selectedDoctor = null;
        selectedDoctorBox.classList.add("hidden");
        validationMessage.classList.add("hidden");

        renderDoctors(doctorSearch.value);
        doctorDropdown.classList.add("active");
    });

    doctorDropdownButton.addEventListener("click", () => {
        if (doctorDropdown.classList.contains("active")) {
            doctorDropdown.classList.remove("active");
            return;
        }

        renderDoctors(doctorSearch.value);
        doctorDropdown.classList.add("active");
        doctorSearch.focus();
    });

    clearButton.addEventListener("click", () => {
        clearSelection();
    });

    viewQueueButton.addEventListener("click", () => {
        if (!selectedDoctor) {
            validationMessage.textContent = "Please select a doctor to continue.";
            validationMessage.classList.remove("hidden");
            doctorSearch.focus();
            return;
        }

        localStorage.setItem(
            "selectedDoctor",
            JSON.stringify({
                name: selectedDoctor.name,
                department: selectedDoctor.department || "",
                room: selectedDoctor.room || ""
            })
        );

        window.location.href = "doctor-queue.html";
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".doctor-select-wrapper")) {
            doctorDropdown.classList.remove("active");
        }
    });

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    renderDoctors();
});