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
                            <div>
    <button
        class="details-btn"
        onclick="showDetails(${bill.id})">

        View Details

    </button>
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

function showDetails(id){

    const bill =
    bills.find(b => b.id === id);

    document.getElementById("printArea").innerHTML = `

        <div class="billing-sheet">

            <h3>Billing Invoice</h3>

            <hr>

            <p><strong>Patient:</strong> ${bill.patient}</p>

            <p><strong>Doctor:</strong> ${bill.doctor}</p>

            <p><strong>Visit Date:</strong> ${formatDate(bill.visitDate)}</p>

            <p><strong>Clinic:</strong> ${bill.clinicAddress}</p>

            <hr>

            <p><strong>Total Charge:</strong> ₹${bill.totalCharge}</p>

            <p><strong>Insurance Covered:</strong> ₹${bill.insuranceCovered}</p>

            <p><strong>Adjustments:</strong> ₹${bill.adjustments}</p>

            <p><strong>Patient Responsibility:</strong> ₹${bill.patientResponsibility}</p>

            <p><strong>Payment Date:</strong> ${formatDate(bill.paymentDate)}</p>

            <p><strong>Remaining Balance:</strong> ₹${bill.remainingBalance}</p>

        </div>

    `;

    new bootstrap.Modal(
        document.getElementById("detailsModal")
    ).show();

}


let sortDirection = {};

function sortTable(field){

    if(sortDirection[field] === undefined){
        sortDirection[field] = false;
    }else{
        sortDirection[field] = !sortDirection[field];
    }

    const isAsc = sortDirection[field];

    filtered.sort((a,b)=>{

        let valA = a[field];
        let valB = b[field];

        if(field === "visitDate"){
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        }else{
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        if(valA === valB) return 0;

        return isAsc
            ? (valA > valB ? 1 : -1)
            : (valA < valB ? 1 : -1);

    });

    document
    .querySelectorAll(".sort-icon")
    .forEach(icon=>icon.innerText="▼");

const icons =
    document.querySelectorAll(".table-header .sort-icon");

if(field==="patient")
    icons[0].innerText=isAsc?"▲":"▼";

if(field==="visitDate")
    icons[1].innerText=isAsc?"▲":"▼";

    render();
}








function downloadPDF(){

    const element =
    document.getElementById("printArea");

    html2pdf()
        .set({
            margin:10,
            filename:'billing-invoice.pdf',
            image:{
                type:'jpeg',
                quality:1
            },
            html2canvas:{
                scale:2
            },
            jsPDF:{
                unit:'mm',
                format:'a4',
                orientation:'portrait'
            }
        })
        .from(element)
        .save();

}






function printBill(){
    window.print();
}



