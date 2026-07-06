const appointment = JSON.parse(
    localStorage.getItem("appointmentToReschedule")
);

if (appointment) {

    document.getElementById("patientName").innerText =
        appointment.patient;

    document.getElementById("doctorName").innerText =
        appointment.doctor;

    document.getElementById("visitPurpose").innerText =
        appointment.purpose;

    document.getElementById("oldDate").innerText =
        appointment.currentDate || appointment.date;

    document.getElementById("oldTime").innerText =
        appointment.currentTime || appointment.time;

    document.getElementById("newDate").innerText =
        appointment.newDate;

    document.getElementById("newTime").innerText =
        appointment.newTime;

}