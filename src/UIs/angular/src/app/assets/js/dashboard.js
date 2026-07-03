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

    // first click = DESC (false)
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

    // reset all icons to default ▼
    headers.forEach(th => {
        const icon = th.querySelector(".sort-icon");
        if (icon) icon.innerText = "▼";
    });

    // update active column icon
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

    const row = button.closest("tr");

    const id = row.rowIndex;

    if(!rescheduleCount[id])
        rescheduleCount[id] = 0;

    if(rescheduleCount[id] >= 2){

        alert("Maximum reschedule limit reached.");

        button.disabled = true;
        button.classList.add("disabled");

        return;
    }

    rescheduleCount[id]++;

    if(rescheduleCount[id] == 2){

        button.disabled = true;
        button.classList.add("disabled");
    }

    window.location.href = "specialities.html";
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