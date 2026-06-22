

const messages = [

{
id:1,
date:"2026-05-01",
time:"10:30 AM",
title:"Refill due in 3 days for Metformin 500mg",
type:"Medication Reminder",
description:"This is a reminder to refill your prescription for Metformin 500mg.",
doctor:"Dr Arun",
icon:"images/medicine-icon.png",
archived:false
},

{
id:2,
date:"2026-05-05",
time:"04:15 PM",
title:"Your order #12345 is out for delivery",
type:"Order Update",
description:"Your medicine order #12345 is on the way and will be delivered soon.",
doctor:"Dr Doss",
icon:"images/transit-icon2.png",
archived:false
},

{
id:3,
date:"2026-05-15",
time:"04:15 PM",
title:"Your order #12345 is on the way",
type:"Order Update",
description:"Your medicine order #12345 is on the way and will be delivered soon.",
doctor:"Dr Ross",
icon:"images/transit-icon2.png",
archived:false
}


];

let currentTab = "all";
let searchValue = "";
let filterValue = "all";
let deleteMessageId = null;



function archiveMessage(id){

    const message =
    messages.find(m => m.id === id);

    message.archived = true;

    render();
}

function unarchiveMessage(id){

    const message =
    messages.find(m => m.id === id);

    message.archived = false;

    render();
}

function render(){

    const container =
    document.getElementById(
        "messagesContainer"
    );

    container.innerHTML = "";

    let filteredMessages;

   filteredMessages =
messages.filter(message=>{

    const tabMatch =
    currentTab === "all"
    ? !message.archived
    : message.archived;

    const searchMatch =
    message.title
    .toLowerCase()
    .includes(searchValue)
    ||
    message.description
    .toLowerCase()
    .includes(searchValue)
    ||
    message.doctor
    .toLowerCase()
    .includes(searchValue);

    const filterMatch =
    filterValue === "all"
    ||
    message.type === filterValue;

    return (
        tabMatch &&
        searchMatch &&
        filterMatch
    );

});

    filteredMessages.forEach(message=>{

        container.innerHTML += `

        <div class="message-row">

            <div class="message-date">
                <h5>${message.date}</h5>
                <p>${message.time}</p>
            </div>

            <div class="message-details">

                <img src="${message.icon}" alt="">

                <div>

                    <h4>${message.title}</h4>

                    <span class="message-tag">
                        ${message.type}
                    </span>

                    <p>${message.description}</p>

                </div>

            </div>

            <div class="doctor-info">

                <img src="images/doctor-icon.png">

                <span>${message.doctor}</span>

            </div>

                           <div class="message-actions">

                            ${
                            message.archived
                            ?
                            `
                            <button
                            onclick="unarchiveMessage(${message.id})"
                            class="archive-btn">

                            Unarchive

                            </button>

                            <button
                            onclick="deleteMessage(${message.id})"
                            class="delete-btn">

                            🗑

                            </button>
                            `
                            :
                            `
                            <button
                            onclick="archiveMessage(${message.id})"
                            class="archive-btn">

                            Archive

                            </button>
                            `
                            }

                            </div>

            

        </div>

        `;

    });

    updateCounts();
}


function switchTab(tab){

    currentTab = tab;

    document
    .querySelectorAll(".tab")
    .forEach(btn =>
        btn.classList.remove("active")
    );

    if(tab === "all"){
        document
        .querySelectorAll(".tab")[0]
        .classList.add("active");
    }else{
        document
        .querySelectorAll(".tab")[1]
        .classList.add("active");
    }

    render();
}




function updateCounts(){

    document.getElementById(
        "allCount"
    ).innerText =
    messages.filter(
        m => !m.archived
    ).length;

    document.getElementById(
        "archiveCount"
    ).innerText =
    messages.filter(
        m => m.archived
    ).length;
}


document
.getElementById("searchInput")
.addEventListener("input",(e)=>{

    searchValue =
    e.target.value.toLowerCase();

    render();

});

document
.getElementById("filterSelect")
.addEventListener("change",(e)=>{

    filterValue =
    e.target.value;

    render();

});

function deleteMessage(id){

    deleteMessageId = id;

    document
    .getElementById("deleteModal")
    .classList.add("show");
}

function closeDeleteModal(){

    deleteMessageId = null;

    document
    .getElementById("deleteModal")
    .classList.remove("show");
}


document
.getElementById("confirmDeleteBtn")
.addEventListener("click",()=>{

    if(deleteMessageId === null) return;

    const index =
    messages.findIndex(
        m => m.id === deleteMessageId
    );

    if(index !== -1){

        messages.splice(index,1);

    }

    closeDeleteModal();

    render();

});

render();