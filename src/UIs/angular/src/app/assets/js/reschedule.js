

const appointment = JSON.parse(
    localStorage.getItem("appointmentToReschedule")
);

const selectedDate = document.getElementById("appointmentDate");
const timeButtons = document.querySelectorAll(".time-slots button");

let newTime = "";


if (appointment) {

    document.getElementById("patientName").innerText =
        appointment.patient;

    document.getElementById("doctorName").innerText =
        appointment.doctor;

    document.getElementById("visitPurpose").innerText =
        appointment.purpose;

    document.getElementById("currentDate").innerText =
        appointment.date;

    document.getElementById("currentTime").innerText =
        appointment.time;
}



const today = new Date();
today.setHours(0, 0, 0, 0);

const currentDate = new Date(appointment.date);


currentDate.setDate(currentDate.getDate() + 1);

selectedDate.min =
    currentDate.toISOString().split("T")[0];



timeButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (this.classList.contains("disabled")) {
            return;
        }

        timeButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        newTime = this.innerText;

    });

});


function confirmReschedule() {

    if (!selectedDate.value) {

        showDateReminder();

        return;
    }

    if (!newTime) {

        showTimeReminder();

        return;
    }

    appointment.currentDate = appointment.date;
    appointment.currentTime = appointment.time;

    appointment.date = formatDate(selectedDate.value);
    appointment.time = newTime;

    appointment.newDate = appointment.date;
    appointment.newTime = appointment.time;

    localStorage.setItem(
        "appointmentToReschedule",
        JSON.stringify(appointment)
    );

    window.location.href = "reschedule-success.html";
}



function showDateReminder(){

    document
        .getElementById("dateReminderModal")
        .classList.add("show");
}


function closeDateReminder(){

    document
        .getElementById("dateReminderModal")
        .classList.remove("show");
}


function showTimeReminder(){

    document
        .getElementById("timeReminderModal")
        .classList.add("show");
}


function closeTimeReminder(){

    document
        .getElementById("timeReminderModal")
        .classList.remove("show");
}







function cancelReschedule() {

    history.back();

}



function formatDate(date) {

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    return new Date(date)
        .toLocaleDateString("en-GB", options);

}




const slots =
document.querySelectorAll(".time-slots button");

slots.forEach(slot=>{

    slot.onclick=function(){

        if(slot.classList.contains("disabled"))
            return;

        slots.forEach(btn=>
            btn.classList.remove("active")
        );

        slot.classList.add("active");

        newTime=slot.innerText;

    };

});








const reason = document.getElementById("reason");
const otherReason = document.getElementById("otherReason");


otherReason.classList.add("hidden");

reason.addEventListener("change", function () {

    if (this.value === "other") {

        otherReason.classList.remove("hidden");

    } else {

        otherReason.classList.add("hidden");
        otherReason.value = "";

    }

});