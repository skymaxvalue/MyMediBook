let insuranceData = null;
let paymentData = null;
let insuranceChoice = null;
let phoneIti = null;

const PATIENTS_KEY = "savedPatients_v4";

let allPatients = [];
let selectedPatientId = null;
let currentPatientType = "existing";

function initializePhoneInput() {
    const phoneInput = document.getElementById("phone");
    if (!phoneInput || typeof window.intlTelInput !== "function") return null;

    return window.intlTelInput(phoneInput, {
        initialCountry: "in",
        separateDialCode: true,
        preferredCountries: ["in", "us", "gb"],
        nationalMode: true,
        autoPlaceholder: "polite"
    });
}

function seedPatients() {
    return [
        { id: "p1", firstName: "Rajesh", lastName: "Sharma", relation: "Self", dob: "1990-05-12", age: "35", ageType: "years", gender: "Male",
          savedInsurance: { provider: "Star Health", policy: "SH-778215", groupId: "GRP-1042", holderName: "Rajesh Sharma", insuranceAddress: "204 MG Road, Bengaluru" } },
        { id: "p2", firstName: "Harshit", lastName: "Bhardwaj", relation: "Sibling", dob: "1997-02-10", age: "28", ageType: "years", gender: "Male",
          savedPayment: { paymentType: "Credit Card", cardHolder: "Harshit Bhardwaj", cardNumber: "**** **** **** 4821", expiry: "09/28", cvv: "***" } },
        { id: "p3", firstName: "K", lastName: "Bhardwaj", relation: "Sibling", dob: "2000-07-21", age: "25", ageType: "years", gender: "Female" }
    ];
}

function loadPatients() {
    const raw = localStorage.getItem(PATIENTS_KEY);

    if (!raw) {
        const seeded = seedPatients();
        localStorage.setItem(PATIENTS_KEY, JSON.stringify(seeded));
        return seeded;
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : seedPatients();
    } catch (e) {
        return seedPatients();
    }
}

function savePatients(list) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(list));
}

function getSelectedPatientRecord() {
    if (currentPatientType !== "existing" || !selectedPatientId) return null;
    return allPatients.find(p => p.id === selectedPatientId) || null;
}

function resetInsuranceSelection() {
    insuranceChoice = null;
    insuranceData = null;
    paymentData = null;

    document.querySelectorAll('input[name="insurance"]').forEach(r => {
        r.checked = false;
        r.parentElement.style.color = "";
    });
}

// Patient Details stays locked whenever we're not actively in the "Add
// New Patient" flow — that covers both "no Patient Type chosen yet" and
// "Select Existing Patient" (where the fields are only ever populated
// from a picked record, never typed by hand).
function applyPatientTypeLocks(type) {
    const patientDetailsDisabled = (type !== "new");

    document.querySelectorAll(".patient-details-grid input, .patient-details-grid select")
        .forEach(el => { el.disabled = patientDetailsDisabled; });

    setContactSectionDisabled(type === null);
}

function setContactSectionDisabled(disabled) {
    const contactGrid = document.getElementById("contactDetailsGrid");
    if (!contactGrid) return;

    contactGrid.querySelectorAll("input, select, textarea").forEach(el => {
        el.disabled = disabled;
    });
}

// The Account Holder question only ever applies to the "Add New Patient"
// flow — existing patients keep using their already-recorded relation,
// with no Account Holder / Relationship fields shown at all.
function updateAccountHolderUI(patientType) {
    const holderQuestion = document.getElementById("accountHolderQuestion");
    const holderRadios = document.querySelectorAll('input[name="accountHolder"]');

    if (patientType !== "new") {
        holderQuestion.hidden = true;
        holderRadios.forEach(r => {
            r.checked = false;
            r.disabled = true;
        });
        updateAccountHolderDetailsVisibility(null);
        return;
    }

    holderQuestion.hidden = false;
    holderRadios.forEach(r => { r.disabled = false; });

    let chosen = document.querySelector('input[name="accountHolder"]:checked');

    // "This Patient" is the default the moment this section becomes
    // visible with nothing chosen yet — not left blank.
    if (!chosen) {
        const selfRadio = document.querySelector('input[name="accountHolder"][value="self"]');
        if (selfRadio) {
            selfRadio.checked = true;
            chosen = selfRadio;
        }
    }

    updateAccountHolderDetailsVisibility(chosen ? chosen.value : null);
}

function updateAccountHolderDetailsVisibility(value) {
    const holderDetails = document.getElementById("accountHolderDetails");
    const holderNameInput = document.getElementById("accountHolderName");
    const relationSelect = document.getElementById("relationToPatient");

    if (value === "other") {
        holderDetails.hidden = false;
        holderNameInput.disabled = false;
        relationSelect.disabled = false;
        holderNameInput.required = true;
        relationSelect.required = true;
    } else {
        holderDetails.hidden = true;
        holderNameInput.disabled = true;
        relationSelect.disabled = true;
        holderNameInput.required = false;
        relationSelect.required = false;
        holderNameInput.value = "";
        relationSelect.value = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    const dobInput = document.getElementById("dateOfBirth");

    allPatients = loadPatients();

    // ---- Patient profile picker (modal) ----
    const patientDropdown = document.getElementById("patientDropdown");
    const trigger = document.getElementById("patientDropdownTrigger");
    const modal = document.getElementById("selectPatientModal");
    const label = document.getElementById("patientDropdownLabel");
    const searchInput = document.getElementById("patientSearchInput");
    const dobFilter = document.getElementById("patientDobFilter");
    const listEl = document.getElementById("patientList");
    const confirmBtn = document.getElementById("selectPatientConfirmBtn");
    const profileRow = [
        document.getElementById("patientProfileLabel"),
        patientDropdown
    ];
    let highlightedPatient = null;

    function setPatientTypeUI(type) {
        if (type === "new") {
            profileRow.forEach(el => el.style.display = "none");
        } else {
            profileRow.forEach(el => el.style.display = "");
        }
    }

    setPatientTypeUI(currentPatientType);
    applyPatientTypeLocks(currentPatientType);
    updateAccountHolderUI(currentPatientType);

    function formatDob(iso) {
        if (!iso) return "unknown";
        const [y, m, d] = iso.split("-");
        return `${d}-${m}-${y}`;
    }

    function setHighlighted(p) {
        highlightedPatient = p;
        confirmBtn.disabled = !p;

        listEl.querySelectorAll(".patient-item").forEach(el => {
            el.classList.toggle("best-match", el.dataset.id === (p ? p.id : ""));
        });
    }

    function renderPatientList(list) {
        listEl.innerHTML = "";
        highlightedPatient = null;
        confirmBtn.disabled = true;

        if (!list.length) {
            listEl.innerHTML = '<div class="patient-item-empty">No matching patients found</div>';
            return;
        }

        list.forEach(p => {
            const item = document.createElement("div");
            item.className = "patient-item";
            item.dataset.id = p.id;
            item.innerHTML = `
                <span class="patient-item-avatar">&#128100;</span>
                <div class="patient-item-details">
                    <p class="patient-item-name">${p.firstName} ${p.lastName}</p>
                    <p class="patient-item-relation">DOB ${formatDob(p.dob)} &middot; ${p.relation}</p>
                </div>
                <span class="match-badge">Best match</span>`;
            item.addEventListener("click", () => setHighlighted(p));
            listEl.appendChild(item);
        });

        if (list.length === 1) {
            setHighlighted(list[0]);
        }
    }

    function applyFilters() {
        const q = searchInput.value.trim().toLowerCase();
        const dobValue = dobFilter.value;

        if (!q && !dobValue) {
            listEl.innerHTML = '<div class="patient-item-empty">Enter a name or date of birth to search</div>';
            highlightedPatient = null;
            confirmBtn.disabled = true;
            return;
        }

        const filtered = allPatients.filter(p =>
            (!q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)) &&
            (!dobValue || p.dob === dobValue)
        );

        renderPatientList(filtered);
    }

    function openPatientModal() {
        modal.style.display = "flex";
        searchInput.value = "";
        dobFilter.value = "";
        listEl.innerHTML = '<div class="patient-item-empty">Enter a name or date of birth to search</div>';
        highlightedPatient = null;
        confirmBtn.disabled = true;
        searchInput.focus();
    }

    function selectPatient(p) {
        selectedPatientId = p.id;
        resetInsuranceSelection();

        // Picking a profile from this dropdown IS choosing an existing
        // patient — keep currentPatientType in sync even if the "Select
        // Existing Patient" radio was never explicitly clicked, otherwise
        // getSelectedPatientRecord() can't find saved insurance/payment.
        currentPatientType = "existing";
        const existingRadio = document.querySelector('input[name="patientType"][value="existing"]');
        if (existingRadio) existingRadio.checked = true;
        applyPatientTypeLocks("existing");
        updateAccountHolderUI("existing");

        document.getElementById("firstName").value = p.firstName;
        document.getElementById("lastName").value = p.lastName;
        document.getElementById("dateOfBirth").value = p.dob;

        const ageTypeRadio = document.querySelector(`input[name="ageType"][value="${p.ageType}"]`);
        if (ageTypeRadio) ageTypeRadio.checked = true;

        document.getElementById("age").value = p.age;
        document.getElementById("gender").value = p.gender;

        label.textContent = `${p.firstName} ${p.lastName}`;
        label.classList.add("filled");

        modal.style.display = "none";
        updateAgeFromDob();
    }

    trigger.addEventListener("click", openPatientModal);

    searchInput.addEventListener("input", applyFilters);
    dobFilter.addEventListener("change", applyFilters);

    confirmBtn.addEventListener("click", () => {
        if (highlightedPatient) {
            selectPatient(highlightedPatient);
        }
    });

    // ---- Patient Type: existing vs new ----
    function clearPatientDetailFields() {
        selectedPatientId = null;
        resetInsuranceSelection();

        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("dateOfBirth").value = "";

        const ageInput = document.getElementById("age");
        ageInput.value = "";
        ageInput.disabled = false;
        ageInput.readOnly = false;

        document.querySelectorAll('input[name="ageType"]').forEach(r => r.checked = false);

        document.getElementById("gender").value = "";

        document.querySelectorAll('input[name="accountHolder"]').forEach(r => r.checked = false);
        document.getElementById("accountHolderName").value = "";
        document.getElementById("relationToPatient").value = "";

        label.textContent = "Select Patient";
        label.classList.remove("filled");
    }

    document.querySelectorAll('input[name="patientType"]').forEach(radio => {
        radio.addEventListener("change", function () {
            currentPatientType = this.value;

            if (this.value === "new") {
                modal.style.display = "none";
                clearPatientDetailFields();
            }

            setPatientTypeUI(this.value);
            applyPatientTypeLocks(this.value);
            updateAccountHolderUI(this.value);
        });
    });

    document.querySelectorAll('input[name="accountHolder"]').forEach(radio => {
        radio.addEventListener("change", function () {
            updateAccountHolderDetailsVisibility(this.value);
        });
    });

    // ---- Form submit ----
    form.addEventListener("submit", function (e) {

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        e.preventDefault();

        const patientType = (document.querySelector('input[name="patientType"]:checked') || {}).value || "existing";

        if (patientType === "new") {
            const ageTypeChecked = document.querySelector('input[name="ageType"]:checked');

            const accountHolderChoice = (document.querySelector('input[name="accountHolder"]:checked') || {}).value || "self";
            const isOtherHolder = accountHolderChoice === "other";

            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;

            const accountHolderName = isOtherHolder
                ? document.getElementById("accountHolderName").value
                : `${firstName} ${lastName}`.trim();

            const relationToPatient = isOtherHolder
                ? document.getElementById("relationToPatient").value
                : "Self";

            const newPatient = {
                id: "p" + Date.now(),
                firstName,
                lastName,
                relation: relationToPatient,
                accountHolder: accountHolderChoice,
                accountHolderName,
                dob: document.getElementById("dateOfBirth").value,
                age: document.getElementById("age").value,
                ageType: ageTypeChecked ? ageTypeChecked.value : "years",
                gender: document.getElementById("gender").value
            };

            allPatients.push(newPatient);
            savePatients(allPatients);
            selectedPatientId = newPatient.id;
        }

        confirmBooking();

    });




    const radios =
    document.querySelectorAll('input[name="insurance"]');

    radios.forEach(radio => {

        radio.addEventListener("change", function () {

            insuranceChoice = this.value;

            if (this.value === "yes") {

                // Switching to Yes invalidates any payment info collected
                // from a previous "No" pass — don't carry it forward.
                paymentData = null;

                const noRadio = document.querySelector('input[name="insurance"][value="no"]');
                if (noRadio) noRadio.parentElement.style.color = "";

                const patient = getSelectedPatientRecord();

                if (patient && patient.savedInsurance) {
                    openSavedInfoModal("insurance", patient);
                } else {
                    document.getElementById(
                        "insuranceModal"
                    ).style.display = "flex";
                }

            }

            if (this.value === "no") {

                // Switching to No invalidates any insurance info collected
                // from a previous "Yes" pass — don't carry it forward.
                insuranceData = null;

                const yesRadio = document.querySelector('input[name="insurance"][value="yes"]');
                if (yesRadio) yesRadio.parentElement.style.color = "";

                const patient = getSelectedPatientRecord();

                if (patient && patient.savedPayment) {
                    openSavedInfoModal("payment", patient);
                } else {
                    document.getElementById(
                        "paymentModal"
                    ).style.display = "flex";
                }

            }

        });

    });




    dobInput.addEventListener(
        "change",
        updateAgeFromDob
    );

    setupPermanentAddress();
    phoneIti = initializePhoneInput();

});





let pendingSavedInfoType = null;
let pendingSavedInfoPatient = null;

function openSavedInfoModal(type, patient) {

    pendingSavedInfoType = type;
    pendingSavedInfoPatient = patient;

    const title = document.getElementById("savedInfoTitle");
    const text = document.getElementById("savedInfoText");
    const card = document.getElementById("savedInfoCard");
    const useSavedBtn = document.getElementById("useSavedInfoBtn");

   if (type === "insurance") {

    const info = patient.savedInsurance;

    title.textContent = "Saved Insurance Details Found";
    text.textContent =
        `We found saved insurance details for ${patient.firstName} ${patient.lastName}.`;

    card.innerHTML = `
        <div class="saved-row">
            <strong>Provider</strong>
            <span>${info.provider}</span>
        </div>

        <div class="saved-row">
            <strong>Policy Number</strong>
            <span>${info.policy}</span>
        </div>

        <div class="saved-row">
            <strong>Group ID</strong>
            <span>${info.groupId}</span>
        </div>

        <div class="saved-row">
            <strong>Holder Name</strong>
            <span>${info.holderName}</span>
        </div>`;

    useSavedBtn.textContent = "Continue with Saved Insurance";


    } else {

        const info = patient.savedPayment;

        title.textContent = "Saved Payment Method Found";
        text.textContent = `We found a saved payment method for ${patient.firstName} ${patient.lastName}.`;
        card.innerHTML = `
            <p><strong>Card:</strong> ${info.cardNumber}</p>
            <p><strong>Holder Name:</strong> ${info.cardHolder}</p>
            <p><strong>Expiry:</strong> ${info.expiry}</p>`;
        useSavedBtn.textContent = "Continue with Saved Card";

    }

    document.getElementById("savedInfoModal").style.display = "flex";

}

function closeSavedInfoModal() {

    document.getElementById("savedInfoModal").style.display = "none";

    // Backing out of this prompt without a choice clears that pending selection
    const radioValue = pendingSavedInfoType === "insurance" ? "yes" : "no";
    const dataAlreadySet = pendingSavedInfoType === "insurance" ? !!insuranceData : !!paymentData;

    if (!dataAlreadySet) {
        const radio = document.querySelector(`input[name="insurance"][value="${radioValue}"]`);
        if (radio) radio.checked = false;
        if (insuranceChoice === radioValue) insuranceChoice = null;
    }

    pendingSavedInfoType = null;
    pendingSavedInfoPatient = null;

}

function useSavedInfo() {

    if (pendingSavedInfoType === "insurance") {
        insuranceData = pendingSavedInfoPatient.savedInsurance;
        const yesRadio = document.querySelector('input[name="insurance"][value="yes"]');
        if (yesRadio) yesRadio.parentElement.style.color = "green";
    } else if (pendingSavedInfoType === "payment") {
        paymentData = pendingSavedInfoPatient.savedPayment;
        const noRadio = document.querySelector('input[name="insurance"][value="no"]');
        if (noRadio) noRadio.parentElement.style.color = "green";
    }

    document.getElementById("savedInfoModal").style.display = "none";
    pendingSavedInfoType = null;
    pendingSavedInfoPatient = null;

}

function useNewInfo() {

    const type = pendingSavedInfoType;

    document.getElementById("savedInfoModal").style.display = "none";
    pendingSavedInfoType = null;
    pendingSavedInfoPatient = null;

    if (type === "insurance") {
        document.getElementById("insuranceModal").style.display = "flex";
    } else if (type === "payment") {
        document.getElementById("paymentModal").style.display = "flex";
    }

}



function closeSelectPatientModal() {

    document.getElementById(
        "selectPatientModal"
    ).style.display = "none";

}



function closeInsuranceModal() {

    document.getElementById(
        "insuranceModal"
    ).style.display = "none";

    insuranceChoice = null;
    insuranceData = null;

    const yesRadio = document.querySelector(
        'input[name="insurance"][value="yes"]'
    );

    if (yesRadio) {
        yesRadio.checked = false;
    }

}



function closePaymentModal() {

    document.getElementById(
        "paymentModal"
    ).style.display = "none";

    insuranceChoice = null;
    paymentData = null;

    const noRadio = document.querySelector(
        'input[name="insurance"][value="no"]'
    );

    if (noRadio) {
        noRadio.checked = false;
    }

}




function confirmInsurance() {

    const provider =
    document.getElementById("provider").value.trim();

    const policy =
    document.getElementById("policy").value.trim();

    const groupId =
    document.getElementById("groupId").value.trim();

    const holderName =
    document.getElementById("holderName").value.trim();

    const insuranceAddress =
    document.getElementById("insuranceAddress").value.trim();

    if (!provider || !policy || !holderName || !insuranceAddress) {

        alert("Please fill all required insurance fields");

        return;
    }

    insuranceData = { provider, policy, groupId, holderName, insuranceAddress };

    document.getElementById("insuranceModal").style.display = "none";

    insuranceChoice = "yes";

    const yesRadio = document.querySelector(
        'input[name="insurance"][value="yes"]'
    );

    if (yesRadio) {

        yesRadio.checked = true;
        yesRadio.parentElement.style.color = "green";

    }

}




function confirmPayment() {

    const paymentType =
    document.getElementById("paymentType").value.trim();

    const cardHolder =
    document.getElementById("cardHolder").value.trim();

    const cardNumber =
    document.getElementById("cardNumber").value.trim();

    const expiry =
    document.getElementById("expiry").value.trim();

    const cvv =
    document.getElementById("cvv").value.trim();

    if (!paymentType || !cardHolder || !cardNumber || !expiry || !cvv) {

        alert("Please fill all payment details");

        return;
    }

    paymentData = { paymentType, cardHolder, cardNumber, expiry, cvv };

    document.getElementById("paymentModal").style.display = "none";

    insuranceChoice = "no";

    const noRadio = document.querySelector(
        'input[name="insurance"][value="no"]'
    );

    if (noRadio) {

        noRadio.checked = true;
        noRadio.parentElement.style.color = "green";

    }

}




function confirmBooking() {

    if (!insuranceChoice) {

        alert("Please choose Yes or No for Insurance Coverage");

        return;
    }

    if (insuranceChoice === "yes" && !insuranceData) {

        document.getElementById("insuranceModal").style.display = "flex";

        return;
    }

    if (insuranceChoice === "no" && !paymentData) {

        document.getElementById("paymentModal").style.display = "flex";

        return;
    }

    const appointment = {

        firstName:
        document.getElementById(
            "firstName"
        ).value,

        lastName:
        document.getElementById(
            "lastName"
        ).value,

        phone:
        phoneIti
            ? phoneIti.getNumber()
            : document.getElementById("phone").value,

        address:
        document.getElementById(
            "address"
        ).value,

        city:
        document.getElementById(
            "city"
        ).value,

        state:
        document.getElementById(
            "state"
        ).value,

        pinCode:
        document.getElementById(
            "pinCode"
        ).value,

        sameAsPresentAddress:
        document.getElementById(
            "sameAsPresentAddress"
        ).checked,

        permanentAddress:
        document.getElementById(
            "permanentAddress"
        ).value,

        permanentCity:
        document.getElementById(
            "permanentCity"
        ).value,

        permanentState:
        document.getElementById(
            "permanentState"
        ).value,

        permanentPinCode:
        document.getElementById(
            "permanentPinCode"
        ).value,

        accountHolder:
        (document.querySelector('input[name="accountHolder"]:checked') || {}).value || "self",

        accountHolderName:
        (document.querySelector('input[name="accountHolder"]:checked') || {}).value === "other"
            ? document.getElementById("accountHolderName").value
            : `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`.trim(),

        relationToPatient:
        (document.querySelector('input[name="accountHolder"]:checked') || {}).value === "other"
            ? document.getElementById("relationToPatient").value
            : "Self",

        date:
        localStorage.getItem(
            "selectedDate"
        ) || "Not Selected",

        time:
        localStorage.getItem(
            "selectedTime"
        ) || "Not Selected",

        insurance: insuranceChoice,

        insuranceData,

        paymentData

    };



    localStorage.setItem(
        "latestAppointment",
        JSON.stringify(appointment)
    );



    localStorage.setItem(
        "tempAppointment",
        JSON.stringify(appointment)
    );



    window.location.href =
    "booking-otp.html";

}




function setupPermanentAddress() {
    const sameAsPresent = document.getElementById("sameAsPresentAddress");
    if (!sameAsPresent) return;

    const presentFieldIds = ["address", "city", "state", "pinCode"];
    const permanentFieldIds = ["permanentAddress", "permanentCity", "permanentState", "permanentPinCode"];

    function syncPermanentFromPresent() {
        presentFieldIds.forEach((presentId, i) => {
            const presentField = document.getElementById(presentId);
            const permanentField = document.getElementById(permanentFieldIds[i]);
            if (presentField && permanentField) {
                permanentField.value = presentField.value;
            }
        });
    }

    function setPermanentFieldsDisabled(disabled) {
        permanentFieldIds.forEach(id => {
            const field = document.getElementById(id);
            if (field) field.disabled = disabled;
        });
    }

    sameAsPresent.addEventListener("change", function () {
        if (this.checked) {
            syncPermanentFromPresent();
            setPermanentFieldsDisabled(true);
        } else {
            setPermanentFieldsDisabled(false);
        }
    });

    // Keep the permanent address mirrored live while the checkbox is on,
    // so editing the present address doesn't leave stale copied values.
    presentFieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;

        field.addEventListener("input", function () {
            if (sameAsPresent.checked) syncPermanentFromPresent();
        });

        field.addEventListener("change", function () {
            if (sameAsPresent.checked) syncPermanentFromPresent();
        });
    });

    const form = document.getElementById("bookingForm");
    if (form) {
        form.addEventListener("reset", function () {
            sameAsPresent.checked = false;
            setPermanentFieldsDisabled(false);
        });
    }
}

function updateAgeFromDob() {

    const dobInput =
    document.getElementById("dateOfBirth");

    const ageInput =
    document.getElementById("age");

    const yearsRadio =
    document.querySelector(
        'input[name="ageType"][value="years"]'
    );

    const monthsRadio =
    document.querySelector(
        'input[name="ageType"][value="months"]'
    );



    if (!dobInput.value) {

        ageInput.value = "";

        ageInput.readOnly = false;

        ageInput.disabled = false;

        yearsRadio.checked = false;

        monthsRadio.checked = false;

        return;
    }



    const dob =
    new Date(dobInput.value + "T00:00:00");

    const today = new Date();



    if (dob > today) {

        ageInput.value = "";

        ageInput.readOnly = false;

        ageInput.disabled = false;

        yearsRadio.checked = false;

        monthsRadio.checked = false;

        return;
    }



    let years =
    today.getFullYear() - dob.getFullYear();

    let months =
    today.getMonth() - dob.getMonth();

    const days =
    today.getDate() - dob.getDate();



    if (days < 0) {

        months -= 1;

    }



    if (months < 0) {

        years -= 1;

        months += 12;

    }



    if (years <= 0) {

        let totalMonths = months;

        if (days < 0 && totalMonths > 0) {

            totalMonths -= 1;

        }

        ageInput.value =
        Math.max(totalMonths, 0);

        ageInput.readOnly = true;

        ageInput.disabled = true;

        monthsRadio.checked = true;

        yearsRadio.checked = false;

        return;
    }



    ageInput.value = years;

    ageInput.readOnly = true;

    ageInput.disabled = true;

    yearsRadio.checked = true;

    monthsRadio.checked = false;

}
