document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const queueDate = document.getElementById("queueDate");
    const queueDateInput = document.getElementById("queueDateInput");
    const queueTableBody = document.getElementById("queueTableBody");

    const appointmentCount = document.getElementById("appointmentCount");

    const confirmModal = document.getElementById("queueConfirmModal");
    const confirmClose = document.getElementById("queueConfirmClose");
    const confirmCancel = document.getElementById("queueCancelBtn");
    const confirmButton = document.getElementById("queueConfirmBtn");
    const confirmDetails = document.getElementById("queueConfirmDetails");

    const successModal = document.getElementById("queueSuccessModal");
    const successDetails = document.getElementById("queueSuccessDetails");
    const successViewQueue = document.getElementById("successViewQueueBtn");
    const successDone = document.getElementById("successDoneBtn");

    const backToSearchBtn = document.getElementById("backToSearchBtn");

    /* =========================================================
       CONFIGURATION
       ========================================================= */

    const STORAGE_KEY = "myMediBookDoctorQueue";

    const DOCTOR = {
        name: getText("doctorName") || "Dr. Kumaravel",
        department: getText("doctorDepartment") || "General Physician",
        room: getText("doctorRoom") || "#5, 2nd Floor"
    };

    let selectedPatient = null;

    /*
     * The current HTML contains the queue for:
     * 10-Apr-2025
     *
     * We use the HTML as the initial source of truth.
     */
    const DEFAULT_DATE = queueDateInput?.value || "2025-04-10";

    /* =========================================================
       INITIALIZATION
       ========================================================= */

    initializeQueue();

    function initializeQueue() {

        if (!queueDateInput || !queueTableBody) {
            console.error("Doctor queue elements could not be found.");
            return;
        }

        if (!queueDateInput.value) {
            queueDateInput.value = DEFAULT_DATE;
        }

        updateDateLabel(queueDateInput.value);

        /*
         * Save the original HTML queue data if this date
         * has never been stored before.
         */
        initializeStoredQueue(queueDateInput.value);

        loadQueue(queueDateInput.value);

        attachEventListeners();
    }

    /* =========================================================
       EVENT LISTENERS
       ========================================================= */

    function attachEventListeners() {

        /* Date picker */
        queueDateInput.addEventListener("change", function () {

            const selectedDate = this.value;

            if (!selectedDate) {
                return;
            }

            updateDateLabel(selectedDate);

            closeAllModals();

            loadQueue(selectedDate);
        });


        /* Status dropdown */
        queueTableBody.addEventListener("change", function (event) {

            if (!event.target.classList.contains("status-select")) {
                return;
            }

            const select = event.target;

            const patientId = select.dataset.id;
            const status = select.value;

            updatePatientStatus(patientId, status);

            updateStatusStyle(select, status);
        });


        /*
         * Checked-in circles.
         *
         * Clicking an unchecked circle opens the confirmation modal.
         */
        queueTableBody.addEventListener("click", function (event) {

            const checkInIndicator = event.target.closest(".checked-in");

            if (!checkInIndicator) {
                return;
            }

            /*
             * Already checked-in patients cannot be checked in again.
             */
            if (checkInIndicator.classList.contains("active")) {
                return;
            }

            const row = checkInIndicator.closest("tr");

            if (!row) {
                return;
            }

            const patient = getPatientFromRow(row);

            if (!patient) {
                return;
            }

            openConfirmModal(patient);
        });


        /* Confirm modal */
        if (confirmButton) {
            confirmButton.addEventListener("click", confirmCheckIn);
        }

        if (confirmCancel) {
            confirmCancel.addEventListener("click", closeConfirmModal);
        }

        if (confirmClose) {
            confirmClose.addEventListener("click", closeConfirmModal);
        }


        /* Success modal */
        if (successDone) {
            successDone.addEventListener("click", function () {
                closeSuccessModal();
            });
        }

        if (successViewQueue) {
            successViewQueue.addEventListener("click", function () {

                closeSuccessModal();

                /*
                 * Scroll to the queue after closing the success modal.
                 */
                const table = document.querySelector(".queue-table-card");

                if (table) {
                    table.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        }


        /* Back to search */
        if (backToSearchBtn) {
            backToSearchBtn.addEventListener("click", function () {
                window.location.href = "patient-checkin.html";
            });
        }


        /* Close modal when clicking outside */
        if (confirmModal) {
            confirmModal.addEventListener("click", function (event) {

                if (event.target === confirmModal) {
                    closeConfirmModal();
                }

            });
        }

        if (successModal) {
            successModal.addEventListener("click", function (event) {

                if (event.target === successModal) {
                    closeSuccessModal();
                }

            });
        }


        /* ESC key */
        document.addEventListener("keydown", function (event) {

            if (event.key !== "Escape") {
                return;
            }

            closeConfirmModal();
            closeSuccessModal();
        });
    }


    /* =========================================================
       DATE
       ========================================================= */

    function updateDateLabel(dateString) {

        if (!queueDate) {
            return;
        }

        const date = new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return;
        }

        const day = String(date.getDate()).padStart(2, "0");

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const weekdayNames = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY"
        ];

        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const weekday = weekdayNames[date.getDay()];

        queueDate.textContent =
            `${day}-${month}-${year} (${weekday})`;
    }


    /* =========================================================
       QUEUE STORAGE
       ========================================================= */

    function getStoredQueue() {

        try {

            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) {
                return {};
            }

            const parsed = JSON.parse(stored);

            return parsed && typeof parsed === "object"
                ? parsed
                : {};

        } catch (error) {

            console.error(
                "Unable to read doctor queue from localStorage:",
                error
            );

            return {};
        }
    }


    function saveStoredQueue(queueData) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(queueData)
            );

        } catch (error) {

            console.error(
                "Unable to save doctor queue:",
                error
            );
        }
    }


    /*
     * Converts the static HTML table into stored queue data
     * the first time the page is opened.
     */
    function initializeStoredQueue(date) {

        const storedQueue = getStoredQueue();

        if (storedQueue[date]) {
            return;
        }

        const patients = readPatientsFromHTML();

        storedQueue[date] = patients;

        saveStoredQueue(storedQueue);
    }


    function readPatientsFromHTML() {

        const rows = queueTableBody.querySelectorAll("tr");

        const patients = [];

        rows.forEach(function (row, index) {

            const cells = row.querySelectorAll("td");

            if (cells.length < 5) {
                return;
            }

            const statusSelect =
                row.querySelector(".status-select");

            const checkInIndicator =
                row.querySelector(".checked-in");

            const patient = {

                id: statusSelect?.dataset.id || String(index + 1),

                name: cells[1].textContent.trim(),

                time: cells[2].textContent.trim(),

                checkedIn:
                    checkInIndicator?.classList.contains("active") || false,

                status:
                    statusSelect?.value || "--",

                /*
                 * Only Edwin's UHID is specified by the
                 * project workflow/design.
                 */
                uhid:
                    cells[1].textContent.trim() === "Edwin Johnson"
                        ? "HH24890"
                        : ""
            };

            patients.push(patient);
        });

        return patients;
    }


    /* =========================================================
       LOAD QUEUE
       ========================================================= */

    function loadQueue(date) {

        const storedQueue = getStoredQueue();

        /*
         * The supplied HTML contains appointment data only
         * for the default date.
         *
         * For another date, show an empty appointment list
         * rather than incorrectly displaying appointments
         * from another date.
         */
        if (!storedQueue[date]) {

            renderEmptyQueue();

            if (appointmentCount) {
                appointmentCount.textContent = "00";
            }

            return;
        }

        const patients = storedQueue[date];

        renderQueue(patients);

        if (appointmentCount) {
            appointmentCount.textContent =
                String(patients.length).padStart(2, "0");
        }
    }


    /* =========================================================
       RENDER QUEUE
       ========================================================= */

    function renderQueue(patients) {

        queueTableBody.innerHTML = "";

        if (!patients.length) {
            renderEmptyQueue();
            return;
        }

        patients.forEach(function (patient, index) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    ${escapeHTML(patient.name)}
                </td>

                <td>
                    ${escapeHTML(patient.time)}
                </td>

                <td>
                    <div
                        class="checked-in ${
                            patient.checkedIn ? "active" : ""
                        }"
                        title="${
                            patient.checkedIn
                                ? "Already checked in"
                                : "Click to check in"
                        }"
                        role="button"
                        tabindex="${
                            patient.checkedIn ? "-1" : "0"
                        }"
                        aria-label="${
                            patient.checkedIn
                                ? "Patient already checked in"
                                : "Check in patient"
                        }"
                    ></div>
                </td>

                <td>
                    ${createStatusSelect(patient)}
                </td>
            `;

            queueTableBody.appendChild(row);
        });

        /*
         * Re-apply status classes after rendering.
         */
        queueTableBody
            .querySelectorAll(".status-select")
            .forEach(function (select) {

                updateStatusStyle(
                    select,
                    select.value
                );
            });
    }


    function createStatusSelect(patient) {

        const statuses = [
            "--",
            "Next in queue",
            "In consultation",
            "Completed"
        ];

        /*
         * Keep the current status as the first option,
         * matching the existing HTML behaviour.
         */
        const orderedStatuses = [
            patient.status,
            ...statuses.filter(function (status) {
                return status !== patient.status;
            })
        ];

        return `
            <select
                class="status-select"
                data-id="${escapeHTML(patient.id)}"
            >
                ${orderedStatuses.map(function (status) {

                    return `
                        <option
                            ${
                                status === patient.status
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${escapeHTML(status)}
                        </option>
                    `;

                }).join("")}
            </select>
        `;
    }


    function renderEmptyQueue() {

        queueTableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px 20px;
                        color:#7788a2;
                    "
                >
                    No appointments found for this date.
                </td>
            </tr>
        `;
    }


    /* =========================================================
       PATIENT DATA
       ========================================================= */

    function getPatientFromRow(row) {

        const cells = row.querySelectorAll("td");

        const statusSelect =
            row.querySelector(".status-select");

        const checkInIndicator =
            row.querySelector(".checked-in");

        if (cells.length < 5) {
            return null;
        }

        return {

            id:
                statusSelect?.dataset.id || "",

            name:
                cells[1].textContent.trim(),

            time:
                cells[2].textContent.trim(),

            checkedIn:
                checkInIndicator?.classList.contains("active") || false,

            status:
                statusSelect?.value || "--",

            uhid:
                cells[1].textContent.trim() === "Edwin Johnson"
                    ? "HH24890"
                    : ""
        };
    }


    /* =========================================================
       CHECK-IN CONFIRMATION
       ========================================================= */

    function openConfirmModal(patient) {

        if (!confirmModal || !confirmDetails) {
            return;
        }

        selectedPatient = patient;

        confirmDetails.innerHTML =
            createPatientDetails(patient, false);

        confirmModal.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    function confirmCheckIn() {

        if (!selectedPatient) {
            return;
        }

        const date = queueDateInput.value;

        const storedQueue = getStoredQueue();

        if (!storedQueue[date]) {
            return;
        }

        const patientIndex = storedQueue[date].findIndex(
            function (patient) {
                return String(patient.id) ===
                    String(selectedPatient.id);
            }
        );

        if (patientIndex === -1) {
            return;
        }

        /*
         * Prevent duplicate check-in.
         */
        if (storedQueue[date][patientIndex].checkedIn) {

            closeConfirmModal();

            return;
        }

        /*
         * Update check-in status.
         */
        storedQueue[date][patientIndex].checkedIn = true;

        /*
         * Newly checked-in patients go to:
         * Next in queue
         */
        storedQueue[date][patientIndex].status =
            "Next in queue";

        saveStoredQueue(storedQueue);

        /*
         * Update selected patient object.
         */
        selectedPatient =
            storedQueue[date][patientIndex];

        /*
         * Close confirmation modal.
         */
        closeConfirmModal();

        /*
         * Refresh queue.
         */
        loadQueue(date);

        /*
         * Show success modal.
         */
        openSuccessModal(selectedPatient);
    }


    /* =========================================================
       SUCCESS MODAL
       ========================================================= */

    function openSuccessModal(patient) {

        if (!successModal || !successDetails) {
            return;
        }

        successDetails.innerHTML =
            createPatientDetails(patient, true);

        successModal.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    function createPatientDetails(patient, success) {

        let html = "";

        html += createDetailRow(
            "Patient Name",
            patient.name
        );

        /*
         * UHID is available for Edwin Johnson
         * from the provided workflow design.
         */
        if (patient.uhid) {

            html += createDetailRow(
                "UHID",
                patient.uhid
            );
        }

        html += createDetailRow(
            "Doctor",
            DOCTOR.name
        );

        html += createDetailRow(
            "Appointment Time",
            patient.time
        );

        html += createDetailRow(
            "Room Number",
            DOCTOR.room
        );

        if (success) {

            html += createDetailRow(
                "Check-In Time",
                formatCheckInTime()
            );
        }

        return html;
    }


    function createDetailRow(label, value) {

        return `
            <div class="queue-detail-row">

                <span class="queue-detail-label">
                    ${escapeHTML(label)}
                </span>

                <span class="queue-detail-value">
                    ${escapeHTML(value)}
                </span>

            </div>
        `;
    }


    function formatCheckInTime() {

        const now = new Date();

        let hours = now.getHours();
        const minutes = String(
            now.getMinutes()
        ).padStart(2, "0");

        const period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const month =
            monthNames[now.getMonth()];

        const year =
            now.getFullYear();

        return `${hours}:${minutes} ${period}, ${day} ${month} ${year}`;
    }


    /* =========================================================
       STATUS MANAGEMENT
       ========================================================= */

    function updatePatientStatus(patientId, status) {

        const date = queueDateInput.value;

        const storedQueue = getStoredQueue();

        if (!storedQueue[date]) {
            return;
        }

        const patient = storedQueue[date].find(
            function (item) {
                return String(item.id) ===
                    String(patientId);
            }
        );

        if (!patient) {
            return;
        }

        patient.status = status;

        saveStoredQueue(storedQueue);
    }


    function updateStatusStyle(select, status) {

        if (!select) {
            return;
        }

        select.classList.remove(
            "completed",
            "consultation",
            "next"
        );

        switch (status) {

            case "Completed":

                select.classList.add("completed");

                break;

            case "In consultation":

                select.classList.add("consultation");

                break;

            case "Next in queue":

                select.classList.add("next");

                break;

            default:

                break;
        }
    }


    /* =========================================================
       CLOSE MODALS
       ========================================================= */

    function closeConfirmModal() {

        if (confirmModal) {
            confirmModal.classList.remove("show");
        }

        selectedPatient = null;

        restoreBodyScroll();
    }


    function closeSuccessModal() {

        if (successModal) {
            successModal.classList.remove("show");
        }

        selectedPatient = null;

        restoreBodyScroll();
    }


    function closeAllModals() {

        if (confirmModal) {
            confirmModal.classList.remove("show");
        }

        if (successModal) {
            successModal.classList.remove("show");
        }

        selectedPatient = null;

        restoreBodyScroll();
    }


    function restoreBodyScroll() {
        document.body.style.overflow = "";
    }


    /* =========================================================
       HELPERS
       ========================================================= */

    function getText(id) {

        const element = document.getElementById(id);

        return element
            ? element.textContent.trim()
            : "";
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});