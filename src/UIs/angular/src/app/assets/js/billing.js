const bills = [
    {
        id: 1,
        patient: "Ramesh",
        visitDate: "2026-05-01",
        doctor: "Dr. Arun",
        clinicAddress: "ABC Medical Center",
        totalCharge: 500,
        insuranceCovered: 300,
        adjustments: 50,
        patientResponsibility: 150,
        paymentDate: "2026-05-05",
        remainingBalance: 0,
        image: "images/user.png"
    },
    {
        id: 2,
        patient: "Self",
        visitDate: "2026-05-08",
        doctor: "Dr. Tarun",
        clinicAddress: "City Health Clinic",
        totalCharge: 1200,
        insuranceCovered: 800,
        adjustments: 100,
        patientResponsibility: 300,
        paymentDate: "2026-05-10",
        remainingBalance: 100,
        image: "images/user.png"
    }
];

let filtered = [...bills];
let currentPage = 1;
const perPage = 5;

document.getElementById("searchInput").addEventListener("input", searchBills);
document.getElementById("sortSelect").addEventListener("change", sortBills);
document.getElementById("prevBtn").addEventListener("click", prevPage);
document.getElementById("nextBtn").addEventListener("click", nextPage);

render();

function render() {

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const pageData = filtered.slice(start, end);

    const container = document.getElementById("billingContainer");
    container.innerHTML = "";

    pageData.forEach(bill => {

        container.innerHTML += `<div class="bill-card">

                <div class="patient">
                    <img src="${bill.image}" alt="Patient">
                    <div>
                        <strong>${bill.patient}</strong>
                    </div>
                </div>

                <div>${formatDate(bill.visitDate)}</div>

                <div>${bill.doctor}</div>

                <div class="pharmacy-info">
                    <a href="javascript:void(0)"
                       onclick="openMap('${bill.clinicAddress}')">

                        <img
                            src="images/location-icon.png"
                            class="location-icon"
                            alt="Location">
                    </a>

                    <span>${bill.clinicAddress}</span>
                </div>

                <div>${bill.totalCharge}</div>

                <div>${bill.insuranceCovered}</div>

                <div>${bill.adjustments}</div>

                <div>${bill.patientResponsibility}</div>

                <div>${formatDate(bill.paymentDate)}</div>

                <div class="${bill.remainingBalance > 0 ? 'balance-due' : 'balance-paid'}">
                    ${bill.remainingBalance}
                </div>

            </div>`;
        
    });

    document.getElementById("pageNumber").innerText = currentPage;
}

function searchBills() {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    filtered = bills.filter(bill =>
        bill.patient.toLowerCase().includes(value) ||
        bill.doctor.toLowerCase().includes(value) ||
        bill.clinicAddress.toLowerCase().includes(value)
    );

    currentPage = 1;
    render();
}

function sortBills() {

    const value = document.getElementById("sortSelect").value;

    switch (value) {

        case "nameAsc":
            filtered.sort((a, b) => a.patient.localeCompare(b.patient));
            break;

        case "nameDesc":
            filtered.sort((a, b) => b.patient.localeCompare(a.patient));
            break;

        case "newest":
            filtered.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
            break;

        case "oldest":
            filtered.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
            break;

        case "highCharge":
            filtered.sort((a, b) => b.totalCharge - a.totalCharge);
            break;

        case "lowCharge":
            filtered.sort((a, b) => a.totalCharge - b.totalCharge);
            break;

        case "highBalance":
            filtered.sort((a, b) => b.remainingBalance - a.remainingBalance);
            break;

        case "lowBalance":
            filtered.sort((a, b) => a.remainingBalance - b.remainingBalance);
            break;
    }

    render();
}

function openMap(address) {

    window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        "_blank"
    );
}

function nextPage() {

    if (currentPage < Math.ceil(filtered.length / perPage)) {
        currentPage++;
        render();
    }
}

function prevPage() {

    if (currentPage > 1) {
        currentPage--;
        render();
    }
}

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

