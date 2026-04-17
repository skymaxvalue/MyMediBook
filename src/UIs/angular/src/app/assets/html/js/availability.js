let currentStartDate = new Date();

const dateInput = document.getElementById("dateFilter");
const container = document.getElementById("scheduleContainer");

const today = new Date();
dateInput.min = today.toISOString().split("T")[0];

let selectedSlot = "";
let selectedDateGlobal = "";

function formatDate(d) {
    const day = d.toLocaleDateString("en-GB", {
        weekday: "long"
    });

    const date = d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return `${day.toUpperCase()} - ${date.toUpperCase()}`;
}

function generateSchedule(startDate) {
    container.innerHTML = "";

    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);

        let badgeClass = "green";
        let text = "09:00 AM - 05:30PM";

        if (i === 4) badgeClass = "red";
        if (i === 6) {
            badgeClass = "beige";
            text = "Dr. Unavailable";
        }

        container.innerHTML += `
        <div class="row">
           <span>${formatDate(d)}  </span>
            <span class="badge ${badgeClass}" 
                ${badgeClass !== "beige" ? `onclick="openSlotsPopup('${formatDate(d)}','${badgeClass}')"` : ""}>
                ${text}
            </span>
        </div>`;
    }
}

dateInput.addEventListener("change", function () {
    currentStartDate = new Date(this.value);
    generateSchedule(currentStartDate);
});

function nextWeek() {
    currentStartDate.setDate(currentStartDate.getDate() + 7);
    generateSchedule(currentStartDate);
}

function prevWeek() {
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() - 7);

    if (newDate >= today) {
        currentStartDate = newDate;
        generateSchedule(currentStartDate);
    }
}

window.onload = () => generateSchedule(today);

function openSlotsPopup(date, type) {

    if (type === "beige") return;

    selectedDateGlobal = date;

    const modal = document.getElementById("slotsModal");
    const container = document.getElementById("slotsContainer");

    modal.style.display = "flex";
    document.getElementById("slotDate").innerText = date;

    container.innerHTML = "";

    const allSlots = [
        "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
        "11:00 AM","11:30 AM","12:00 PM",
        "01:00 PM","01:30 PM","02:00 PM","02:30 PM",
        "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"
    ];

    let bookedSlots = [];

    if (type === "red") {
        bookedSlots = allSlots.slice(0, 10);
    }

    if (type === "green") {
        bookedSlots = allSlots.slice(0, 3);
    }

    allSlots.forEach(slot => {

        const isBooked = bookedSlots.includes(slot);

        const div = document.createElement("div");
        div.className = "slot " + (isBooked ? "booked" : "available");

        div.innerText = slot;

        if (!isBooked) {
            div.onclick = () => {

                document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));

                div.classList.add("selected");

                selectedSlot = slot;
            };
        }

        container.appendChild(div);
    });
}

function closeSlotsModal() {
    document.getElementById("slotsModal").style.display = "none";
}

function goToBooking() {

    if (!selectedSlot) {
        alert("Please select a time slot");
        return;
    }

    localStorage.setItem("selectedDate", selectedDateGlobal);
    localStorage.setItem("selectedTime", selectedSlot);
    localStorage.setItem("doctor", "Dr. Kumar");

    window.location.href = "booking.html";
}

function openBooking(date, time) {
    document.getElementById("bookingModal").style.display = "flex";
    document.getElementById("selectedDate").innerText = date;
    document.getElementById("selectedTime").innerText = time;
}

function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
}

function confirmBooking() {
    const date = document.getElementById("selectedDate").innerText;
    const time = document.getElementById("selectedTime").innerText;

    const appointment = {
        doctor: "Dr. Kumar",
        date: date,
        time: time,
        status: "Upcoming"
    };

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push(appointment);

    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment Booked Successfully!");

    closeModal();
}

function goBack() {
    window.location.href = "specialities.html";
}