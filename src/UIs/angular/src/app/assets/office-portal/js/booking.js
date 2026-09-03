let insuranceData = null;
let paymentData = null;
let insuranceChoice = null;
let phoneIti = null;

// v5: patient records now carry accountId / accountHolder fields, so a
// stale v4 cache (seeded before Responsible Party support existed) needs
// to be reseeded rather than reused as-is.
const PATIENTS_KEY = "savedPatients_v5";

let allPatients = [];
let selectedPatientId = null;
let currentPatientType = "existing";

let selectedAccountHolder = null;
let isExistingAccount = false;

// Responsible Party OTP is a 4-digit code, entered across 4 segmented
// boxes (rp-otp-input). Kept as a constant since the digit-count shows
// up in a few places: generating the mock code, validating what was
// entered, and the HTML input count itself.
const RP_OTP_LENGTH = 4;

// Which channel the OTP was last sent to ("phone" or "email") — set when
// the channel-selection modal hands off to the code-entry modal, and
// used to label the hint / drive Resend without needing the channel
// radios (which now live in a different modal than the code entry).
let currentRpOtpChannel = "phone";

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

// Each patient record is linked to a Responsible Party (Account Holder)
// via accountId. Multiple patients can share the same accountId — that's
// how "a single Responsible Party may own multiple patients" is modeled.
// This is the one real dataset used both for "Select Existing Patient"
// and for Responsible Party mobile search — there is no separate mock
// accountHolders list.
function seedPatients() {
    return [
        { id: "p1", firstName: "Rajesh", lastName: "Sharma", relation: "Self", dob: "1990-05-12", age: "35", ageType: "years", gender: "Male",
          accountId: "ACC100240", accountHolderName: "Rajesh Sharma", accountHolderMobile: "9998887770", accountHolderEmail: "rajesh@email.com",
          savedInsurance: { provider: "Star Health", policy: "SH-778215", groupId: "GRP-1042", holderName: "Rajesh Sharma", insuranceAddress: "204 MG Road, Bengaluru" } },

        { id: "p2", firstName: "Harshit", lastName: "Bhardwaj", relation: "Sibling", dob: "1997-02-10", age: "28", ageType: "years", gender: "Male",
          accountId: "ACC100246", accountHolderName: "Aditi Bhardwaj", accountHolderMobile: "9123456780", accountHolderEmail: "aditi@email.com",
          savedPayment: { paymentType: "Credit Card", cardHolder: "Harshit Bhardwaj", cardNumber: "**** **** **** 4821", expiry: "09/28", cvv: "***" } },

        { id: "p3", firstName: "K", lastName: "Bhardwaj", relation: "Sibling", dob: "2000-07-21", age: "25", ageType: "years", gender: "Female",
          accountId: "ACC100246", accountHolderName: "Aditi Bhardwaj", accountHolderMobile: "9123456780", accountHolderEmail: "aditi@email.com" },

        { id: "p4", firstName: "Meera", lastName: "Sharma", relation: "Daughter", dob: "2016-11-04", age: "9", ageType: "years", gender: "Female",
          accountId: "ACC100245", accountHolderName: "Priya Sharma", accountHolderMobile: "9876543210", accountHolderEmail: "priya@email.com" },

        { id: "p5", firstName: "Kabir", lastName: "Sharma", relation: "Son", dob: "2012-01-19", age: "13", ageType: "years", gender: "Male",
          accountId: "ACC100245", accountHolderName: "Priya Sharma", accountHolderMobile: "9876543210", accountHolderEmail: "priya@email.com" },

        { id: "p6", firstName: "Priya", lastName: "Sharma", relation: "Self", dob: "1985-03-22", age: "41", ageType: "years", gender: "Female",
          accountId: "ACC100245", accountHolderName: "Priya Sharma", accountHolderMobile: "9876543210", accountHolderEmail: "priya@email.com" }
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

// ---- Responsible Party (Guarantor) — centralized state machine ----
//
// Exactly one visual state is ever shown at a time. Every function below
// that touches Responsible Party visibility funnels through
// setResponsiblePartyState() — nothing else toggles .hidden on these
// elements directly.
//
//   "hidden"    Existing Patient — entire #responsiblePartySection hidden.
//   "self"      New Patient, "The Patient" — question visible, no sub-card.
//   "search"    New Patient, "Another Person" — Search card only.
//   "found"     Search matched — Found card only.
//   "otp"       Continue clicked on a found account — OTP modal is open,
//               no card is visible behind it.
//   "notFound"  Search had no match — Warning card only (Search Again).
//   "linked"    OTP verified — Account Holder Name (read-only, auto-filled)
//               + Relationship to Patient only, plus the success badge.
let currentResponsiblePartyState = "hidden";

// Holds the account returned by the most recent successful search, so
// Continue/OTP verification can link to it without needing an argument.
let lastFoundAccount = null;

// Mock OTP sent to the found account's registered mobile. In production
// this is generated server-side and never exposed to the client — here
// it's kept in memory purely so verifyResponsiblePartyOTP() has something
// to check against, since there is no real SMS gateway in this demo.
let pendingResponsiblePartyOtp = null;

// Handle for the "Expires in mm:ss" countdown driving the Resend OTP
// button's disabled state — tracked so it can be cleared whenever the
// modal closes, resends, or switches channel, instead of stacking
// multiple intervals on top of each other.
let rpOtpCountdownInterval = null;

function setResponsiblePartyState(state) {
    const section = document.getElementById("responsiblePartySection");
    const holderQuestion = document.getElementById("accountHolderQuestion");
    const searchCard = document.getElementById("responsiblePartySearchCard");
    const foundCard = document.getElementById("responsiblePartyFoundCard");
    const notFoundCard = document.getElementById("responsiblePartyNotFoundCard");
    const holderFields = document.getElementById("accountHolderFields");
    const holderNameInput = document.getElementById("accountHolderName");
    const relationSelect = document.getElementById("relationToPatient");
    const mobileInput = document.getElementById("responsiblePartyMobile");

    if (!section) return;

    currentResponsiblePartyState = state;

    if (state === "hidden") {
        section.hidden = true;
        if (holderQuestion) holderQuestion.hidden = true;
        searchCard.hidden = true;
        foundCard.hidden = true;
        notFoundCard.hidden = true;
        holderFields.hidden = true;
        holderNameInput.disabled = true;
        relationSelect.disabled = true;
        holderNameInput.required = false;
        relationSelect.required = false;
        if (mobileInput) mobileInput.required = false;
        return;
    }

    // Every non-hidden state keeps the section and the top-level
    // self/other question visible. Everything below it defaults to
    // hidden — each case below opts back in only what that state needs,
    // so at most one sub-card (or the Account Holder fields) is ever
    // shown at once.
    section.hidden = false;
    if (holderQuestion) holderQuestion.hidden = false;

    searchCard.hidden = true;
    foundCard.hidden = true;
    notFoundCard.hidden = true;
    holderFields.hidden = true;
    holderNameInput.disabled = true;
    relationSelect.disabled = true;
    holderNameInput.required = false;
    relationSelect.required = false;
    if (mobileInput) mobileInput.required = false;

    switch (state) {
        case "self":
            // The Patient is the account holder — no sub-card needed.
            break;

        case "search":
            searchCard.hidden = false;
            break;

        case "found":
            foundCard.hidden = false;
            break;

        case "otp":
            // The OTP modal itself carries the UI here — nothing behind it.
            break;

        case "notFound":
            notFoundCard.hidden = false;
            break;

        case "linked":
            // Account Holder Name comes from the linked account and is
            // read-only; only Relationship to Patient still needs input.
            holderFields.hidden = false;
            holderNameInput.disabled = true;
            relationSelect.disabled = false;
            relationSelect.required = true;
            break;
    }
}

// The Account Holder question only ever applies to the "Add New Patient"
// flow — existing patients keep using their already-recorded relation,
// with no Responsible Party UI shown at all.
function updateAccountHolderUI(patientType) {
    const holderRadios = document.querySelectorAll('input[name="accountHolder"]');

    // EXISTING PATIENT → hide entire Responsible Party section
    if (patientType !== "new") {
        holderRadios.forEach(r => {
            r.checked = false;
            r.disabled = true;
        });

        resetResponsiblePartySearch();
        setResponsiblePartyState("hidden");
        return;
    }

    // NEW PATIENT
    holderRadios.forEach(r => r.disabled = false);

    let chosen = document.querySelector('input[name="accountHolder"]:checked');

    if (!chosen) {
        const selfRadio = document.querySelector('input[name="accountHolder"][value="self"]');
        if (selfRadio) {
            selfRadio.checked = true;
            chosen = selfRadio;
        }
    }

    updateAccountHolderDetailsVisibility(chosen.value);
}

// Controls the top-level Account Holder choice only ("self" vs "other").
// The Account Holder Name / Relationship fields are never revealed
// directly from here — only after a successful search + OTP verification
// links an existing account (see verifyResponsiblePartyOTP()).
function updateAccountHolderDetailsVisibility(value) {
    // Clear previous Responsible Party state
    resetResponsiblePartySearch();

    if (value === "other") {
        // Another Person → show only Search card
        setResponsiblePartyState("search");
    } else {
        // The Patient → hide everything below
        setResponsiblePartyState("self");
    }
}

// ---- Responsible Party (Guarantor) data helpers ----
// Source of truth is allPatients (the real patient dataset) — there is
// no separate mock accountHolders list. A Responsible Party is derived
// by looking at whichever patient record(s) share an accountId.

// Reduces any mobile number down to its bare 10 digits so
// "9876543210", "+919876543210" and "+91 98765 43210" all compare equal.
function normalizeMobile(number) {
    const digits = String(number || "").replace(/\D/g, "");
    return digits.slice(-10);
}

// Number of patients sharing the same accountId. An account that doesn't
// exist yet trivially links just the one (new) patient.
function countLinkedPatients(accountId) {
    if (!accountId) return 1;

    const count = allPatients.filter(p => p.accountId === accountId).length;
    return count > 0 ? count : 1;
}

// Builds the Responsible Party view for a given accountId from whichever
// patient record carries that account's holder details.
function getAccountHolder(accountId) {
    if (!accountId) return null;

    const patient = allPatients.find(p => p.accountId === accountId);
    if (!patient) return null;

    return {
        accountId: patient.accountId,
        accountHolderName: patient.accountHolderName,
        phone: patient.accountHolderMobile,
        email: patient.accountHolderEmail,
        linkedPatients: countLinkedPatients(patient.accountId)
    };
}

// Reads either the mobile number or the Patient Full Name / DOB fields,
// looks the match up against the real patient dataset, and drives the
// state machine to "found" or "notFound". No mock array involved.
// Mobile and Name+DOB are alternatives ("OR") — mobile takes priority
// when both happen to be filled in.
function searchResponsibleParty() {
    const mobileInput = document.getElementById("responsiblePartyMobile");
    const nameInput = document.getElementById("responsiblePartyName");
    const dobInput = document.getElementById("responsiblePartyDob");
    const errorText = document.getElementById("responsiblePartySearchError");

    const mobileValue = mobileInput ? mobileInput.value.trim() : "";
    const nameValue = nameInput ? nameInput.value.trim() : "";
    const dobValue = dobInput ? dobInput.value : "";

    if (!mobileValue && !nameValue && !dobValue) {
        if (errorText) errorText.hidden = false;
        if (mobileInput) mobileInput.focus();
        return;
    }
    if (errorText) errorText.hidden = true;

    let match = null;

    if (mobileValue) {
        const normalized = normalizeMobile(mobileValue);
        match = allPatients.find(p =>
            p.accountHolderMobile && normalizeMobile(p.accountHolderMobile) === normalized
        );
    } else {
        const q = nameValue.toLowerCase();
        match = allPatients.find(p =>
            (!q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)) &&
            (!dobValue || p.dob === dobValue)
        );
    }

    if (match) {
        lastFoundAccount = getAccountHolder(match.accountId);
        renderFoundAccount(lastFoundAccount);
        setResponsiblePartyState("found");
    } else {
        lastFoundAccount = null;
        selectedAccountHolder = null;
        isExistingAccount = false;

        setResponsiblePartyState("notFound");
    }
}

function renderFoundAccount(account) {
    const content = document.getElementById("responsiblePartyFoundContent");
    if (!content || !account) return;

    content.innerHTML =
        '<div class="saved-row"><strong>Account Holder Name</strong><span>' + account.accountHolderName + '</span></div>' +
        '<div class="saved-row"><strong>Account ID</strong><span>' + account.accountId + '</span></div>' +
        '<div class="saved-row"><strong>Mobile Number</strong><span>+91 ' + account.phone + '</span></div>' +
        '<div class="saved-row"><strong>Email</strong><span>' + account.email + '</span></div>' +
        '<div class="saved-row"><strong>Patients Linked</strong><span>' + account.linkedPatients + '</span></div>';
}

// Reads which channel the "Send OTP Via" radios currently have selected.
function getSelectedRpOtpChannel() {
    const checked = document.querySelector('input[name="rpOtpChannel"]:checked');
    return checked ? checked.value : "phone";
}

// --- Segmented OTP input helpers -------------------------------------
// The OTP field is 6 individual single-digit boxes (same interaction
// pattern as the standalone OTP Verification page: type-to-advance,
// backspace-to-go-back, paste-to-fill-all) rather than one free-text
// input. These helpers keep the rest of the flow working with a single
// concatenated string, same as before.

function getRpOtpInputs() {
    return Array.from(document.querySelectorAll("#responsiblePartyOtpGroup .rp-otp-input"));
}

function getRpOtpValue() {
    return getRpOtpInputs().map(input => input.value).join("");
}

function clearRpOtpInputs(focusFirst) {
    const inputs = getRpOtpInputs();
    inputs.forEach(input => {
        input.value = "";
        input.classList.remove("filled", "rp-otp-error");
    });
    if (focusFirst && inputs[0]) inputs[0].focus();
}

function setRpOtpError(hasError) {
    getRpOtpInputs().forEach(input => input.classList.toggle("rp-otp-error", hasError));
}

// Wires the type-to-advance / backspace / paste behaviour onto the 6
// digit boxes. Only needs to run once — the boxes themselves persist in
// the DOM across modal open/close, only their values get reset.
function setupRpOtpInputs() {
    const inputs = getRpOtpInputs();
    if (!inputs.length) return;

    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(-1);
            this.classList.toggle("filled", this.value !== "");
            setRpOtpError(false);

            if (this.value !== "" && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Backspace" && this.value === "" && index > 0) {
                inputs[index - 1].focus();
            }
            if (event.key === "Enter") {
                event.preventDefault();
                verifyResponsiblePartyOTP();
            }
        });

        input.addEventListener("paste", function (event) {
            const paste = (event.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
            if (!paste) return;
            event.preventDefault();

            inputs.forEach((otpInput, i) => {
                otpInput.value = paste[i] || "";
                otpInput.classList.toggle("filled", otpInput.value !== "");
            });
            setRpOtpError(false);

            const nextEmpty = inputs.findIndex(otpInput => otpInput.value === "");
            (nextEmpty === -1 ? inputs[inputs.length - 1] : inputs[nextEmpty]).focus();
        });
    });
}

// Starts (or restarts) the 60s "Expires in mm:ss" countdown, disabling
// Resend OTP until it runs out — mirrors the standalone OTP
// Verification page's timer.
function startRpOtpCountdown(seconds) {
    const timerEl = document.getElementById("responsiblePartyOtpTimer");
    const timerWrap = document.getElementById("responsiblePartyOtpTimerWrap");
    const resendBtn = document.getElementById("resendResponsiblePartyOtpBtn");

    if (rpOtpCountdownInterval) {
        clearInterval(rpOtpCountdownInterval);
        rpOtpCountdownInterval = null;
    }

    let time = seconds;
    if (resendBtn) resendBtn.disabled = true;
    if (timerWrap) timerWrap.classList.remove("expired");

    const render = () => {
        if (!timerEl) return;
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const secs = String(time % 60).padStart(2, "0");
        timerEl.textContent = `${minutes}:${secs}`;
    };

    render();

    rpOtpCountdownInterval = setInterval(() => {
        time--;
        if (time <= 0) {
            clearInterval(rpOtpCountdownInterval);
            rpOtpCountdownInterval = null;
            if (timerEl) timerEl.textContent = "Expired";
            if (timerWrap) timerWrap.classList.add("expired");
            if (resendBtn) resendBtn.disabled = false;
            return;
        }
        render();
    }, 1000);
}

function stopRpOtpCountdown() {
    if (rpOtpCountdownInterval) {
        clearInterval(rpOtpCountdownInterval);
        rpOtpCountdownInterval = null;
    }
}

// Generates a mock 4-digit OTP for whichever channel it was sent to.
// Only ever called for "phone" or "email" — the channel-selection modal
// handles "none" itself and never opens the code-entry modal at all.
// Swap this out for a real SMS/email gateway call in production —
// nothing else in the OTP flow needs to change, since
// verifyResponsiblePartyOTP() only compares against
// pendingResponsiblePartyOtp.
function generateResponsiblePartyOtp(channel) {
    if (!lastFoundAccount) return;

    const hint = document.getElementById("responsiblePartyOtpHint");

    pendingResponsiblePartyOtp = String(Math.floor(1000 + Math.random() * 9000));
    startRpOtpCountdown(60);

    if (hint) {
        if (channel === "email") {
            hint.textContent = lastFoundAccount.email
                ? `An OTP has been sent to ${lastFoundAccount.email}.`
                : "An OTP has been sent to the registered email address.";
        } else {
            hint.textContent = lastFoundAccount.phone
                ? `An OTP has been sent to +91 ${lastFoundAccount.phone}.`
                : "An OTP has been sent to the registered mobile number.";
        }
    }

    // Demo-only: surface the generated code since there is no real SMS/
    // email gateway wired up here. Remove this once a real send-OTP API
    // is in place.
    console.log("[demo] Responsible Party OTP:", pendingResponsiblePartyOtp);
}

// Clicking Continue on a found account doesn't link it right away — it
// opens the channel-selection modal first ("Send OTP Via"). Nothing
// about the account is applied to the form until verification succeeds
// (or, for "None", until proceedFromChannelSelection() links it directly).
function continueWithExistingAccount() {
    if (!lastFoundAccount) return;
    openResponsiblePartyChannelModal();
}

// Step 1 of 2: ask which channel to send the OTP via. No code is sent
// yet — that only happens once Continue is pressed here.
function openResponsiblePartyChannelModal() {
    if (!lastFoundAccount) return;

    const modal = document.getElementById("responsiblePartyChannelModal");
    const channelRadios = document.querySelectorAll('input[name="rpOtpChannel"]');

    // Default back to Phone each time the modal is opened fresh.
    channelRadios.forEach(r => { r.checked = (r.value === "phone"); });

    setResponsiblePartyState("otp");
    if (modal) modal.style.display = "flex";
}

// Closing without continuing doesn't link the account — fall back to
// the Found card so the person can retry Continue or search again.
function closeResponsiblePartyChannelModal() {
    const modal = document.getElementById("responsiblePartyChannelModal");
    if (modal) modal.style.display = "none";

    if (lastFoundAccount) {
        setResponsiblePartyState("found");
    }
}

// Reads the chosen channel and either links the account immediately
// ("None" — no code needed) or sends the OTP and opens step 2, the
// code-entry modal.
function proceedFromChannelSelection() {
    if (!lastFoundAccount) return;

    const channel = getSelectedRpOtpChannel();
    const channelModal = document.getElementById("responsiblePartyChannelModal");
    if (channelModal) channelModal.style.display = "none";

    if (channel === "none") {
        pendingResponsiblePartyOtp = null;
        linkResponsiblePartyAccount();
        return;
    }

    currentRpOtpChannel = channel;
    openResponsiblePartyOtpModal();
}

// Step 2 of 2: enter the code that was just sent.
function openResponsiblePartyOtpModal() {
    if (!lastFoundAccount) return;

    const modal = document.getElementById("responsiblePartyOtpModal");
    const otpError = document.getElementById("responsiblePartyOtpError");

    clearRpOtpInputs(false);
    if (otpError) otpError.hidden = true;

    generateResponsiblePartyOtp(currentRpOtpChannel);

    setResponsiblePartyState("otp");
    if (modal) modal.style.display = "flex";

    const inputs = getRpOtpInputs();
    if (inputs[0]) inputs[0].focus();
}

// Closing without verifying doesn't link the account — fall back to the
// Found card so the person can retry Continue or search again.
function closeResponsiblePartyOtpModal() {
    const modal = document.getElementById("responsiblePartyOtpModal");
    if (modal) modal.style.display = "none";

    stopRpOtpCountdown();
    pendingResponsiblePartyOtp = null;

    if (lastFoundAccount) {
        setResponsiblePartyState("found");
    }
}

// "Change" link on the code-entry modal — goes back to step 1 so the
// person can pick a different channel, without losing the found account.
function changeResponsiblePartyOtpChannel() {
    const otpModal = document.getElementById("responsiblePartyOtpModal");
    if (otpModal) otpModal.style.display = "none";

    stopRpOtpCountdown();
    pendingResponsiblePartyOtp = null;

    openResponsiblePartyChannelModal();
}

function resendResponsiblePartyOtp() {
    if (!lastFoundAccount) return;
    clearRpOtpInputs(false);
    const otpError = document.getElementById("responsiblePartyOtpError");
    if (otpError) otpError.hidden = true;
    generateResponsiblePartyOtp(currentRpOtpChannel);
    const inputs = getRpOtpInputs();
    if (inputs[0]) inputs[0].focus();
}

// Verifies the OTP against the mock code and, only on success, actually
// links the current new patient to the existing Responsible Party —
// never creates a duplicate account. ("None" never reaches this
// function at all — proceedFromChannelSelection() links it directly.)
function verifyResponsiblePartyOTP() {
    if (!lastFoundAccount) return;

    const otpError = document.getElementById("responsiblePartyOtpError");
    const entered = getRpOtpValue().trim();

    if (!entered || entered.length < RP_OTP_LENGTH || entered !== pendingResponsiblePartyOtp) {
        if (otpError) otpError.hidden = false;
        setRpOtpError(true);

        const group = document.getElementById("responsiblePartyOtpGroup");
        if (group) {
            group.classList.remove("rp-otp-shake");
            void group.offsetWidth;
            group.classList.add("rp-otp-shake");
        }

        clearRpOtpInputs(true);
        return;
    }

    const modal = document.getElementById("responsiblePartyOtpModal");
    if (modal) modal.style.display = "none";

    linkResponsiblePartyAccount();
}

// Actually links the current new patient to the existing Responsible
// Party account. Called either after a successful OTP check, or
// directly from proceedFromChannelSelection() when "None" was chosen
// and no code was ever needed.
function linkResponsiblePartyAccount() {
    selectedAccountHolder = lastFoundAccount;
    isExistingAccount = true;
    pendingResponsiblePartyOtp = null;
    stopRpOtpCountdown();

    // Populate Account Holder Name (read-only) and reveal Relationship
    // to Patient — Account Holder Name comes from the linked account,
    // only Relationship still needs the person's input.
    const holderNameInput = document.getElementById("accountHolderName");
    const relationSelect = document.getElementById("relationToPatient");
    if (holderNameInput) holderNameInput.value = lastFoundAccount.accountHolderName;
    if (relationSelect) relationSelect.value = "";

    setResponsiblePartyState("linked");

    const badge = document.getElementById("linkedAccountBadge");
    if (badge) {
        badge.hidden = false;
        badge.innerHTML = `✅ Responsible Party Linked — ${lastFoundAccount.accountHolderName} (${lastFoundAccount.accountId})`;
    }
}

// Clears all Responsible Party data/selection back to a blank slate.
// Purely a data reset — it does not decide what becomes visible next;
// callers follow it with the appropriate setResponsiblePartyState() call.
function resetResponsiblePartySearch() {
    const mobileInput = document.getElementById("responsiblePartyMobile");
    const nameInput = document.getElementById("responsiblePartyName");
    const dobInput = document.getElementById("responsiblePartyDob");
    const errorText = document.getElementById("responsiblePartySearchError");
    const holderNameInput = document.getElementById("accountHolderName");
    const relationSelect = document.getElementById("relationToPatient");
    const channelModal = document.getElementById("responsiblePartyChannelModal");
    const otpModal = document.getElementById("responsiblePartyOtpModal");
    const badge = document.getElementById("linkedAccountBadge");

    if (mobileInput) mobileInput.value = "";
    if (nameInput) nameInput.value = "";
    if (dobInput) dobInput.value = "";
    if (errorText) errorText.hidden = true;
    if (holderNameInput) holderNameInput.value = "";
    if (relationSelect) relationSelect.value = "";
    if (channelModal) channelModal.style.display = "none";
    if (otpModal) otpModal.style.display = "none";
    if (badge) {
        badge.hidden = true;
        badge.innerHTML = "";
    }

    stopRpOtpCountdown();
    clearRpOtpInputs(false);
    const otpError = document.getElementById("responsiblePartyOtpError");
    if (otpError) otpError.hidden = true;

    selectedAccountHolder = null;
    isExistingAccount = false;
    lastFoundAccount = null;
    pendingResponsiblePartyOtp = null;
    currentRpOtpChannel = "phone";
}
function searchResponsiblePartyAgain() {
    resetResponsiblePartySearch();
    setResponsiblePartyState("search");
}

// Wires up the Responsible Party search card's own controls. Kept
// isolated from the rest of booking.js's init — nothing here touches
// existing patient/insurance/payment logic.
function setupResponsiblePartySearch() {
    const searchBtn = document.getElementById("searchResponsiblePartyBtn");
    const mobileInput = document.getElementById("responsiblePartyMobile");
    const continueBtn = document.getElementById("continueWithAccountBtn");
    const searchAgainFoundBtn = document.getElementById("searchAgainFoundBtn");
    const searchAgainNotFoundBtn = document.getElementById("searchAgainNotFoundBtn");
    const continueChannelBtn = document.getElementById("continueRpChannelBtn");
    const changeChannelBtn = document.getElementById("changeRpOtpChannelBtn");
    const verifyOtpBtn = document.getElementById("verifyResponsiblePartyOtpBtn");
    const resendOtpBtn = document.getElementById("resendResponsiblePartyOtpBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", function (event) {
            event.preventDefault();
            searchResponsibleParty();
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchResponsibleParty();
            }
        });
    }

    const nameInput = document.getElementById("responsiblePartyName");
    const dobInput = document.getElementById("responsiblePartyDob");

    [nameInput, dobInput].forEach(function (field) {
        if (!field) return;
        field.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchResponsibleParty();
            }
        });
    });

    if (continueBtn) {
        continueBtn.addEventListener("click", function (event) {
            event.preventDefault();
            continueWithExistingAccount();
        });
    }

    if (searchAgainFoundBtn) {
        searchAgainFoundBtn.addEventListener("click", function (event) {
            event.preventDefault();
            searchResponsiblePartyAgain();
        });
    }

    if (searchAgainNotFoundBtn) {
        searchAgainNotFoundBtn.addEventListener("click", function (event) {
            event.preventDefault();
            searchResponsiblePartyAgain();
        });
    }

    if (continueChannelBtn) {
        continueChannelBtn.addEventListener("click", function (event) {
            event.preventDefault();
            proceedFromChannelSelection();
        });
    }

    if (changeChannelBtn) {
        changeChannelBtn.addEventListener("click", function (event) {
            event.preventDefault();
            changeResponsiblePartyOtpChannel();
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener("click", function (event) {
            event.preventDefault();
            verifyResponsiblePartyOTP();
        });
    }

    if (resendOtpBtn) {
        resendOtpBtn.addEventListener("click", function (event) {
            event.preventDefault();
            resendResponsiblePartyOtp();
        });
    }

    setupRpOtpInputs();
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
    setupResponsiblePartySearch();

    function formatDob(iso) {
        if (!iso) return "unknown";
        const [y, m, d] = iso.split("-");
        return `${d}-${m}-${y}`;
    }

    // Builds the centered icon+message shown in the patient list before a
    // search has been run, or when a search comes back with no matches.
    // "prompt" gets the blue search-icon badge (nudging the person to type);
    // "empty" gets a muted badge with a crossed-out search icon.
    function patientListEmptyStateHTML(text, variant) {
        const crossedOut = variant === "empty"
            ? '<line x1="8" y1="8" x2="14" y2="14"></line><line x1="14" y1="8" x2="8" y2="14"></line>'
            : "";
        const iconClass = variant === "empty"
            ? "patient-item-empty-icon patient-item-empty-icon-muted"
            : "patient-item-empty-icon";
        const stroke = variant === "empty" ? "#94a3b8" : "#3b5edb";

        return `<div class="patient-item-empty">
            <span class="${iconClass}" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="7"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    ${crossedOut}
                </svg>
            </span>
            <p>${text}</p>
        </div>`;
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
            listEl.innerHTML = patientListEmptyStateHTML("No matching patients found", "empty");
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
            listEl.innerHTML = patientListEmptyStateHTML("Enter a name or date of birth to search", "prompt");
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
        listEl.innerHTML = patientListEmptyStateHTML("Enter a name or date of birth to search", "prompt");
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

    const searchBtn = document.getElementById("patientSearchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", applyFilters);
    }

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

            const relationToPatient = isOtherHolder
                ? document.getElementById("relationToPatient").value
                : "Self";

            // Resolve which Responsible Party this new patient belongs to:
            //  - Option A (self): the patient becomes their own new account holder.
            //  - Option B, existing account: link to the account found by search
            //    (never mint a new accountId — that would duplicate the account).
            //  - Option B, new account: mint a fresh accountId, holder details
            //    come from the "Create New Account" fields + the searched mobile.
            let accountId;
            let accountHolderName;
            let accountHolderMobile = null;
            let accountHolderEmail = null;

            if (isOtherHolder && isExistingAccount && selectedAccountHolder) {
                accountId = selectedAccountHolder.accountId;
                accountHolderName = selectedAccountHolder.accountHolderName;
                accountHolderMobile = selectedAccountHolder.phone;
                accountHolderEmail = selectedAccountHolder.email;
            } else if (isOtherHolder) {
                accountId = "ACC" + Date.now();
                accountHolderName = document.getElementById("accountHolderName").value;
                const searchedMobile = document.getElementById("responsiblePartyMobile");
                accountHolderMobile = searchedMobile ? searchedMobile.value : null;
            } else {
                accountId = "ACC" + Date.now();
                accountHolderName = `${firstName} ${lastName}`.trim();
            }

            const newPatient = {
                id: "p" + Date.now(),
                firstName,
                lastName,
                relation: relationToPatient,
                accountHolder: accountHolderChoice,
                accountId,
                accountHolderName,
                accountHolderMobile,
                accountHolderEmail,
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
