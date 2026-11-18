let insuranceData = null;
let paymentData = null;
let insuranceChoice = null;
let phoneIti = null;
let accountHolderChoice = null;
let accountHolderData = null;
let previousAccountHolderData = null;

document.addEventListener("DOMContentLoaded", () => {
    seedDemoPatients();
    initializeRegistration();
});

/* --------------------------------------------------------------------------
   DEMO DATA — remove this block (and the seedDemoPatients() call above) once
   the page reads from a real patient database / API.

   The responsible-party search reads localStorage["savedPatients_v5"].
   These records are merged in (by id) so the flow can be demonstrated; any
   real records already stored are left untouched.

   Search by mobile  : 9830012345 | 9433098765 | 9051123456
   Search by name+DOB: Ramesh Sharma 1978-03-14, Aarav Sharma 2015-06-10,
                       Sunita Das 1985-07-22, Anil Banerjee 1969-11-05
   (Aarav is a child on Ramesh's account: searching him returns the account
   holder, Ramesh Sharma.)
-------------------------------------------------------------------------- */
const DEMO_SAVED_PATIENTS = [
    {
        id: "demo-1001", demo: true,
        firstName: "Ramesh", lastName: "Sharma", dob: "1978-03-14",
        phone: "9830012345", email: "ramesh.sharma@example.com",
        accountId: "ACC-1001",
        accountHolderName: "Ramesh Sharma",
        accountHolderMobile: "9830012345",
        accountHolderEmail: "ramesh.sharma@example.com"
    },
    {
        id: "demo-1002", demo: true,
        firstName: "Aarav", lastName: "Sharma", dob: "2015-06-10",
        phone: "9830012345", email: "ramesh.sharma@example.com",
        accountId: "ACC-1001",
        accountHolderName: "Ramesh Sharma",
        accountHolderMobile: "9830012345",
        accountHolderEmail: "ramesh.sharma@example.com"
    },
    {
        id: "demo-1003", demo: true,
        firstName: "Sunita", lastName: "Das", dob: "1985-07-22",
        phone: "9433098765", email: "sunita.das@example.com",
        accountId: "ACC-1002",
        accountHolderName: "Sunita Das",
        accountHolderMobile: "9433098765",
        accountHolderEmail: "sunita.das@example.com"
    },
    {
        id: "demo-1004", demo: true,
        firstName: "Anil", lastName: "Banerjee", dob: "1969-11-05",
        phone: "9051123456", email: "",
        accountId: "ACC-1003",
        accountHolderName: "Anil Banerjee",
        accountHolderMobile: "9051123456",
        accountHolderEmail: ""
    }
];

function seedDemoPatients() {
    try {
        let saved = JSON.parse(localStorage.getItem("savedPatients_v5") || "[]");
        if (!Array.isArray(saved)) saved = [];
        const existingIds = new Set(saved.map(patient => patient && patient.id));
        const missing = DEMO_SAVED_PATIENTS.filter(patient => !existingIds.has(patient.id));
        if (missing.length) {
            localStorage.setItem("savedPatients_v5", JSON.stringify([...saved, ...missing]));
        }
    } catch (_) { /* storage unavailable — search will simply find nothing */ }
}

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

function initializeRegistration() {
    const form = document.getElementById("bookingForm");
    const dobInput = document.getElementById("dateOfBirth");
    phoneIti = initializePhoneInput();

    if (dobInput) {
        dobInput.addEventListener("change", updateAgeFromDob);
    }

    setupInsurance();
    setupPermanentAddress();
    setupAccountBilling();

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            confirmBooking();
        });
    }
}

let lastFoundResponsibleParty = null;
let previousAccountHolderChoice = null;

function setupAccountBilling() {
    const radios = document.querySelectorAll('input[name="accountHolder"]');
    radios.forEach(radio => radio.addEventListener("change", function () {
        if (this.value === "self") {
            accountHolderChoice = "self";
            accountHolderData = buildPatientAccountHolder();
            previousAccountHolderChoice = null;
            previousAccountHolderData = null;
            closeAccountHolderModal(true);
            renderAccountHolderSummary();
            return;
        }
        if (this.value === "other") {
            previousAccountHolderChoice = accountHolderChoice;
            previousAccountHolderData = accountHolderData ? { ...accountHolderData } : null;
            accountHolderChoice = "other";
            renderAccountHolderSummary();
            openAccountHolderModal(accountHolderData?.type === "other" ? accountHolderData : null);
        }
    }));

    ["firstName", "lastName"].forEach(id => {
        document.getElementById(id)?.addEventListener("input", () => {
            if (accountHolderChoice === "self") {
                accountHolderData = buildPatientAccountHolder();
            }
        });
    });

    document.getElementById("searchResponsiblePartyBtn")?.addEventListener("click", searchResponsibleParty);
    document.getElementById("responsiblePartyMobile")?.addEventListener("keydown", event => {
        if (event.key === "Enter") { event.preventDefault(); searchResponsibleParty(); }
    });
    ["responsiblePartyName", "responsiblePartyDob"].forEach(id => {
        document.getElementById(id)?.addEventListener("keydown", event => {
            if (event.key === "Enter") { event.preventDefault(); searchResponsibleParty(); }
        });
    });
    document.getElementById("searchAgainNotFoundBtn")?.addEventListener("click", () => {
        resetResponsiblePartySearch();
        document.getElementById("responsiblePartyMobile")?.focus();
    });
    document.getElementById("accountHolderRelationship")?.addEventListener("change", updateAccountHolderConfirmState);
    document.getElementById("confirmAccountHolderBtn")?.addEventListener("click", confirmAccountHolder);
    document.getElementById("cancelAccountHolderModal")?.addEventListener("click", () => closeAccountHolderModal(false));
    document.getElementById("closeAccountHolderModal")?.addEventListener("click", () => closeAccountHolderModal(false));
    document.getElementById("accountHolderModal")?.addEventListener("click", event => {
        if (event.target.id === "accountHolderModal") closeAccountHolderModal(false);
    });
    document.getElementById("editAccountHolderBtn")?.addEventListener("click", () => {
        previousAccountHolderChoice = "other";
        previousAccountHolderData = accountHolderData ? { ...accountHolderData } : null;
        openAccountHolderModal(accountHolderData);
    });
}

function buildPatientAccountHolder() {
    const fullName = [
        document.getElementById("firstName")?.value.trim(),
        document.getElementById("lastName")?.value.trim()
    ].filter(Boolean).join(" ");
    return {
        type: "self", fullName, relationship: "Self",
        mobile: phoneIti ? phoneIti.getNumber() : (document.getElementById("phone")?.value.trim() || ""),
        email: document.getElementById("email")?.value.trim() || ""
    };
}

function normalizeResponsibleMobile(value) {
    return String(value || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "").slice(-10);
}

function resetResponsiblePartySearch() {
    ["responsiblePartyName", "responsiblePartyDob", "responsiblePartyMobile"].forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = "";
    });
    const found = document.getElementById("responsiblePartyFoundCard");
    const notFound = document.getElementById("responsiblePartyNotFoundCard");
    const error = document.getElementById("responsiblePartySearchError");
    const relationship = document.getElementById("accountHolderRelationship");
    const confirm = document.getElementById("confirmAccountHolderBtn");
    if (found) found.hidden = true;
    if (notFound) notFound.hidden = true;
    if (error) { error.hidden = true; error.textContent = ""; }
    if (relationship) relationship.value = "";
    if (confirm) confirm.disabled = true;
    lastFoundResponsibleParty = null;
}

function searchResponsibleParty() {
    const mobileValue = document.getElementById("responsiblePartyMobile")?.value.trim() || "";
    const nameValue = document.getElementById("responsiblePartyName")?.value.trim() || "";
    const dobValue = document.getElementById("responsiblePartyDob")?.value || "";
    const error = document.getElementById("responsiblePartySearchError");
    const mobile = normalizeResponsibleMobile(mobileValue);

    const clearResults = () => {
        lastFoundResponsibleParty = null;
        const f = document.getElementById("responsiblePartyFoundCard");
        const n = document.getElementById("responsiblePartyNotFoundCard");
        if (f) f.hidden = true;
        if (n) n.hidden = true;
        updateAccountHolderConfirmState();
    };
    if (!mobileValue && (!nameValue || !dobValue)) {
        clearResults();
        if (error) { error.textContent = "Enter a mobile number, or a full name and date of birth, to search."; error.hidden = false; }
        return;
    }
    if (mobileValue && mobile.length !== 10) {
        clearResults();
        if (error) { error.textContent = "Enter a valid 10-digit mobile number."; error.hidden = false; }
        return;
    }
    if (error) error.hidden = true;

    let patients = [];
    try {
        const saved = JSON.parse(localStorage.getItem("savedPatients_v5") || "[]");
        if (Array.isArray(saved)) patients = saved;
    } catch (_) { patients = []; }

    // Same lookup pattern as Booking: account mobile OR patient full name + DOB.
    const match = mobileValue
        ? patients.find(patient => normalizeResponsibleMobile(patient.accountHolderMobile || patient.phone) === mobile)
        : patients.find(patient => `${patient.firstName || ""} ${patient.lastName || ""}`.trim().toLowerCase() === nameValue.toLowerCase() && (patient.dob || patient.dateOfBirth) === dobValue);

    const foundCard = document.getElementById("responsiblePartyFoundCard");
    const notFoundCard = document.getElementById("responsiblePartyNotFoundCard");
    const content = document.getElementById("responsiblePartyFoundContent");
    if (match) {
        lastFoundResponsibleParty = {
            type: "other",
            fullName: match.accountHolderName || `${match.firstName || ""} ${match.lastName || ""}`.trim(),
            mobile: normalizeResponsibleMobile(match.accountHolderMobile || match.phone || ""),
            email: match.accountHolderEmail || match.email || "",
            accountId: match.accountId || "",
            matchedPatientId: match.id || ""
        };
        if (content) {
            content.replaceChildren();
            [["Account Holder", lastFoundResponsibleParty.fullName], ["Mobile Number", lastFoundResponsibleParty.mobile], ["Email Address", lastFoundResponsibleParty.email || "Not provided"]].forEach(([label, value]) => {
                const row = document.createElement("div");
                row.className = "responsible-party-result-row";
                const strong = document.createElement("strong"); strong.textContent = label;
                const span = document.createElement("span"); span.textContent = value || "—";
                row.append(strong, span); content.append(row);
            });
        }
        if (foundCard) foundCard.hidden = false;
        if (notFoundCard) notFoundCard.hidden = true;
    } else {
        lastFoundResponsibleParty = null;
        if (foundCard) foundCard.hidden = true;
        if (notFoundCard) notFoundCard.hidden = false;
    }
    updateAccountHolderConfirmState();
}

function updateAccountHolderConfirmState() {
    const confirm = document.getElementById("confirmAccountHolderBtn");
    const relationship = document.getElementById("accountHolderRelationship");
    if (confirm) confirm.disabled = !(lastFoundResponsibleParty && relationship?.value);
}

function openAccountHolderModal(data) {
    resetResponsiblePartySearch();
    if (data?.type === "other") {
        lastFoundResponsibleParty = { ...data };
        const foundCard = document.getElementById("responsiblePartyFoundCard");
        const notFoundCard = document.getElementById("responsiblePartyNotFoundCard");
        const content = document.getElementById("responsiblePartyFoundContent");
        if (content) {
            content.replaceChildren();
            [["Account Holder", data.fullName], ["Mobile Number", data.mobile], ["Email Address", data.email || "Not provided"]].forEach(([label, value]) => {
                const row = document.createElement("div"); row.className = "responsible-party-result-row";
                const strong = document.createElement("strong"); strong.textContent = label;
                const span = document.createElement("span"); span.textContent = value || "—";
                row.append(strong, span); content.append(row);
            });
        }
        if (foundCard) foundCard.hidden = false;
        if (notFoundCard) notFoundCard.hidden = true;
        const relationship = document.getElementById("accountHolderRelationship");
        if (relationship) relationship.value = data.relationship || "";
        updateAccountHolderConfirmState();
    }
    const modal = document.getElementById("accountHolderModal");
    if (!modal) return;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("responsiblePartyMobile")?.focus();
}

function closeAccountHolderModal(confirmed) {
    const modal = document.getElementById("accountHolderModal");
    if (modal) { modal.style.display = "none"; modal.setAttribute("aria-hidden", "true"); }
    if (confirmed) {
        previousAccountHolderData = null;
        previousAccountHolderChoice = null;
        return;
    }
    if (previousAccountHolderChoice === "self" || (!previousAccountHolderData && previousAccountHolderChoice !== "other")) {
        accountHolderChoice = "self";
        accountHolderData = buildPatientAccountHolder();
        const self = document.querySelector('input[name="accountHolder"][value="self"]');
        if (self) self.checked = true;
        renderAccountHolderSummary();
    } else if (previousAccountHolderData?.type === "other") {
        accountHolderChoice = "other";
        accountHolderData = { ...previousAccountHolderData };
        const other = document.querySelector('input[name="accountHolder"][value="other"]');
        if (other) other.checked = true;
        renderAccountHolderSummary();
    } else {
        accountHolderChoice = null;
        accountHolderData = null;
        document.querySelectorAll('input[name="accountHolder"]').forEach(radio => { radio.checked = false; });
        renderAccountHolderSummary();
    }
    previousAccountHolderData = null;
    previousAccountHolderChoice = null;
}

function confirmAccountHolder() {
    const error = document.getElementById("accountHolderModalError");
    const relationship = document.getElementById("accountHolderRelationship")?.value || "";
    if (!lastFoundResponsibleParty) {
        if (error) { error.textContent = "Search and find an existing responsible party before confirming."; error.hidden = false; }
        return;
    }
    if (!relationship) {
        if (error) { error.textContent = "Please select the relationship with the patient."; error.hidden = false; }
        return;
    }
    accountHolderChoice = "other";
    accountHolderData = { ...lastFoundResponsibleParty, type: "other", relationship };
    closeAccountHolderModal(true);
    renderAccountHolderSummary();
}

// An account holder is "ready" once The Patient is chosen, or Another Person
// has been searched for, given a relationship and confirmed in the modal.
function isAccountHolderReady() {
    if (!accountHolderChoice || !accountHolderData) return false;
    return accountHolderData.type === accountHolderChoice;
}

// Single place that decides what the Account & Billing section shows:
// the account-holder summary and, after it, Insurance Coverage.
function renderAccountHolderSummary() {
    const summary = document.getElementById("accountHolderSummary");
    const insuranceGroup = document.getElementById("insuranceCoverageGroup");
    const ready = isAccountHolderReady();

    if (summary) {
        if (ready && accountHolderChoice === "other") {
            document.getElementById("accountHolderSummaryName").textContent = accountHolderData.fullName || "—";
            document.getElementById("accountHolderSummaryRelation").textContent = accountHolderData.relationship || "—";
        }
        // The Account Holder / Relationship bar is only for Another Person.
        summary.hidden = !(ready && accountHolderChoice === "other");
    }

    if (insuranceGroup) {
        insuranceGroup.hidden = !ready;
        // A hidden required control cannot be focused by the browser, so only require it while visible.
        insuranceGroup.querySelectorAll('input[name="insurance"]').forEach(radio => { radio.required = ready; });
    }
}

function setupPermanentAddress() {
    const sameAsPresent = document.getElementById("sameAsPresentAddress");
    if (!sameAsPresent) return;

    const presentFieldIds = ["residentialAddress", "cityVillage", "state", "pinCode"];
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
}

function setupInsurance() {
    const radios = document.querySelectorAll(
        'input[name="insurance"]'
    );

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

function confirmInsurance() {
    const provider = document
        .getElementById("provider")
        .value
        .trim();

    const policy = document
        .getElementById("policy")
        .value
        .trim();

    const groupId = document
        .getElementById("groupId")
        .value
        .trim();

    const holderName = document
        .getElementById("holderName")
        .value
        .trim();

    const insuranceAddress = document
        .getElementById("insuranceAddress")
        .value
        .trim();

    if (
        !provider ||
        !policy ||
        !holderName ||
        !insuranceAddress
    ) {
        return;
    }

    insuranceData = {
        provider,
        policy,
        groupId,
        holderName,
        insuranceAddress
    };

    document.getElementById(
        "insuranceModal"
    ).style.display = "none";
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

function confirmPayment() {
    const paymentType = document
        .getElementById("paymentType")
        .value;

    const cardHolder = document
        .getElementById("cardHolder")
        .value
        .trim();

    const cardNumber = document
        .getElementById("cardNumber")
        .value
        .trim();

    const expiry = document
        .getElementById("expiry")
        .value
        .trim();

    const cvv = document
        .getElementById("cvv")
        .value
        .trim();

    if (
        !paymentType ||
        !cardHolder ||
        !cardNumber ||
        !expiry ||
        !cvv
    ) {
        return;
    }

    paymentData = {
        paymentType,
        cardHolder,
        cardNumber,
        expiry,
        cvv
    };

    document.getElementById(
        "paymentModal"
    ).style.display = "none";
}

function confirmBooking() {
    if (!accountHolderChoice) {
        alert("Please select who will manage this patient's account and billing.");
        return;
    }

    if (accountHolderChoice === "other" && (!accountHolderData || accountHolderData.type !== "other")) {
        openAccountHolderModal();
        return;
    }

    if (accountHolderChoice === "self") {
        accountHolderData = buildPatientAccountHolder();
    }

    if (!insuranceChoice) {
        return;
    }

    if (
        insuranceChoice === "yes" &&
        !insuranceData
    ) {
        document.getElementById(
            "insuranceModal"
        ).style.display = "flex";

        return;
    }

    if (
        insuranceChoice === "no" &&
        !paymentData
    ) {
        document.getElementById(
            "paymentModal"
        ).style.display = "flex";

        return;
    }

    const genderSelect = document.querySelector(
        '#bookingForm .form-grid select'
    );

    const otpMethod = document.querySelector(
        'input[name="otp"]:checked'
    )?.value || "";

    const appointment = {
        firstName: document
            .getElementById("firstName")
            .value
            .trim(),

        lastName: document
            .getElementById("lastName")
            .value
            .trim(),

        phone: phoneIti
            ? phoneIti.getNumber()
            : document.getElementById("phone").value.trim(),

        email: document
            .getElementById("email")
            .value
            .trim(),

        dateOfBirth: document
            .getElementById("dateOfBirth")
            .value,

        age: document
            .getElementById("age")
            .value,

        gender: document.getElementById("gender")?.value || (genderSelect ? genderSelect.value : ""),

        address: document
            .getElementById("residentialAddress")
            .value
            .trim(),

        cityVillage: document
            .getElementById("cityVillage")
            .value
            .trim(),

        state: document
            .getElementById("state")
            .value,

        pinCode: document
            .getElementById("pinCode")
            .value
            .trim(),

        sameAsPresentAddress: document
            .getElementById("sameAsPresentAddress")
            ?.checked || false,

        permanentAddress: document
            .getElementById("permanentAddress")
            .value
            .trim(),

        permanentCity: document
            .getElementById("permanentCity")
            .value
            .trim(),

        permanentState: document
            .getElementById("permanentState")
            .value,

        permanentPinCode: document
            .getElementById("permanentPinCode")
            .value
            .trim(),

        accountHolderChoice,
        accountHolder: accountHolderData,

        insurance: insuranceChoice,

        insuranceData,

        paymentData,

        otpMethod
    };

    localStorage.setItem(
        "tempAppointment",
        JSON.stringify(appointment)
    );

    if (otpMethod === "none") {
        window.location.href =
            "patient-registration-success.html";

        return;
    }

    window.location.href =
        "registration-otp.html";
}

function updateAgeFromDob() {
    const dobInput = document.getElementById("dateOfBirth");
    const ageInput = document.getElementById("age");

    if (!dobInput || !ageInput) return;


    ageInput.readOnly = true;
    ageInput.disabled = false;

    if (!dobInput.value) {
        ageInput.value = "";
        return;
    }

    const dob = new Date(dobInput.value + "T00:00:00");
    const today = new Date();

    if (Number.isNaN(dob.getTime()) || dob > today) {
        ageInput.value = "";
        return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    const days = today.getDate() - dob.getDate();

    if (days < 0) months--;
    if (months < 0) {
        years--;
        months += 12;
    }

    const unit = document.querySelector(".age-unit");

    if (years <= 0) {
        const totalMonths = Math.max(0, months);
        ageInput.value = totalMonths;
        if (unit) unit.textContent = totalMonths === 1 ? "Month" : "Months";
        return;
    }

    ageInput.value = years;
    if (unit) unit.textContent = years === 1 ? "Year" : "Years";
}

document.addEventListener(
    "reset",
    function () {
        insuranceChoice = null;
        insuranceData = null;
        paymentData = null;
        accountHolderChoice = null;
        accountHolderData = null;
        previousAccountHolderData = null;

        const accountModal = document.getElementById("accountHolderModal");
        if (accountModal) {
            accountModal.style.display = "none";
            accountModal.setAttribute("aria-hidden", "true");
        }
        previousAccountHolderChoice = null;
        renderAccountHolderSummary();

        const age = document.getElementById(
            "age"
        );

        if (age) {
            age.value = "";
            age.readOnly = true;
            age.disabled = false;
        }

        const ageUnit = document.querySelector(".age-unit");
        if (ageUnit) ageUnit.textContent = "Years";

        ["permanentAddress", "permanentCity", "permanentState", "permanentPinCode"].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.disabled = false;
        });
    }
);

document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Enter" &&
            event.target.tagName !== "TEXTAREA"
        ) {
            event.preventDefault();
        }
    }
);