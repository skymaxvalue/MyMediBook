const labResults = [

{
id:1,
patient:"Ramesh",
test:"Blood Test",
code:"B101",
date:"2026-05-01",
result:"Insufficient",
range:"90 - 110",
status:"Normal",
lab:"Lab Corp",
image:"images/user.png"
},

{
id:2,
patient:"Self",
test:"Urine Test",
code:"B209",
date:"2026-05-02",
result:"Hemolyzed",
range:"5 - 12",
status:"Critical",
lab:"Lab Corp",
image:"images/user.png"
},

{
id:3,
patient:"Anita",
test:"Thyroid Panel",
code:"T401",
date:"2026-05-03",
result:"Pending",
range:"Awaiting",
status:"Pending",
lab:"Health Lab",
image:"images/user.png"
}

];

let currentPage = 1;
const perPage = 5;
let filtered = [...labResults];

render();

document.getElementById("searchInput")
.addEventListener("input", searchRecords);

document.getElementById("sortSelect")
.addEventListener("change", sortRecords);

document.getElementById("prevBtn")
.addEventListener("click", prevPage);

document.getElementById("nextBtn")
.addEventListener("click", nextPage);

function render(){

updateSummary();

const start=(currentPage-1)*perPage;
const pageData=filtered.slice(start,start+perPage);

const container=document.getElementById("labResultsContainer");

container.innerHTML="";

pageData.forEach(item=>{

container.innerHTML += `

<div class="result-card">

    <!-- 1 -->
    <div class="patient">
        <img src="${item.image}">
        <div>${item.patient}</div>
    </div>

    <!-- 2 -->
    <div class="mobile-field">
 
    <span>${item.test}</span>
</div>

    <!-- 3 -->
    <div class="mobile-field">
        
        <span>${item.code}</span>
    </div>

    <!-- 4 -->
    <div class="mobile-field">
        
        <span>${formatDate(item.date)}</span>
    </div>

    <!-- 5 -->
    <div class="mobile-field">
     
        <span>${item.result}</span>
    </div>

    <!-- 6 -->
    <div class="mobile-field">
        
        <span>${item.range}</span>
    </div>

    <!-- 7 -->
    <div>
        ${getStatusBadge(item.status)}
    </div>

    <!-- 8 -->
    <div>${item.lab}</div>

    <!-- 9 -->
    <div>
        <button
            class="details-btn"
            onclick="showDetails(${item.id})">
            View Details
        </button>
    </div>

</div>

`;

});

document.getElementById("pageNumber").innerText=currentPage;

}
function getStatusBadge(status){

if(status==="Normal"){
return `
<div class="status-normal">
    <div class="badge-title">
        Normal
        <img src="images/status-normal.png">
    </div>
    <small>In Range</small>
</div>`;
}

if(status==="Critical"){
return `
<div class="status-critical">
    <div class="badge-title">
        Critical
        <img src="images/status-critical.png">
    </div>
    <small>Out Of Range</small>
</div>`;
}

return `
<div class="status-pending">
    <div class="badge-title">
        Pending
        <img src="images/icon-pending.png">
    </div>
    <small>Awaiting Report</small>
</div>`;
}

function updateSummary(){

document.getElementById("totalTests").innerText =
labResults.length;

document.getElementById("normalTests").innerText =
labResults.filter(x=>x.status==="Normal").length;

document.getElementById("criticalTests").innerText =
labResults.filter(x=>x.status==="Critical").length;

document.getElementById("pendingTests").innerText =
labResults.filter(x=>x.status==="Pending").length;

document.getElementById("reportsReady").innerText =
labResults.filter(x=>x.status!=="Pending").length;

}

function searchRecords(){

const value =
document.getElementById("searchInput")
.value
.toLowerCase();

filtered = labResults.filter(item=>

item.patient.toLowerCase().includes(value) ||
item.test.toLowerCase().includes(value) ||
item.code.toLowerCase().includes(value) ||
item.lab.toLowerCase().includes(value)

);

currentPage=1;
render();
}

function sortRecords(){

const val=document.getElementById("sortSelect").value;

if(val==="nameAsc")
filtered.sort((a,b)=>a.patient.localeCompare(b.patient));

if(val==="nameDesc")
filtered.sort((a,b)=>b.patient.localeCompare(a.patient));

if(val==="newest")
filtered.sort((a,b)=>new Date(b.date)-new Date(a.date));

if(val==="oldest")
filtered.sort((a,b)=>new Date(a.date)-new Date(b.date));

if(val==="normal")
filtered.sort((a,b)=>(a.status==="Normal"?-1:1));

if(val==="critical")
filtered.sort((a,b)=>(a.status==="Critical"?-1:1));

if(val==="pending")
filtered.sort((a,b)=>(a.status==="Pending"?-1:1));

render();
}

function showDetails(id){

const item=labResults.find(x=>x.id===id);

document.getElementById("printArea").innerHTML=`

<h4>Lab Report</h4>
<hr>

<p><strong>Patient Name:</strong> ${item.patient}</p>
<p><strong>Test Name:</strong> ${item.test}</p>
<p><strong>Test Code:</strong> ${item.code}</p>
<p><strong>Lab Name:</strong> ${item.lab}</p>
<p><strong>Collection Date:</strong> ${formatDate(item.date)}</p>
<p><strong>Result:</strong> ${item.result}</p>
<p><strong>Reference Range:</strong> ${item.range}</p>
<p><strong>Status:</strong> ${item.status}</p>
<p><strong>Doctor Notes:</strong> No additional remarks.</p>

`;

new bootstrap.Modal(
document.getElementById("detailsModal")
).show();

}

function downloadPDF(){

html2pdf()
.from(document.getElementById("printArea"))
.save("lab-report.pdf");

}

function printReport(){
window.print();
}

function nextPage(){

if(currentPage < Math.ceil(filtered.length/perPage)){
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

return new Date(date).toLocaleDateString(
"en-GB",
{
day:"2-digit",
month:"short",
year:"numeric"
}
);

}

let sortDirection = {};

function sortResults(field){

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
            valA = new Date(valA);
            valB = new Date(valB);
        }else{
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
        }

        return isAsc
            ? (valA > valB ? 1 : -1)
            : (valA < valB ? 1 : -1);

    });

    document
        .querySelectorAll(".sort-icon")
        .forEach(icon=>icon.innerText="▼");

    const icons =
        document.querySelectorAll(".table-header .sort-icon");

    if(field==="patient") icons[0].innerText=isAsc?"▲":"▼";
    if(field==="test") icons[1].innerText=isAsc?"▲":"▼";
    if(field==="date") icons[2].innerText=isAsc?"▲":"▼";

    currentPage=1;

    render();
}