const searchBtn = document.getElementById("patientSearchBtn");
const clearBtn = document.getElementById("patientClearBtn");

const PATIENTS_KEY = "labServicePatients_v1";
const ROOM_DRAFT_KEY = "roomServiceDraft_v1";


const ROOM_LIFECYCLE = [
    "Room/Bed Ready",
    "Reserved",
    "Verify Clean",
    "Admit/Occupied",
    "In Use",
    "Discharge",
    "Waiting for Clean"
];
const RESERVED_STATUS = ROOM_LIFECYCLE[1];



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
    initRoomStep();
    initServicesStep();
    initReviewStep();


    document
        .getElementById("saveDraftBtn")
        .addEventListener("click", saveDraft);

    goToStep(1);

});



const lastNameInput = document.getElementById("patientLastNameSearch");
const dobInput = document.getElementById("patientDobSearch");
const mobileInput = document.getElementById("patientMobileSearch");
const resultsBox = document.getElementById("patientSearchResults");
const searchWrap = document.getElementById("patientSearchWrap");
const selectedBar = document.getElementById("selectedPatientBar");
const switchBtn = document.getElementById("switchProfileBtn");


let debounceTimer = null;

function initPatientSearch() {

    lastNameInput.addEventListener("input", debounceSearch);
    dobInput.addEventListener("change", debounceSearch);
    mobileInput.addEventListener("input", debounceSearch);

    searchBtn.addEventListener("click", searchPatients);

   
    clearBtn.addEventListener("click", clearSearch);

    switchBtn.addEventListener("click", switchProfile);

   
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

    // Swap search area for the selected patient bar
    document.getElementById("selectedPatientName").textContent =
        `${patient.firstName} ${patient.lastName}`;
    document.getElementById("selectedPatientPhone").textContent = patient.phone;

    searchWrap.style.display = "none";
    selectedBar.style.display = "grid";

}

function switchProfile() {

    // Reset search inputs and results
    clearSearch();

    // Clear the populated patient fields so stale data can't be submitted
    [
        "rsPatientId", "firstName", "lastName", "patientDob",
        "patientMRN", "insuranceProvider", "memberId"
    ].forEach(id => {
        document.getElementById(id).value = "";
    });

    document.getElementById("patientGender").selectedIndex = 0;

    // Swap the bar back for the search area
    selectedBar.style.display = "none";
    searchWrap.style.display = "";

    lastNameInput.focus();

}



function saveDraft() {
   
    document
        .getElementById("draftSavedModal")
        .classList.add("show");
}






const ALL_AMENITIES = ["Wi-Fi", "TV", "Recliner", "Fridge", "Phone", "Blinds", "Lamp", "Outlets"];

const ROOM_AMENITY_MAP = {
    "Standard":     ["Wi-Fi", "TV"],
    "Semi-private": ["Wi-Fi", "TV", "Recliner"],
    "Private":      ["Wi-Fi", "TV", "Fridge", "Recliner"],
    "Suite":        ["Wi-Fi", "TV", "Fridge", "Recliner", "Phone", "Lamp"]
};

function updateAmenityCount() {
    const boxes = document.querySelectorAll('.amenity-grid input[type="checkbox"]');
    const checked = document.querySelectorAll('.amenity-grid input[type="checkbox"]:checked');
    document.getElementById("amenityCount").textContent =
        `${checked.length} of ${boxes.length} amenities selected`;
}

function applyRoomDefaults(roomType) {
    const defaults = ROOM_AMENITY_MAP[roomType] || [];
    document.querySelectorAll('.amenity-grid input[type="checkbox"]').forEach(cb => {
        cb.checked = defaults.includes(cb.value);
    });
    document.getElementById("amenityRoomLabel").textContent = `${roomType} Room`;
    updateAmenityCount();
}

function initRoomStep() {
    document.querySelectorAll('input[name="roomType"]').forEach(radio => {
        radio.addEventListener("change", () => applyRoomDefaults(radio.value));
    });

    document.querySelectorAll('.amenity-grid input[type="checkbox"]').forEach(cb => {
        cb.addEventListener("change", updateAmenityCount);
    });

    const notes = document.getElementById("housekeepingNotes");
    const notesCount = document.getElementById("notesCount");
    notes.addEventListener("input", () => {
        notesCount.textContent = `${notes.value.length}/300`;
    });

    [["foodAllergies", "allergiesCount"], ["foodNotes", "foodNotesCount"]].forEach(([fieldId, countId]) => {
        const field = document.getElementById(fieldId);
        const count = document.getElementById(countId);
        field.addEventListener("input", () => {
            count.textContent = `${field.value.length}/300`;
        });
    });

    const checked = document.querySelector('input[name="roomType"]:checked');
    applyRoomDefaults(checked ? checked.value : "Standard");
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

  
    if (currentStep === 1 && !selectedPatient) {
        alert("Please select a patient profile.");
        return;
    }

    saveStepData();

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

    // Mark earlier steps as done (green)
    stepItems.forEach((item, i) =>
        item.classList.toggle("done", i < step - 1)
    );

    // Show current
    document
        .querySelector(`.rs-step-panel[data-step="${step}"]`)
        .classList.add("active");

    stepItems[step - 1].classList.add("active");

    stepCounter.textContent = `Step ${step} of 5`;

    if (step === 4) updateServicesSummary();

    // Back button
    backBtn.style.display =
        step === 1 ? "none" : "inline-flex";

    // Continue / Submit
    if (step === 5) {

        populateReview();

        continueBtn.innerHTML = `
            Confirm Reservation
            <img src="images/send-white.png" alt="">
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
    data.dietaryPreferences = Array.from(
        document.querySelectorAll('input[name="dietType"]:checked')
    ).map(x => x.value);

    data.foodAllergies =
        document.getElementById("foodAllergies")?.value || "";

    data.meals = {
        breakfast: {
            main: document.getElementById("breakfastMain")?.value || "",
            side: document.getElementById("breakfastSide")?.value || "",
            beverage: document.getElementById("breakfastBeverage")?.value || ""
        },
        lunch: {
            main: document.getElementById("lunchMain")?.value || "",
            side: document.getElementById("lunchSide")?.value || "",
            beverage: document.getElementById("lunchBeverage")?.value || ""
        },
        dinner: {
            main: document.getElementById("dinnerMain")?.value || "",
            side: document.getElementById("dinnerSide")?.value || "",
            beverage: document.getElementById("dinnerBeverage")?.value || ""
        }
    };

    data.foodNotes =
        document.getElementById("foodNotes")?.value || "";

    // STEP 4
    data.clinicalServices = Array.from(
        document.querySelectorAll('input[name="clinicalService"]:checked')
    ).map(x => x.value);

    data.hospitalityServices = Array.from(
        document.querySelectorAll('input[name="hospitalityService"]:checked')
    ).map(x => x.value);

    const priority = document.querySelector('input[name="priorityLevel"]:checked');
    data.priorityLevel = priority ? priority.value : "";

    data.careNotes =
        document.getElementById("careNotes")?.value || "";

    localStorage.setItem(
        ROOM_DRAFT_KEY,
        JSON.stringify(data)
    );

}





function updateServicesSummary() {
    const clinical = document.querySelectorAll('input[name="clinicalService"]:checked').length;
    const hospitality = document.querySelectorAll('input[name="hospitalityService"]:checked').length;
    const priority = document.querySelector('input[name="priorityLevel"]:checked');

    document.getElementById("sumClinical").textContent = clinical;
    document.getElementById("sumHospitality").textContent = hospitality;
    document.getElementById("sumPriority").textContent = priority ? priority.value : "-";
}

function initServicesStep() {

    document
        .querySelectorAll('input[name="clinicalService"], input[name="hospitalityService"], input[name="priorityLevel"]')
        .forEach(el => el.addEventListener("change", updateServicesSummary));

    const notes = document.getElementById("careNotes");
    const count = document.getElementById("careNotesCount");
    notes.addEventListener("input", () => {
        count.textContent = `${notes.value.length}/300`;
    });

    updateServicesSummary();

}



const REQUEST_ID = "RSV-GU07BT";


const RESERVED_ROOM = {
    room: "402-B",
    bed: "B",
    ward: "Cardiology",
    floor: "4th Floor"
};

function formatDisplayDate(iso) {
    // "1997-02-10" -> "10-02-1997"
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
}

function formatDateTime(date) {
    // e.g. "May 10, 2025, 03:45 PM"
    return date.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function setText(id, value) {
    document.getElementById(id).textContent = value && String(value).trim() ? value : "—";
}

function fillList(id, items) {
    const ul = document.getElementById(id);
    if (!items || items.length === 0) {
        ul.innerHTML = '<li class="rv-none">None selected</li>';
        return;
    }
    ul.innerHTML = items.map(i => `<li>${escapeHtml(i)}</li>`).join("");
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function mealLine(m) {
    if (!m) return "";
    return [m.main, m.side, m.beverage].filter(Boolean).join(" / ");
}

function populateReview() {

    const d = JSON.parse(localStorage.getItem(ROOM_DRAFT_KEY) || "{}");
    const p = d.patient || {};

    // Patient
    setText("rvName", `${p.firstName || ""} ${p.lastName || ""}`.trim());
    setText("rvMrn", p.mrn);
    setText("rvDob", formatDisplayDate(p.dob));
    setText("rvInsurance", p.insurance
        ? `${p.insurance}${p.memberId ? " (" + p.memberId + ")" : ""}` : "");
    setText("rvAdmission", d.admissionDate
        ? formatDisplayDate(d.admissionDate) +
          (d.expectedDischarge ? " to " + formatDisplayDate(d.expectedDischarge) : "")
        : "");

    const dept = document.getElementById("attendingPhysicianDepartment")?.value.trim();
    setText("rvPhysician", [d.physician, dept].filter(Boolean).join(", "));

    // Room
    setText("rvRoom", RESERVED_ROOM.room);
    setText("rvBed", RESERVED_ROOM.bed);
    setText("rvWard", RESERVED_ROOM.ward);
    setText("rvFloor", RESERVED_ROOM.floor);
    setText("rvRoomType", d.roomType || "Standard");
    setText("rvAmenities", (d.amenities || []).join(", "));
    const hk = [d.cleaningTime, d.cleaningFrequency].filter(Boolean).join(", ");
    setText("rvHousekeeping", hk);

    // Meals
    setText("rvDiet", (d.dietaryPreferences || []).join(", "));
    setText("rvAllergies", d.foodAllergies);
    const meals = d.meals || {};
    setText("rvBreakfast", mealLine(meals.breakfast));
    setText("rvLunch", mealLine(meals.lunch));
    setText("rvDinner", mealLine(meals.dinner));
    setText("rvMealNotes", d.foodNotes);

    // Services
    fillList("rvClinical", d.clinicalServices);
    fillList("rvHospitality", d.hospitalityServices);
    setText("rvPriority", d.priorityLevel);
    setText("rvCareNotes", d.careNotes);

}

function initReviewStep() {

    // Edit links jump back to the relevant step
    document.querySelectorAll(".rv-edit[data-goto]").forEach(btn => {
        btn.addEventListener("click", () => goToStep(Number(btn.dataset.goto)));
    });

    document
        .querySelectorAll("#consentAccurate, #consentArrangements, #consentAuthorize")
        .forEach(cb => cb.addEventListener("change", () => {
            document.querySelector(".rv-consent").classList.remove("rv-invalid");
        }));

}

function validateReview() {

    const consentOk = ["consentAccurate", "consentArrangements", "consentAuthorize"]
        .every(id => document.getElementById(id).checked);

    document.querySelector(".rv-consent").classList.toggle("rv-invalid", !consentOk);

    if (!consentOk) {
        alert("Please accept all consent and authorization statements.");
        return false;
    }

    return true;

}

function submitRoomRequest() {

    if (!validateReview()) return;

    saveStepData();

    const data = JSON.parse(localStorage.getItem(ROOM_DRAFT_KEY) || "{}");
    data.requestId = REQUEST_ID;
    data.submittedAt = new Date().toISOString();
    data.status = RESERVED_STATUS;

    // Keep a list of submitted requests and clear the working draft
    const SUBMITTED_KEY = "roomServiceSubmitted_v1";
    const submitted = JSON.parse(localStorage.getItem(SUBMITTED_KEY) || "[]");
    submitted.push(data);
    localStorage.setItem(SUBMITTED_KEY, JSON.stringify(submitted));
    localStorage.removeItem(ROOM_DRAFT_KEY);

    // System-generated details are shown only after confirmation
    const p = data.patient || {};
    setText("rvRequestId", REQUEST_ID);
    setText("rvReservationPatient", `${p.firstName || ""} ${p.lastName || ""}`.trim());
    setText("rvReservationRoom", `${RESERVED_ROOM.room} / Bed ${RESERVED_ROOM.bed}`);
    setText("rvSubmittedOn", formatDateTime(new Date(data.submittedAt)));
    setText("rvStatus", RESERVED_STATUS);
    document.getElementById("submitModal").classList.add("show");

}

function closeModal(id){
    document.getElementById(id).classList.remove("show");
}