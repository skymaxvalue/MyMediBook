const associates = [
    { name: "Kumar Sekhar", dept: "Cardiology", spec: "EP", from: "2026-04-24", to: "2026-05-24", time: "64 Hours" },
    { name: "Julia Doe", dept: "Neurology", spec: "Epilepsy", from: "2026-04-24", to: "2026-05-24", time: "90 Hours" },
    { name: "Sunny Side", dept: "Orthopedics", spec: "Spine Surgery", from: "2026-04-24", to: "2026-05-24", time: "120 Hours" },
    { name: "Rohit Sans", dept: "Pediatrics", spec: "Neonatology", from: "2026-04-24", to: "2026-05-24", time: "60 Hours" }
];

const tableBody = document.getElementById('table-body');

const renderTable = () => {
    tableBody.innerHTML = associates.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.dept}</td>
            <td>${item.spec}</td>
            <td>${item.from}</td>
            <td>${item.to}</td>
            <td>${item.time}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit">✎ Edit</button>
                    <button class="btn btn-delete">✕ Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
};

window.onload = renderTable;