let insuranceData = null;
let paymentData = null;
let insuranceChoice = null;

const PATIENTS_KEY = "savedPatients";

let allPatients = [];
let selectedPatientId = null;

function seedPatients() {
    return [
        { id: "p1", firstName: "Rajesh", lastName: "Sharma", relation: "Self", dob: "1990-05-12", age: "35", ageType: "years", gender: "Male" },
        { id: "p2", firstName: "Harshit", lastName: "Bhardwaj", relation: "Sibling", dob: "1997-02-10", age: "28", ageType: "years", gender: "Male" },
        { id: "p3", firstName: "K", lastName: "Bhardwaj", relation: "Sibling", dob: "2000-07-21", age: "25", ageType: "years", gender: "Female" },
        { id: "p4", firstName: "Sonia", lastName: "Verma", relation: "Mother", dob: "1962-03-03", age: "63", ageType: "years", gender: "Female" },
        { id: "p5", firstName: "Amit", lastName: "Kumar", relation: "Father", dob: "1958-11-19", age: "67", ageType: "years", gender: "Male" },
        { id: "p6", firstName: "Sonia", lastName: "Kumar", relation: "Father", dob: "1990-01-15", age: "35", ageType: "years", gender: "Female" }
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

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    const dobInput = document.getElementById("dateOfBirth");

    allPatients = loadPatients();

    // ---- Patient profile dropdown ----
    const patientDropdown = document.getElementById("patientDropdown");
    const trigger = document.getElementById("patientDropdownTrigger");
    const panel = document.getElementById("patientDropdownPanel");
    const label = document.getElementById("patientDropdownLabel");
    const searchInput = document.getElementById("patientSearchInput");
    const listEl = document.getElementById("patientList");
    const profileRow = [
        document.getElementById("patientProfileLabel"),
        patientDropdown
    ];

    function renderPatientList(list) {
        listEl.innerHTML = "";

        if (!list.length) {
            listEl.innerHTML = '<div class="patient-item-empty">No patients found</div>';
            return;
        }

        list.forEach(p => {
            const item = document.createElement("div");
            item.className = "patient-item";
            item.innerHTML = `
                <span class="patient-item-avatar">&#128100;</span>
                <div>
                    <p class="patient-item-name">${p.firstName} ${p.lastName}</p>
                    <p class="patient-item-relation">${p.relation}</p>
                </div>`;
            item.addEventListener("click", () => selectPatient(p));
            listEl.appendChild(item);
        });
    }

    function openDropdown() {
        panel.classList.add("open");
        trigger.classList.add("open");
        renderPatientList(allPatients);
        searchInput.value = "";
        searchInput.focus();
    }

    function closeDropdown() {
        panel.classList.remove("open");
        trigger.classList.remove("open");
    }

    function selectPatient(p) {
        selectedPatientId = p.id;

        document.getElementById("firstName").value = p.firstName;
        document.getElementById("lastName").value = p.lastName;
        document.getElementById("relation").value = p.relation;
        document.getElementById("dateOfBirth").value = p.dob;

        const ageTypeRadio = document.querySelector(`input[name="ageType"][value="${p.ageType}"]`);
        if (ageTypeRadio) ageTypeRadio.checked = true;

        document.getElementById("age").value = p.age;
        document.getElementById("gender").value = p.gender;

        label.textContent = `${p.firstName} ${p.lastName}`;
        label.classList.add("filled");

        closeDropdown();
        updateAgeFromDob();
    }

    trigger.addEventListener("click", () => {
        if (panel.classList.contains("open")) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    document.addEventListener("click", (e) => {
        if (!patientDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = allPatients.filter(p =>
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
            p.relation.toLowerCase().includes(q)
        );
        renderPatientList(filtered);
    });

    // ---- Patient Type: existing vs new ----
    function clearPatientDetailFields() {
        selectedPatientId = null;

        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("relation").value = "";
        document.getElementById("dateOfBirth").value = "";

        const ageInput = document.getElementById("age");
        ageInput.value = "";
        ageInput.disabled = false;
        ageInput.readOnly = false;

        document.querySelectorAll('input[name="ageType"]').forEach(r => r.checked = false);

        document.getElementById("gender").value = "";

        label.textContent = "Select Patient";
        label.classList.remove("filled");
    }

    document.querySelectorAll('input[name="patientType"]').forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.value === "new") {
                profileRow.forEach(el => el.style.display = "none");
                closeDropdown();
                clearPatientDetailFields();
            } else {
                profileRow.forEach(el => el.style.display = "");
            }
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

            const newPatient = {
                id: "p" + Date.now(),
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                relation: document.getElementById("relation").value,
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

                document.getElementById(
                    "insuranceModal"
                ).style.display = "flex";

            }

            if (this.value === "no") {

                document.getElementById(
                    "paymentModal"
                ).style.display = "flex";

            }

        });

    });




    dobInput.addEventListener(
        "change",
        updateAgeFromDob
    );

});





function closeInsuranceModal() {

    document.getElementById(
        "insuranceModal"
    ).style.display = "none";

}



function closePaymentModal() {

    document.getElementById(
        "paymentModal"
    ).style.display = "none";

}




function confirmInsurance() {

    const provider =
    document.getElementById("provider").value;

    const policy =
    document.getElementById("policy").value;

    if (!provider || !policy) {

        alert("Please fill all insurance fields");

        return;
    }

    insuranceData = { provider, policy };

    closeInsuranceModal();

    const selected =
    document.querySelector(
        'input[name="insurance"]:checked'
    );

    if (selected) {

        selected.parentElement.style.color = "green";

    }

}




function confirmPayment() {

    const card =
    document.getElementById("cardNumber").value;

    const cvv =
    document.getElementById("cvv").value;

    if (!card || !cvv) {

        alert("Please fill all payment details");

        return;
    }

    paymentData = { card, cvv };

    closePaymentModal();

    const selected =
    document.querySelector(
        'input[name="insurance"]:checked'
    );

    if (selected) {

        selected.parentElement.style.color = "green";

    }

}




function confirmBooking() {

    if (!insuranceChoice) {

        alert("Please choose Yes or No");

        return;
    }

    if (
        insuranceChoice === "yes"
        && !insuranceData
    ) {

        alert("Please fill Insurance Details");

        return;
    }

    if (
        insuranceChoice === "no"
        && !paymentData
    ) {

        alert("Please fill Payment Details");

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
        document.getElementById(
            "phone"
        ).value,

        date:
        localStorage.getItem(
            "selectedDate"
        ) || "Not Selected",

        time:
        localStorage.getItem(
            "selectedTime"
        ) || "Not Selected"

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
    "otp-verification.html";

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
