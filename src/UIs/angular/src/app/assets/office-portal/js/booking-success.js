document.addEventListener("DOMContentLoaded", function () {

    const successCard = document.getElementById("successCard");
    const emptyCard = document.getElementById("emptyCard");
    const summaryCard = document.getElementById("summaryCard");
    const dashboardBtn = document.getElementById("dashboardBtn");
    const bookAnotherBtn = document.getElementById("bookAnotherBtn");

    const BOOKING_ID_KEY = "latestBookingId";
    const BOOKING_ID_FOR_KEY = "latestBookingIdFor"; // fingerprint of the appointment it belongs to


    // ---- data access -------------------------------------------------

    function getAppointmentData() {
        try {
            const raw = localStorage.getItem("latestAppointment");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    // A stable, human-friendly booking ID. Regenerated only when the
    // stored appointment actually changes, so refreshing this page
    // keeps showing the same ID for the same booking.
    function getBookingId(data) {
        const fingerprint = JSON.stringify(data);
        const storedFor = localStorage.getItem(BOOKING_ID_FOR_KEY);
        const storedId = localStorage.getItem(BOOKING_ID_KEY);

        if (storedId && storedFor === fingerprint) {
            return storedId;
        }

        const id = "APT-" + Date.now().toString().slice(-8);
        localStorage.setItem(BOOKING_ID_KEY, id);
        localStorage.setItem(BOOKING_ID_FOR_KEY, fingerprint);
        return id;
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

        // Doctor/specialty/consultation type aren't part of the booking
        // payload yet, so fall back to sensible defaults rather than
        // showing blank rows; anything the flow does start saving under
        // these keys will be picked up automatically.
        const doctorName = localStorage.getItem("selectedDoctorName") || "Dr. Kumar";
        const specialty = localStorage.getItem("selectedSpecialty") || "General Physician";
        const consultationType = data.visitType || localStorage.getItem("selectedVisitType") || "Consultation";

        return [
            { label: "Patient Name", value: patientName },
            { label: "Doctor", value: doctorName },
            { label: "Specialty", value: specialty },
            { label: "Date", value: formatDate(data.date) },
            { label: "Time", value: data.time || "Not selected" },
            { label: "Consultation Type", value: consultationType },
         
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
        successCard.hidden = true;
        emptyCard.hidden = false;
    }

    function showSuccessState(data) {
        renderSummary(buildSummaryRows(data));
        successCard.hidden = false;
        emptyCard.hidden = true;
    }

    const appointment = getAppointmentData();

    if (appointment) {
        showSuccessState(appointment);
    } else {
        showEmptyState();
    }

    dashboardBtn.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });

    bookAnotherBtn.addEventListener("click", function () {
        window.location.href = "specialities.html";
    });

});
