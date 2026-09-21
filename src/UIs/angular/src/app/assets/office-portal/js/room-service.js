const searchBtn = document.getElementById("patientSearchBtn");
const clearBtn = document.getElementById("patientClearBtn");

const PATIENTS_KEY = "labServicePatients_v1";
const ROOM_DRAFT_KEY = "roomServiceDraft_v1";



function seedPatients() {
    return [
        {
            id: "p1",
            mrn: "MRN-000001",
            firstName: "Rajesh",
            lastName: "Sharma",
            dob: "1990-05-12",
            gender: "Male",
            phone: "9998887770",
            insurance: "Star Health",
            memberId: "SH-778215"
        },
        {
            id: "p2",
            mrn: "MRN-000002",
            firstName: "Harshit",
            lastName: "Bhardwaj",
            dob: "1997-02-10",
            gender: "Male",
            phone: "9123456780",
            insurance: "Star Health",
            memberId: "SH-778215"
        },
        {
            id: "p3",
            mrn: "MRN-000003",
            firstName: "Kavya",
            lastName: "Bhardwaj",
            dob: "2000-07-21",
            gender: "Female",
            phone: "9123456781",
            insurance: "Care Plus",
            memberId: "CP-552310"
        }
    ];
}

function loadPatients() {

    const raw = localStorage.getItem(PATIENTS_KEY);

    if (!raw) {
        const data = seedPatients();
        localStorage.setItem(PATIENTS_KEY, JSON.stringify(data));
        return data;
    }

    return JSON.parse(raw);

}

const patients = loadPatients();
let selectedPatient = null;



document.addEventListener("DOMContentLoaded", () => {

    initPatientSearch();
    

    document
        .getElementById("saveDraftBtn")
        .addEventListener("click", saveDraft);

    goToStep(1);

});



const lastNameInput = document.getElementById("patientLastNameSearch");
const dobInput = document.getElementById("patientDobSearch");
const mobileInput = document.getElementById("patientMobileSearch");
const resultsBox = document.getElementById("patientSearchResults");


let debounceTimer = null;

function initPatientSearch() {

    lastNameInput.addEventListener("input", debounceSearch);
    dobInput.addEventListener("change", debounceSearch);
    mobileInput.addEventListener("input", debounceSearch);

    searchBtn.addEventListener("click", searchPatients);

   
    clearBtn.addEventListener("click", clearSearch);

   
    document.addEventListener("click", (e) => {

        if (
            !e.target.closest(".rs-search-layout") &&
            !e.target.closest("#patientSearchResults")
        ) {
            resultsBox.classList.remove("show");
        }

    });

}

function debounceSearch() {

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchPatients, 250);

}

function searchPatients() {

    const ln = lastNameInput.value.trim().toLowerCase();
    const dob = dobInput.value;
    const phone = mobileInput.value.replace(/\D/g, "");

    if (!ln && !dob && !phone) {
        resultsBox.innerHTML = "";
        resultsBox.classList.remove("show");
        return;
    }

    const filtered = patients.filter(p => {

        const lastDob =
            ln !== "" &&
            p.lastName.toLowerCase().includes(ln) &&
            (dob === "" || p.dob === dob);

        const phoneMatch =
            phone !== "" &&
            p.phone.includes(phone);

        return lastDob || phoneMatch;

    });

    renderPatientResults(filtered);

}

function renderPatientResults(list) {

    resultsBox.classList.add("show");

    if (list.length === 0) {

        resultsBox.innerHTML = `
            <div class="rs-empty-result">
                No Matching Record Found
            </div>`;

        return;
    }

    resultsBox.innerHTML = list.map(p => `

        <div class="rs-result-item">

            <div class="rs-result-left">

                <div class="rs-result-avatar">
                    <img src="images/profile-outline.png" alt="">
                </div>

                <div>

                    <div class="rs-result-name">
                        ${p.firstName} ${p.lastName}
                    </div>

                    <div class="rs-result-meta">
                        ${p.phone} • ${p.mrn}
                    </div>

                </div>

            </div>

            <button class="btn-select" data-id="${p.id}">
                Select Patient
            </button>

        </div>

    `).join("");

    document.querySelectorAll(".btn-select").forEach(btn => {

        btn.onclick = () => {

            const patient = patients.find(
                x => x.id === btn.dataset.id
            );

            populatePatient(patient);

        };

    });

}

function clearSearch() {

    lastNameInput.value = "";
    dobInput.value = "";
    mobileInput.value = "";

    resultsBox.innerHTML = "";
    resultsBox.classList.remove("show");

    selectedPatient = null;

}



function populatePatient(patient) {

    selectedPatient = patient;

    document.getElementById("rsPatientId").value = patient.id;

    document.getElementById("firstName").value = patient.firstName;
    document.getElementById("lastName").value = patient.lastName;
    document.getElementById("patientDob").value = patient.dob;
    document.getElementById("patientGender").value = patient.gender;
    document.getElementById("patientMRN").value = patient.mrn;
    document.getElementById("insuranceProvider").value = patient.insurance || "";
    document.getElementById("memberId").value = patient.memberId || "";

    // Sync search fields
    lastNameInput.value = patient.lastName;
    dobInput.value = patient.dob;
    mobileInput.value = patient.phone;

    resultsBox.innerHTML = "";
    resultsBox.classList.remove("show");

}



function saveDraft() {
   
    document
        .getElementById("draftSavedModal")
        .classList.add("show");
}




let currentStep = 1;

const stepPanels = document.querySelectorAll(".rs-step-panel");
const stepItems = document.querySelectorAll(".rs-step");

const backBtn = document.getElementById("backBtn");
const continueBtn = document.getElementById("continueBtn");
const stepCounter = document.getElementById("stepCounter");

continueBtn.addEventListener("click", nextStep);
backBtn.addEventListener("click", previousStep);

function nextStep() {

  
    if (currentStep === 1) {

        if (!selectedPatient) {
            alert("Please select a patient profile.");
            return;
        }

        saveStepData();
    }

    if (currentStep < 5) {
        goToStep(currentStep + 1);
    } else {
        submitRoomRequest();
    }

}

function previousStep() {

    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }

}

function goToStep(step) {

    currentStep = step;

    // Hide all panels
    stepPanels.forEach(panel =>
        panel.classList.remove("active")
    );

    // Remove active step
    stepItems.forEach(item =>
        item.classList.remove("active")
    );

    // Show current
    document
        .querySelector(`.rs-step-panel[data-step="${step}"]`)
        .classList.add("active");

    stepItems[step - 1].classList.add("active");

    stepCounter.textContent = `Step ${step} of 5`;

    // Back button
    backBtn.style.display =
        step === 1 ? "none" : "inline-flex";

    // Continue / Submit
    if (step === 5) {

        continueBtn.innerHTML = `
            Submit
            <img src="images/check-white.png" alt="">
        `;

    } else {

        continueBtn.innerHTML = `
            Continue
            <img src="images/arrow-right.png" alt="">
        `;

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function saveStepData() {

    const data = JSON.parse(
        localStorage.getItem(ROOM_DRAFT_KEY) || "{}"
    );

    data.patient = selectedPatient;

    data.admissionDate =
        document.getElementById("admissionDate").value;

    data.expectedDischarge =
        document.getElementById("expectedDischarge").value;

    data.patientContact =
        document.getElementById("patientContact").value;

    data.emergencyName =
        document.getElementById("emergencyName").value;

    data.emergencyPhone =
        document.getElementById("emergencyPhone").value;

    data.physician =
        document.getElementById("attendingPhysician").value;

    // STEP 2
    const room = document.querySelector(
        'input[name="roomType"]:checked'
    );

    data.roomType = room ? room.value : "";

    data.cleaningTime =
        document.getElementById("cleaningTime")?.value || "";

    data.cleaningFrequency =
        document.getElementById("cleaningFrequency")?.value || "";

    data.housekeepingNotes =
        document.getElementById("housekeepingNotes")?.value || "";

    // Amenities
    data.amenities = Array.from(
        document.querySelectorAll(
            '.amenity-grid input[type="checkbox"]:checked'
        )
    ).map(x => x.value);

    // STEP 3
    const diet = document.querySelector(
        'input[name="dietType"]:checked'
    );

    data.dietType = diet ? diet.value : "";

    data.breakfast =
        document.getElementById("breakfastTime")?.value || "";

    data.lunch =
        document.getElementById("lunchTime")?.value || "";

    data.dinner =
        document.getElementById("dinnerTime")?.value || "";

    data.snack =
        document.getElementById("snackTime")?.value || "";

    data.foodNotes =
        document.getElementById("foodNotes")?.value || "";

    localStorage.setItem(
        ROOM_DRAFT_KEY,
        JSON.stringify(data)
    );

}



function submitRoomRequest() {

    saveStepData();

    alert("Room Service Request Submitted!");

}

function closeModal(id){
    document.getElementById(id).classList.remove("show");
}