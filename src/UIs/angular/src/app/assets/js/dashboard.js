let rescheduleCount = {};

let selectedRow = null;
















function goToSpecialities() {
    window.location.href = "specialities.html";
}

let sortDirection = {};

function sortTable(columnIndex) {
    const table = document.querySelector(".appointment-table tbody");
    const rows = Array.from(table.rows);
    const headers = document.querySelectorAll("th");

    
    if (sortDirection[columnIndex] === undefined) {
        sortDirection[columnIndex] = false;
    } else {
        sortDirection[columnIndex] = !sortDirection[columnIndex];
    }

    const isAsc = sortDirection[columnIndex];

    rows.sort((a, b) => {
        let valA = a.cells[columnIndex].innerText.trim();
        let valB = b.cells[columnIndex].innerText.trim();

        if (columnIndex === 2) {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (columnIndex === 3) {
            valA = convertTime(valA);
            valB = convertTime(valB);
        }

        return isAsc
            ? (valA > valB ? 1 : -1)
            : (valA < valB ? 1 : -1);
    });

    rows.forEach(row => table.appendChild(row));

    
    headers.forEach(th => {
        const icon = th.querySelector(".sort-icon");
        if (icon) icon.innerText = "▼";
    });

    
    const activeIcon = headers[columnIndex].querySelector(".sort-icon");
    activeIcon.innerText = isAsc ? "▲" : "▼";
}






function cancelAppointment(button){

    selectedRow = button.closest("tr");

    document.getElementById("modalDoctor").innerText =
        selectedRow.cells[4].innerText;

    document.getElementById("modalDate").innerText =
        selectedRow.cells[2].innerText;

    document.getElementById("modalTime").innerText =
        selectedRow.cells[3].innerText;

    document
        .getElementById("cancelModal")
        .classList.add("show");
}









function rescheduleAppointment(button){

    selectedRow = button.closest("tr");

    const doctor =
        selectedRow.cells[4].innerText;

    document.getElementById("rescheduleDoctor").innerText =
        doctor;

    const id = selectedRow.rowIndex;

    if(!rescheduleCount[id])
        rescheduleCount[id] = 0;

    if(rescheduleCount[id] === 1){

        document.getElementById("rescheduleInfo").innerText =
        "You have used 1 of 2 reschedules. This will be your final reschedule.";

    }else{

        document.getElementById("rescheduleInfo").innerText =
        "You can reschedule this appointment up to 2 times.";

    }

    if(rescheduleCount[id] >= 2){

        document.getElementById("rescheduleInfo").innerText =
        "Maximum reschedule limit reached.";

        return;
    }

    document
        .getElementById("rescheduleModal")
        .classList.add("show");
}



function confirmReschedule() {

    const id = selectedRow.rowIndex;

    rescheduleCount[id]++;

    if (rescheduleCount[id] >= 2) {

        const btn = selectedRow.querySelector(".reschedule-btn");

        btn.disabled = true;
        btn.classList.add("disabled");
    }

   
    const appointment = {

        patient: selectedRow.cells[1].innerText,
        date: selectedRow.cells[2].innerText,
        time: selectedRow.cells[3].innerText,
        doctor: selectedRow.cells[4].innerText,
        purpose: selectedRow.cells[0].innerText,
        status: selectedRow.cells[5].innerText

    };

    localStorage.setItem(
        "appointmentToReschedule",
        JSON.stringify(appointment)
    );

    window.location.href = "reschedule.html";

}


function closeCancelModal(){

    document
        .getElementById("cancelModal")
        .classList.remove("show");
}

function confirmCancel(){

    selectedRow.querySelector(".status").innerText="Cancelled";

    selectedRow.querySelector(".status").className=
    "status cancelled";

    selectedRow.querySelector(".cancel-btn").disabled=true;
    selectedRow.querySelector(".cancel-btn").classList.add("disabled");

    selectedRow.querySelector(".reschedule-btn").disabled=true;
    selectedRow.querySelector(".reschedule-btn").classList.add("disabled");

    closeCancelModal();
}






window.addEventListener("load", () => {

    const appointment = JSON.parse(
        localStorage.getItem("appointmentToReschedule")
    );

    if (!appointment) return;

    const rows = document.querySelectorAll(".appointment-table tbody tr");

    rows.forEach(row => {

        const patient = row.cells[1].innerText.trim();
        const doctor = row.cells[4].innerText.trim();

        if (
            patient === appointment.patient &&
            doctor === appointment.doctor
        ) {

            
            row.cells[2].innerText = appointment.date;

            
            row.cells[3].innerText = appointment.time;

            
            const status = row.querySelector(".status");

            status.innerText = "Rescheduled";
            status.className = "status rescheduled";

        }

    });

});


function closeRescheduleModal() {

    document
        .getElementById("rescheduleModal")
        .classList.remove("show");

}

const rescheduleModal = document.getElementById("rescheduleModal");

rescheduleModal.addEventListener("click", function (e) {

    if (e.target === this) {

        closeRescheduleModal();

    }

});

const cancelModal = document.getElementById("cancelModal");

cancelModal.addEventListener("click", function (e) {

    if (e.target === this) {

        closeCancelModal();

    }

});