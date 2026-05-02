const data = JSON.parse(localStorage.getItem("latestAppointment"));

if (data) {
    document.getElementById("patientName").value =
        data.firstName + " " + data.lastName;

    document.getElementById("date").value =
        localStorage.getItem("selectedDate") || "13 Apr 2026";

    document.getElementById("time").value =
        localStorage.getItem("selectedTime") || "2:00 PM";
}


function goBack() {
    window.location.href = "dashboard.html";
}




window.onload = function () {

    const data = JSON.parse(localStorage.getItem("latestAppointment"));

    if (data) {
        document.getElementById("patientName").value =
            data.firstName + " " + data.lastName;

        document.getElementById("date").value = data.date;
        document.getElementById("time").value = data.time;
    }

};
