let hasSearched = false;




const patients=[

    {

        firstName:"Ravi",

        lastName:"Kumar",

        age:25,

        dob:"01/04/2001",

        gender:"Male",

        phone:"+91 98765 43210",

        email:"ravi.kumar@email.com",

        address:"123 MG Road, Delhi",

        lastVisit:"10 Jul 2026",

        avatar:"RK",

        avatarColor:"blue"

    },

    {

        firstName:"Lakshmi",

        lastName:"Patel",

        age:24,

        dob:"04/01/2001",

        gender:"Female",

        phone:"+91 91234 56789",

        email:"lakshmi.patel@email.com",

        address:"45 Park Street, Mumbai",

        lastVisit:"08 Jul 2026",

        avatar:"LP",

        avatarColor:"green"

    },

    {

        firstName:"Rahul",

        lastName:"Singh",

        age:28,

        dob:"15/06/1998",

        gender:"Male",

        phone:"+91 99887 76655",

        email:"rahul.singh@email.com",

        address:"78 Civil Lines, Kanpur",

        lastVisit:"07 Jul 2026",

        avatar:"RS",

        avatarColor:"purple"

    }

];

let filteredPatients=[...patients];

const rowsPerPage=25;

let currentPage=1;

document.addEventListener("DOMContentLoaded", () => {

filteredPatients = [];

renderPatients(filteredPatients);

updateResultCount(0);

updatePagination();

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
    setupEnterKeySearch();

}



function setupEnterKeySearch(){

    const filterInputs=document.querySelectorAll(

        "#firstName,#lastName,#dob,#phone"

    );

    filterInputs.forEach(input=>{

        input.addEventListener("keydown",function(event){

            if(event.key==="Enter"){

                event.preventDefault();

                searchPatients();

            }

        });

    });

}



function setupSearch(){

    const searchButton = document.getElementById("searchPatientBtn");

    if(!searchButton){

        return;

    }

    searchButton.addEventListener("click", searchPatients);

}

function searchPatients(){

    hasSearched = true;

    const firstName=
        document.getElementById("firstName")
        .value
        .trim()
        .toLowerCase();

    const lastName=
        document.getElementById("lastName")
        .value
        .trim()
        .toLowerCase();

    const dob=
        document.getElementById("dob")
        .value;

    const phone=
        document.getElementById("phone")
        .value
        .trim()
        .toLowerCase();

    filteredPatients=patients.filter(patient=>{

        let show=true;

        if(

            firstName &&

            !patient.firstName
            .toLowerCase()
            .includes(firstName)

        ){

            show=false;

        }

        if(

            lastName &&

            !patient.lastName
            .toLowerCase()
            .includes(lastName)

        ){

            show=false;

        }

        if(

            phone &&

            !patient.phone
            .toLowerCase()
            .includes(phone)

        ){

            show=false;

        }

        if(dob){

            if(

                patient.dob!==

                formatDateForCompare(dob)

            ){

                show=false;

            }

        }

        return show;

    });

    currentPage=1;

   renderPatients(filteredPatients);

    updateResultCount(filteredPatients.length);

    updatePagination();

}



function updateResultCount(count){

    const badge =
        document.querySelector(".result-count");

    if(badge){

        badge.textContent =
            `${count} Patients Found`;

    }

}

function updatePagination(){

    const totalPages=

        Math.max(

            1,

            Math.ceil(

                filteredPatients.length/

                rowsPerPage

            )

        );

    document.getElementById(

        "pageNumber"

    ).textContent=

        `Page ${currentPage} of ${totalPages}`;

    document.getElementById(

        "previousPage"

    ).disabled=

        currentPage===1;

    document.getElementById(

        "nextPage"

    ).disabled=

        currentPage===totalPages;

    updateShowingResults();

}


function updateShowingResults(){

    const showing=

        document.getElementById(

            "showingResults"

        );

    if(filteredPatients.length===0){

        showing.textContent=

            "Showing 0 to 0 of 0 results";

        return;

    }

    const start=

        (currentPage-1)*rowsPerPage+1;

    const end=

        Math.min(

            currentPage*rowsPerPage,

            filteredPatients.length

        );

    showing.textContent=

        `Showing ${start} to ${end} of ${filteredPatients.length} results`;

}


function previousPage(){

    if(currentPage===1){

        return;

    }

    currentPage--;

    renderPatients(filteredPatients);

    updatePagination();

}


function nextPage(){

    const totalPages=

        Math.max(

            1,

            Math.ceil(

                filteredPatients.length/

                rowsPerPage

            )

        );

    if(currentPage>=totalPages){

        return;

    }

    currentPage++;

    renderPatients(filteredPatients);

    updatePagination();

}


function renderPatients(patientList){

    const tbody=
        document.getElementById(
            "patientTableBody"
        );

    tbody.innerHTML="";

    if(patientList.length===0){

        tbody.innerHTML=`

            <tr>

                <td
                    colspan="9"
                    class="empty-state">

                    <img
                        src="images/search.png">

                   <h3>

    ${hasSearched
        ? "No Matching Records Found"
        : "Search to View Results"}

</h3>

<p>

    ${hasSearched
        ? "Try modifying your search criteria and search again."
        : "Enter one or more search criteria above and click Search to view matching patient records."}

</p>

                </td>

            </tr>

        `;

        return;

    }


    
    const start =
    (currentPage - 1) * rowsPerPage;

const end =
    start + rowsPerPage;

patientList
    .slice(start, end)
    .forEach((patient, index) => {

        tbody.innerHTML+=`

            <tr>

                <td>

                    ${start+index+1}

                </td>

                <td>

                    <div class="patient-cell">

                        <div class="avatar ${patient.avatarColor}">

                            ${patient.avatar}

                        </div>

                        <div>

                            <h4>

                                ${patient.firstName}

                                ${patient.lastName}

                            </h4>

                            <span>

                                Age: ${patient.age} Years

                            </span>

                        </div>

                    </div>

                </td>

                <td>

                    ${patient.dob}

                </td>

                <td>

                    <span class="gender ${patient.gender.toLowerCase()}">

                        ${patient.gender}

                    </span>

                </td>

                <td>

                    ${patient.phone}

                </td>

                <td>

                    ${patient.email}

                </td>

                <td>

                    ${patient.address}

                </td>

                <td>

                    ${patient.lastVisit}

                </td>

                <td>

                    <div class="action-buttons">

                        <button
    class="view-btn"
    data-index="${start+index}">

                            <img
    src="images/view.png"
    alt="View">

                            View

                        </button>

                        <button
    class="menu-btn"
    data-index="${start+index}">

                           <img
    src="images/menu.png"
    alt="More">

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}




function setupClearFilters(){




    const clearButton = document.getElementById("clearFilters");

    if(!clearButton){

        return;

    }

    clearButton.addEventListener("click", clearFilters);

}


function clearFilters(){

    document.getElementById("firstName").value="";

    document.getElementById("lastName").value="";

    document.getElementById("dob").value="";

    document.getElementById("phone").value="";

    filteredPatients = [];

    currentPage=1;

    hasSearched = false;

    renderPatients(filteredPatients);

updateResultCount(filteredPatients.length);

updatePagination();

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

            event.preventDefault();

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

document.getElementById(

    "previousPage"

).addEventListener(

    "click",

    previousPage

);

document.getElementById(

    "nextPage"

).addEventListener(

    "click",

    nextPage

);