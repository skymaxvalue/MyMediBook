const orders = [

{
id:1,
patient:"Ramesh",
medicine:"Amoxicillin",
strength:"500mg",
instructions:"1 Tablet Morning | 1 Tablet Night",
date:"2026-04-21",
doctor:"Dr. Arun",
status:"Ready",
address:"ABC Pharmacy",
image:"images/user.png",
refill:false
},

{
id:2,
patient:"Self",
medicine:"Zovirax",
strength:"200mg",
instructions:"1 Tablet Morning",
date:"2026-05-01",
doctor:"Dr. Tarun",
status:"In Transit",
address:"CBC Pharmacy",
image:"images/user.png",
refill:true
},


{
id:3,
patient:"Ankit",
medicine:"Paracetamol",
strength:"650mg",
instructions:"1 Tablet After Food",
date:"2026-03-15",
doctor:"Dr. Roy",
status:"Ready",
address:"XYZ Pharmacy",
image:"images/user.png",
refill:true
},

{
id:4,
patient:"Zoya",
medicine:"Cetirizine",
strength:"10mg",
instructions:"1 Tablet Night",
date:"2026-06-10",
doctor:"Dr. Khan",
status:"In Transit",
address:"City Pharmacy",
image:"images/user.png",
refill:false
}

];

let currentPage=1;
const perPage=5;
let filtered=[...orders];

render();

document
.getElementById("searchInput")
.addEventListener("input",searchOrders);

document
.getElementById("sortSelect")
.addEventListener("change",sortOrders);

document
.getElementById("prevBtn")
.addEventListener("click",prevPage);

document
.getElementById("nextBtn")
.addEventListener("click",nextPage);

function render(){

updateSummary();

const start=(currentPage-1)*perPage;
const end=start+perPage;

const pageData=filtered.slice(start,end);

const container=
document.getElementById("ordersContainer");

container.innerHTML="";

pageData.forEach(order=>{

container.innerHTML+=`

<div class="order-card">

<div class="patient">
<img src="${order.image}">
<div>
<h5>${order.patient}</h5>
</div>
</div>

<div>
<b>${order.medicine}</b>
<br>
${order.strength}
</div>

<div>${order.instructions}</div>

<div>
<b>${formatDate(order.date)}</b>
<br>
${order.doctor}
</div>

<div>

${
order.refill
?
`<button
    class="refill-btn"
    onclick="requestRefill(${order.id})">

    <img src="images/refill-icon.png" alt="">
    <span>Request Refill</span>

</button>`
:
'N/A'
}


</div>

<div class="pharmacy-info">

    <a
       href="javascript:void(0)"
       onclick="openMap('${order.address}')">

        <img
            src="images/location-icon.png"
            class="location-icon"
            alt="Location">

    </a>

    <span>${order.address}</span>

</div>

<div>

<span class="${
order.status==='Ready'
?'status-ready'
:'status-transit'
}">
${order.status}
</span>

</div>

<div>

<button
class="details-btn"
onclick="showDetails(${order.id})">

View Details

</button>

</div>

</div>
`;
});
}



function searchOrders(){

const value=
document
.getElementById("searchInput")
.value
.toLowerCase();

filtered=orders.filter(order=>

order.patient.toLowerCase().includes(value) ||
order.medicine.toLowerCase().includes(value) ||
order.doctor.toLowerCase().includes(value)

);

currentPage=1;
render();
}

function sortOrders(){

const val=
document.getElementById("sortSelect").value;

if(val==="nameAsc")
filtered.sort((a,b)=>a.patient.localeCompare(b.patient));

if(val==="nameDesc")
filtered.sort((a,b)=>b.patient.localeCompare(a.patient));

if(val==="ready")
filtered.sort((a,b)=>
(a.status==="Ready"?-1:1));

if(val==="transit")
filtered.sort((a,b)=>
(a.status==="In Transit"?-1:1));

if(val==="newest")
filtered.sort((a,b)=>
new Date(b.date)-new Date(a.date));

if(val==="oldest")
filtered.sort((a,b)=>
new Date(a.date)-new Date(b.date));

render();
}

function requestRefill(id){

    const order = orders.find(
        o => o.id === id
    );

    if(!order) return;

    alert(
        `Refill request submitted for ${order.medicine}`
    );

}

function openMap(address){

window.open(
`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
"_blank"
);

}

function showDetails(id){

const order=
orders.find(o=>o.id===id);

document.getElementById("printArea").innerHTML = `

<div class="prescription-sheet">

<h3>Medicine Prescription</h3>

<hr>

<p><strong>Patient Name:</strong> ${order.patient}</p>

<p><strong>Medicine:</strong> ${order.medicine}</p>

<p><strong>Strength:</strong> ${order.strength}</p>

<p><strong>Instructions:</strong> ${order.instructions}</p>

<p><strong>Doctor:</strong> ${order.doctor}</p>

<p><strong>Order Date:</strong> ${formatDate(order.date)}</p>

<p><strong>Pharmacy:</strong> ${order.address}</p>

<p><strong>Status:</strong> ${order.status}</p>

</div>
`;

new bootstrap.Modal(
document.getElementById("detailsModal")
).show();

}

function printDetails(){

window.print();

}

function updateSummary(){

document.getElementById(
"totalOrders"
).innerText=
orders.length;

document.getElementById(
"readyOrders"
).innerText=
orders.filter(o=>
o.status==="Ready"
).length;

document.getElementById(
"transitOrders"
).innerText=
orders.filter(o=>
o.status==="In Transit"
).length;

}

function nextPage(){

if(
currentPage <
Math.ceil(filtered.length/perPage)
){
currentPage++;
render();
}

}

function prevPage(){

if(currentPage>1){
currentPage--;
render();
}

}

function formatDate(date){

return new Date(date)
.toLocaleDateString(
'en-GB',
{
day:'2-digit',
month:'short',
year:'numeric'
}
);

}


function downloadPDF(){

    const element =
    document.getElementById("printArea");

    html2pdf()
        .set({
            margin:10,
            filename:'medicine-order.pdf',
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

    if(field === "date"){
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
    } else {
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

    if(field==="medicine")
        icons[1].innerText=isAsc?"▲":"▼";

    if(field==="date")
        icons[2].innerText=isAsc?"▲":"▼";
    

    if(field==="status")
    icons[3].innerText=isAsc?"▲":"▼";

    currentPage=1;

    render();
}
