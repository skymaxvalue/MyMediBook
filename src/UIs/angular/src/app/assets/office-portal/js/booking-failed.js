document.addEventListener("DOMContentLoaded", function () {

    const failedCard = document.getElementById("failedCard");
    const emptyCard = document.getElementById("emptyCard");
    const summaryCard = document.getElementById("summaryCard");
    const retryBtn = document.getElementById("retryBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");


    // ---- data access -------------------------------------------------

    function getAttemptedAppointment() {
        try {
            // tempAppointment is what booking.js saves right before sending
            // the user to OTP verification, so it reflects the attempt that
            // just failed even if latestAppointment gets overwritten later.
            const raw = localStorage.getItem("tempAppointment") || localStorage.getItem("latestAppointment");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function formatDate(value) {
        if (!value || value === "Not Selected") return value || "Not selected";

        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) return value; // already a display string

        return parsed.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    // ---- summary rendering --------------------------------------------

    function buildSummaryRows(data) {
        const patientName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "—";

        const doctorName = localStorage.getItem("selectedDoctorName") || "Dr. Kumar";
        const specialty = localStorage.getItem("selectedSpecialty") || "General Physician";
        const consultationType = data.visitType || localStorage.getItem("selectedVisitType") || "Consultation";

        return [
            { label: "Patient Name", value: patientName },
            { label: "Doctor", value: doctorName },
            { label: "Specialty", value: specialty },
            { label: "Date", value: formatDate(data.date) },
            { label: "Time", value: data.time || "Not selected" },
            { label: "Consultation Type", value: consultationType }
        ];
    }

    function renderSummary(rows) {
        summaryCard.innerHTML = rows.map(row => `
            <div class="summary-row">
                <span class="summary-label">${row.label}</span>
                <span class="summary-value${row.mono ? " mono" : ""}">${row.value}</span>
            </div>
        `).join("");
    }


    // ---- init -----------------------------------------------------------

    function showEmptyState() {
        failedCard.hidden = true;
        emptyCard.hidden = false;
    }

    function showFailedState(data) {
        renderSummary(buildSummaryRows(data));
        failedCard.hidden = false;
        emptyCard.hidden = true;
    }

    const appointment = getAttemptedAppointment();

    if (appointment) {
        showFailedState(appointment);
    } else {
        showEmptyState();
    }

    retryBtn.addEventListener("click", function () {
        window.location.href = "booking-otp.html";
    });

    dashboardBtn.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });

});
