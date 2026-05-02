function populateFailedDetails() {
    const latestAppointment = JSON.parse(localStorage.getItem("latestAppointment") || "null");

    const fallbackName = latestAppointment
        ? `${latestAppointment.firstName || ""} ${latestAppointment.lastName || ""}`.trim()
        : "Mr. Edizo Dey";

    document.getElementById("patientName").value = fallbackName || "Mr. Edizo Dey";
    document.getElementById("date").value = localStorage.getItem("selectedDate") || latestAppointment?.date || "13 Apr 2026 (MONDAY)";
    document.getElementById("time").value = localStorage.getItem("selectedTime") || latestAppointment?.time || "2:00 PM";
}

function goBack() {
    window.location.href = "dashboard.html";
}

window.addEventListener("load", populateFailedDetails);