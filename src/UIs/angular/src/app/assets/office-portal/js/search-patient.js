

document.addEventListener("DOMContentLoaded", () => {

    initializeSearchPatient();

    const params =
    new URLSearchParams(window.location.search);

const query =
    params.get("q");

if(query){

    document.getElementById("firstName").value=query;

    searchPatients();

}

});


function initializeSearchPatient(){

    setupSearch();

    setupClearFilters();

}



function setupSearch(){

    const searchButton = document.getElementById("searchPatientBtn");

    if(!searchButton){

        return;

    }

    searchButton.addEventListener("click", searchPatients);

}



function searchPatients(){

    const firstName =
        document.getElementById("firstName").value
        .trim()
        .toLowerCase();

    const lastName =
        document.getElementById("lastName").value
        .trim()
        .toLowerCase();

    const dob =
        document.getElementById("dob").value;

    const phone =
        document.getElementById("phone").value
        .trim()
        .toLowerCase();

    const rows =
        document.querySelectorAll("#patientTableBody tr");

    let visibleCount = 0;

    rows.forEach(row => {

        const name =
            row.cells[1].innerText.toLowerCase();

        const dobText =
            row.cells[3].innerText.toLowerCase();

        const phoneText =
            row.cells[5].innerText.toLowerCase();

        let show = true;

        if(firstName && !name.includes(firstName)){

            show = false;

        }

        if(lastName && !name.includes(lastName)){

            show = false;

        }

        if(phone && !phoneText.includes(phone)){

            show = false;

        }

        if(dob){

            const selected =
                formatDateForCompare(dob);

            if(!dobText.includes(selected)){

                show = false;

            }

        }

        row.style.display =
            show ? "" : "none";

        if(show){

            visibleCount++;

        }

    });

    updateResultCount(visibleCount);

}



function updateResultCount(count){

    const badge =
        document.querySelector(".result-count");

    if(badge){

        badge.textContent =
            `${count} Patients Found`;

    }

}




function setupClearFilters(){

    const clearButton = document.getElementById("clearFilters");

    if(!clearButton){

        return;

    }

    clearButton.addEventListener("click", clearFilters);

}


function clearFilters(){

    document.getElementById("firstName").value = "";

    document.getElementById("lastName").value = "";

    document.getElementById("dob").value = "";

    document.getElementById("phone").value = "";

    const rows =
        document.querySelectorAll("#patientTableBody tr");

    rows.forEach(row=>{

        row.style.display="";

    });

    updateResultCount(rows.length);

}



function formatDateForCompare(date){

    if(!date){

        return "";

    }

    const parts=date.split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}



const filterInputs=document.querySelectorAll(

    "#firstName,#lastName,#dob,#phone"

);

filterInputs.forEach(input=>{

    input.addEventListener("keydown",function(event){

        if(event.key==="Enter"){

            searchPatients();

        }

    });

});




document.addEventListener("click",function(event){

    const button=event.target.closest(".view-btn");

    if(!button){

        return;

    }

    const row=button.closest("tr");

    const patientName=row.cells[1].innerText.trim();

    alert("Opening patient profile for\n\n"+patientName);

});



document.addEventListener("click",function(event){

    const button=event.target.closest(".menu-btn");

    if(!button){

        return;

    }

    alert("More actions coming soon.");

});



const exportButton=document.querySelector(".outline-btn");

if(exportButton){

    exportButton.addEventListener("click",function(){

        alert("Export feature will be connected to Excel/PDF later.");

    });

}


const columnButton=document.querySelectorAll(".outline-btn")[1];

if(columnButton){

    columnButton.addEventListener("click",function(){

        alert("Column customization coming soon.");

    });

}


const paginationButtons=document.querySelectorAll(

    ".pagination button"

);

paginationButtons.forEach(button=>{

    button.addEventListener("click",function(){

        paginationButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        if(

            this.textContent!=="<" &&

            this.textContent!==">"

        ){

            this.classList.add("active");

        }

    });

});