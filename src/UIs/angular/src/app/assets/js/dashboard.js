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