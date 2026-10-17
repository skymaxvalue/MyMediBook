(function () {
  "use strict";

  var PATIENTS_KEY = "labServicePatients_v1";
  var RECORDS_KEY = "paymentRecords_v1";
  var COUNTER_KEY = "paymentTransactionCounter_v1";
  var HOME_URL = "dashboard.html";
  var STEP_LABELS = ["Select Patient", "Payment", "Invoice Summary", "Confirmation"];
  var SUBTITLES = [
    "Search and select a patient to process payment.",
    "Complete the payment details to generate the invoice.",
    "Review the invoice before confirming the payment.",
    "Payment outcome"
  ];
  var PROVIDERS = { card: "Card", paypal: "PayPal", venmo: "Venmo", gpay: "Google Pay" };
  var ZIP_RULES = {
    US: { label: "ZIP Code", placeholder: "ZIP Code", re: /^\d{5}(-\d{4})?$/, msg: "Enter a valid ZIP code (12345 or 12345-6789)." },
    IN: { label: "PIN Code", placeholder: "PIN Code", re: /^\d{6}$/, msg: "Enter a valid 6-digit PIN code." },
    GB: { label: "Postcode", placeholder: "Postcode", re: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, msg: "Enter a valid UK postcode." },
    CA: { label: "Postal Code", placeholder: "Postal Code", re: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, msg: "Enter a valid postal code (A1A 1A1)." },
    AU: { label: "Postcode", placeholder: "Postcode", re: /^\d{4}$/, msg: "Enter a valid 4-digit postcode." },
    SG: { label: "Postal Code", placeholder: "Postal Code", re: /^\d{6}$/, msg: "Enter a valid 6-digit postal code." },
    AE: { label: "Postal Code", placeholder: "Postal Code", re: /^[A-Za-z0-9 -]{3,10}$/, msg: "Enter a valid postal code." }
  };

  var state = {
    step: 1,
    patient: null,
    record: null,
    method: "card",
    provider: "card",
    card: null,
    cashConfirmed: false,
    processing: false,
    result: null
  };

  var memoryRecords = null;
  var modalReturnFocus = null;

  function $(id) { return document.getElementById(id); }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function money(n) { return "Rs " + Number(n).toLocaleString("en-IN"); }

  function formatDob(iso) {
    if (!iso) return "—";
    var p = String(iso).split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  function fullName(p) { return p.firstName + " " + p.lastName; }

  function seedPatients() {
    return [
      { id: "p1", mrn: "MRN-000001", firstName: "Rajesh", lastName: "Sharma", dob: "1990-05-12", gender: "Male", phone: "9998887770", insurance: "Star Health", memberId: "SH-778215" },
      { id: "p2", mrn: "MRN-000002", firstName: "Harshit", lastName: "Bhardwaj", dob: "1997-02-10", gender: "Male", phone: "9123456780", insurance: "", memberId: "" },
      { id: "p3", mrn: "MRN-000003", firstName: "Kavya", lastName: "Bhardwaj", dob: "2000-07-21", gender: "Female", phone: "9123456781", insurance: "", memberId: "" },
      { id: "p4", mrn: "MRN-000004", firstName: "Meera", lastName: "Sharma", dob: "2016-11-04", gender: "Female", phone: "9876543210", insurance: "", memberId: "" },
      { id: "p5", mrn: "MRN-000005", firstName: "Kabir", lastName: "Sharma", dob: "2012-01-19", gender: "Male", phone: "9876543210", insurance: "", memberId: "" },
      { id: "p6", mrn: "MRN-000006", firstName: "Priya", lastName: "Sharma", dob: "1985-03-22", gender: "Female", phone: "9876543210", insurance: "Care Plus", memberId: "CP-552310" }
    ];
  }

  function loadPatients() {
    try {
      var raw = localStorage.getItem(PATIENTS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      return seedPatients();
    }
    return seedPatients();
  }

  function seedRecords() {
    var base = { demo: true, transactionRef: "", paymentMethod: "", paidAt: "" };
    function rec(id, patientId, doctor, feeType, description, amount, status) {
      return Object.assign({ id: id, patientId: patientId, doctor: doctor, feeType: feeType, description: description, amount: amount, status: status }, base);
    }
    return [
      rec("PR-1001", "p1", "Dr Arunkumar", "Consultation", "Outpatient consultation", 900, "Unpaid"),
      rec("PR-1002", "p1", "Dr Sanjay", "Consultation", "Follow-up consultation", 500, "Paid"),
      rec("PR-1003", "p2", "Dr Sanjay", "Consultation", "Outpatient consultation", 500, "Unpaid"),
      rec("PR-1004", "p3", "Dr Arunkumar", "Consultation", "Outpatient consultation", 900, "Unpaid"),
      rec("PR-1005", "p4", "Dr Meena", "Consultation", "Paediatric consultation", 600, "Unpaid"),
      rec("PR-1006", "p5", "Dr Meena", "Consultation", "Paediatric consultation", 600, "Paid"),
      rec("PR-1007", "p6", "Dr Arunkumar", "Consultation", "Outpatient consultation", 900, "Unpaid")
    ];
  }

  function getRecords() {
    try {
      var raw = localStorage.getItem(RECORDS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      var seeded = seedRecords();
      localStorage.setItem(RECORDS_KEY, JSON.stringify(seeded));
      return seeded;
    } catch (e) {
      if (!memoryRecords) memoryRecords = seedRecords();
      return memoryRecords;
    }
  }

  function saveRecords(list) {
    memoryRecords = list;
    localStorage.setItem(RECORDS_KEY, JSON.stringify(list));
  }

  function findRecord(id) {
    return getRecords().filter(function (r) { return r.id === id; })[0] || null;
  }

  function markRecordPaid(id, patch) {
    var list = getRecords();
    var rec = list.filter(function (r) { return r.id === id; })[0];
    if (!rec) throw new Error("missing");
    if (rec.status === "Paid") throw new Error("duplicate");
    Object.assign(rec, patch, { status: "Paid" });
    saveRecords(list);
    return rec;
  }

  function nextReference() {
    var next = 1;
    try { next = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10) + 1; localStorage.setItem(COUNTER_KEY, String(next)); }
    catch (e) { next = Date.now() % 1000000; }
    return "PAY-" + String(next).padStart(6, "0");
  }

  function announce(text) {
    var live = $("payLive");
    live.textContent = "";
    window.setTimeout(function () { live.textContent = text; }, 30);
  }

  function setError(inputId, message) {
    var input = $(inputId);
    var err = $(inputId + "Error");
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
    if (err) {
      err.textContent = message || "";
      err.hidden = !message;
    }
  }

  function clearErrors() {
    ["cardNumber", "cardExpiry", "cardCvv", "cardName", "cardCountry", "cardZip", "cashConfirm"].forEach(function (id) { setError(id, ""); });
  }

  function clearSensitive() {
    ["cardNumber", "cardExpiry", "cardCvv"].forEach(function (id) {
      var el = $(id);
      if (el) el.value = "";
    });
    updateBrand("");
    updateCvvHint("");
  }

  function digitsOf(value) { return String(value || "").replace(/\D/g, ""); }

  function detectBrand(digits) {
    if (/^4/.test(digits)) return "Visa";
    if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "American Express";
    return "";
  }

  function luhn(digits) {
    var sum = 0, alt = false;
    for (var i = digits.length - 1; i >= 0; i--) {
      var n = parseInt(digits.charAt(i), 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function updateBrand(digits) {
    var brand = detectBrand(digits);
    var el = $("cardBrand");
    el.innerHTML = brand ? esc(brand === "American Express" ? "AMEX" : brand.toUpperCase()) : '<svg><use href="#i-card"/></svg>';
  }

  function updateCvvHint(digits) {
    var amex = detectBrand(digits) === "American Express";
    $("cardCvvHint").textContent = amex ? "4 digits for American Express" : "3 digits (4 for American Express)";
  }

  function formatCardNumber(raw) {
    var digits = digitsOf(raw);
    var amex = detectBrand(digits) === "American Express";
    digits = digits.slice(0, amex ? 15 : 16);
    if (amex) return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(" ");
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(raw) {
    var digits = digitsOf(raw).slice(0, 4);
    if (digits.length === 1 && parseInt(digits, 10) > 1) digits = "0" + digits;
    if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  function validateNumber() {
    var digits = digitsOf($("cardNumber").value);
    var amex = detectBrand(digits) === "American Express";
    var msg = "";
    if (!digits) msg = "Enter the card number.";
    else if (digits.length !== (amex ? 15 : 16)) msg = "Card number must have " + (amex ? 15 : 16) + " digits.";
    else if (!luhn(digits)) msg = "This card number is not valid. Check it and try again.";
    setError("cardNumber", msg);
    return !msg;
  }

  function validateExpiry() {
    var digits = digitsOf($("cardExpiry").value);
    var msg = "";
    if (!digits) msg = "Enter the expiry date.";
    else if (digits.length < 4) msg = "Enter the expiry date as MM / YY.";
    else {
      var month = parseInt(digits.slice(0, 2), 10);
      var year = 2000 + parseInt(digits.slice(2), 10);
      var now = new Date();
      if (month < 1 || month > 12) msg = "Month must be between 01 and 12.";
      else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) msg = "This card has expired.";
      else if (year > now.getFullYear() + 20) msg = "Enter a valid expiry year.";
    }
    setError("cardExpiry", msg);
    return !msg;
  }

  function validateCvv() {
    var digits = digitsOf($("cardCvv").value);
    var amex = detectBrand(digitsOf($("cardNumber").value)) === "American Express";
    var need = amex ? 4 : 3;
    var msg = "";
    if (!digits) msg = "Enter the CVV.";
    else if (digits.length !== need) msg = "CVV must have " + need + " digits.";
    setError("cardCvv", msg);
    return !msg;
  }

  function validateName() {
    var value = $("cardName").value.trim();
    var msg = "";
    if (!value) msg = "Enter the cardholder name.";
    else if (value.length < 2 || !/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F .'-]*$/.test(value)) msg = "Enter the name exactly as it appears on the card.";
    setError("cardName", msg);
    return !msg;
  }

  function validateCountry() {
    var msg = $("cardCountry").value ? "" : "Select a country.";
    setError("cardCountry", msg);
    return !msg;
  }

  function validateZip() {
    var rule = ZIP_RULES[$("cardCountry").value];
    var value = $("cardZip").value.trim();
    var msg = "";
    if (!value) msg = "Enter the " + (rule ? rule.label : "postal code") + ".";
    else if (rule && !rule.re.test(value)) msg = rule.msg;
    setError("cardZip", msg);
    return !msg;
  }

  function validateCash() {
    var ok = $("cashConfirm").checked;
    setError("cashConfirm", ok ? "" : "Confirm that the cash has been received before continuing.");
    return ok;
  }

  function updateZipField() {
    var rule = ZIP_RULES[$("cardCountry").value] || { label: "Postal Code", placeholder: "Postal Code" };
    $("cardZipLabel").textContent = rule.label;
    $("cardZip").placeholder = rule.placeholder;
  }

  function updateStepper() {
    var items = document.querySelectorAll("#payStepper .pay-step");
    var outcome = state.result ? (state.result.ok ? "ok" : "fail") : "";
    Array.prototype.forEach.call(items, function (li) {
      var n = parseInt(li.dataset.step, 10);
      var btn = li.querySelector("button");
      var status = "upcoming";
      li.className = "pay-step";
      btn.removeAttribute("aria-current");
      if (outcome === "ok") {
        li.classList.add("is-complete");
        status = "completed";
        if (n === 4) btn.setAttribute("aria-current", "step");
      } else if (outcome === "fail") {
        if (n < 4) { li.classList.add("is-complete"); status = "completed"; }
        else { li.classList.add("is-failed"); status = "failed"; btn.setAttribute("aria-current", "step"); }
      } else if (n < state.step) {
        li.classList.add("is-complete");
        status = "completed";
      } else if (n === state.step) {
        li.classList.add("is-current");
        status = "current";
        btn.setAttribute("aria-current", "step");
      }
      btn.disabled = !(n < state.step && !outcome && !state.processing);
      btn.setAttribute("aria-label", "Step " + n + ": " + STEP_LABELS[n - 1] + ", " + status);
    });
    $("payStepBadge").textContent = "Step " + state.step + " of 4";
  }

  function goTo(n) {
    if (state.step === 2 && n !== 2) clearSensitive();
    state.step = n;
    Array.prototype.forEach.call(document.querySelectorAll(".pay-panel"), function (panel) {
      panel.hidden = parseInt(panel.dataset.panel, 10) !== n;
    });
    $("paySubtitle").textContent = state.result && !state.result.ok ? "We couldn't complete your payment." : (state.result ? "Your payment has been processed successfully." : SUBTITLES[n - 1]);
    updateStepper();
    if (n === 1) renderRecords();
    var panel = document.querySelector('.pay-panel[data-panel="' + n + '"]');
    panel.focus();
    announce("Step " + n + " of 4: " + STEP_LABELS[n - 1]);
  }

  var lastNameInput, dobInput, mobileInput, resultsEl, searchBtn, clearBtn;
  var activeIndex = -1;
  var debounceTimer = null;

  function normalizePhone(v) { return String(v || "").replace(/\D/g, ""); }

  function runSearch() {
    var ln = lastNameInput.value.trim().toLowerCase();
    var d = dobInput.value;
    var ph = normalizePhone(mobileInput.value);
    if (!ln && !d && !ph) { renderResults([]); return; }
    var list = loadPatients().filter(function (p) {
      var lastDob = ln !== "" && String(p.lastName).toLowerCase().indexOf(ln) !== -1 && (d === "" || p.dob === d);
      var phone = ph !== "" && normalizePhone(p.phone).indexOf(ph) !== -1;
      return lastDob || phone;
    });
    renderResults(list);
  }

  function setExpanded(open) {
    [lastNameInput, mobileInput].forEach(function (el) { el.setAttribute("aria-expanded", open ? "true" : "false"); });
  }

  function closeResults() {
    resultsEl.classList.remove("show");
    resultsEl.innerHTML = "";
    resultsEl.removeAttribute("aria-activedescendant");
    activeIndex = -1;
    setExpanded(false);
  }

  function optionEls() { return Array.prototype.slice.call(resultsEl.querySelectorAll('[role="option"]')); }

  function setActiveOption(index) {
    var options = optionEls();
    if (!options.length) return;
    activeIndex = (index + options.length) % options.length;
    options.forEach(function (opt, i) {
      var on = i === activeIndex;
      opt.classList.toggle("is-active", on);
      opt.setAttribute("aria-selected", on ? "true" : "false");
    });
    resultsEl.setAttribute("aria-activedescendant", options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function renderResults(list) {
    activeIndex = -1;
    resultsEl.classList.add("show");
    setExpanded(true);
    if (!list.length) {
      resultsEl.innerHTML = '<div class="pay-empty-result" role="status">No Matching Record Found</div>';
      resultsEl.removeAttribute("aria-activedescendant");
      return;
    }
    resultsEl.innerHTML = list.map(function (p) {
      return '<div class="pay-result-item" id="patient-option-' + esc(p.id) + '" role="option" aria-selected="false" data-id="' + esc(p.id) + '">' +
        '<div class="pay-result-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></div>' +
        '<div class="pay-result-info"><div class="pay-result-name">' + esc(fullName(p)) + '</div><div class="pay-result-meta">' + esc(p.phone) + ' • MRN ' + esc(p.mrn) + '</div></div>' +
        '<button type="button" class="pay-btn pay-btn--secondary pay-btn--sm pay-result-select" data-id="' + esc(p.id) + '" aria-label="Select ' + esc(fullName(p)) + ' as patient">Select Patient</button></div>';
    }).join("");
  }

  function resetTransaction() {
    state.record = null;
    state.card = null;
    state.cashConfirmed = false;
    state.result = null;
    $("cashConfirm").checked = false;
    clearErrors();
    clearSensitive();
  }

  function selectPatientById(id) {
    var patient = loadPatients().filter(function (p) { return p.id === id; })[0];
    if (!patient) return;
    if (!state.patient || state.patient.id !== patient.id) resetTransaction();
    state.patient = patient;
    lastNameInput.value = patient.lastName;
    dobInput.value = patient.dob;
    mobileInput.value = patient.phone;
    closeResults();
    $("paySelectedName").textContent = fullName(patient);
    $("paySelectedMeta").textContent = "MRN " + patient.mrn + " • " + patient.phone + " • DOB " + formatDob(patient.dob);
    $("paySelectedPatient").hidden = false;
    renderRecords();
    var firstRadio = document.querySelector('#payRecordsBody input[type="radio"]:not(:disabled)');
    if (firstRadio) firstRadio.focus();
    announce(fullName(patient) + " selected. " + patientRecords().length + " payment record" + (patientRecords().length === 1 ? "" : "s") + " found.");
  }

  function clearPatient() {
    lastNameInput.value = "";
    dobInput.value = "";
    mobileInput.value = "";
    state.patient = null;
    resetTransaction();
    $("paySelectedPatient").hidden = true;
    closeResults();
    renderRecords();
  }

  function patientRecords() {
    if (!state.patient) return [];
    return getRecords().filter(function (r) { return r.patientId === state.patient.id; });
  }

  function renderRecords() {
    var body = $("payRecordsBody");
    var hint = $("payRecordsHint");
    var list = patientRecords();
    if (state.record && !list.some(function (r) { return r.id === state.record.id && r.status === "Unpaid"; })) state.record = null;

    if (!state.patient) {
      hint.textContent = "Select a patient to view and process payment.";
      body.innerHTML = '<tr><td colspan="8" class="pay-table-empty"><strong>No patient selected.</strong><br>Search for a patient above and choose Select Patient to see their payment records.</td></tr>';
    } else if (!list.length) {
      hint.textContent = "No payment records for " + fullName(state.patient) + ".";
      body.innerHTML = '<tr><td colspan="8" class="pay-table-empty"><strong>No payment records found.</strong><br>There is nothing to pay for this patient yet.</td></tr>';
    } else {
      hint.textContent = "Select an unpaid record to process payment.";
      body.innerHTML = list.map(function (r) {
        var unpaid = r.status === "Unpaid";
        var selected = state.record && state.record.id === r.id;
        var cls = (selected ? "is-selected " : "") + (unpaid ? "is-clickable" : "is-disabled");
        var p = state.patient;
        return '<tr class="' + cls + '" data-id="' + esc(r.id) + '">' +
          '<td class="pay-col-radio"><input type="radio" name="payRecord" value="' + esc(r.id) + '"' + (selected ? " checked" : "") + (unpaid ? "" : " disabled") +
          ' aria-label="Select payment record ' + esc(r.id) + ' for ' + esc(fullName(p)) + ', ' + esc(money(r.amount)) + ', ' + esc(r.status) + '"></td>' +
          '<td>' + esc(fullName(p)) + '</td><td>' + esc(formatDob(p.dob)) + '</td><td>' + esc(p.address || "—") + '</td><td>' + esc(p.phone) + '</td>' +
          '<td>' + esc(r.doctor) + '</td><td>' + esc(money(r.amount)) + '</td>' +
          '<td><span class="pay-pill pay-pill--' + (unpaid ? "unpaid" : "paid") + '">' + esc(r.status) + '</span></td></tr>';
      }).join("");
    }
    $("payContinue1").disabled = !(state.patient && state.record);
  }

  function selectRecord(id) {
    var rec = findRecord(id);
    if (!rec || rec.status !== "Unpaid") return;
    state.record = rec;
    state.card = null;
    state.cashConfirmed = false;
    $("cashConfirm").checked = false;
    var err = $("payRecordError");
    err.hidden = true;
    err.textContent = "";
    renderRecords();
    var radio = document.querySelector('#payRecordsBody input[value="' + rec.id + '"]');
    if (radio) radio.focus();
  }

  function continueFromStep1() {
    if (!state.patient || !state.record) return;
    var fresh = findRecord(state.record.id);
    if (!fresh || fresh.status !== "Unpaid") {
      var err = $("payRecordError");
      err.textContent = "This record is already marked Paid and cannot be processed again.";
      err.hidden = false;
      state.record = null;
      renderRecords();
      return;
    }
    state.record = fresh;
    enterStep2(false);
  }

  function methodLabel() {
    if (state.method === "cash") return "Cash Payment (front desk)";
    if (state.provider === "card") {
      return state.card ? "Card Payment — " + (state.card.brand || "Card") + " ending " + state.card.last4 : "Card Payment";
    }
    return "Card Payment — " + PROVIDERS[state.provider] + " (prototype wallet)";
  }

  function renderStep2Summary() {
    var p = state.patient, r = state.record;
    $("sumName").textContent = fullName(p);
    $("sumDob").textContent = formatDob(p.dob);
    $("sumPhone").textContent = p.phone || "—";
    $("sumAddress").textContent = p.address || "Not on file";
    $("sumDoctor").textContent = r.doctor;
    $("sumFeeType").textContent = r.feeType;
    $("sumFee").textContent = money(r.amount);
    document.querySelector(".pay-summary__fee dt").textContent = r.feeType + " Fee";
    $("cashAmount").textContent = money(r.amount);
    $("cashConfirmText").textContent = "I confirm the front desk has received " + money(r.amount) + " in cash from " + fullName(p) + ".";
  }

  function applyMethodUI() {
    var isCard = state.method === "card";
    var wallet = isCard && state.provider !== "card";
    $("payCardSection").hidden = !isCard;
    $("payCashSection").hidden = isCard;
    $("payCardForm").hidden = wallet;
    $("payWalletNote").hidden = !wallet;
    $("payMethodCardLabel").classList.toggle("is-selected", isCard);
    $("payMethodCashLabel").classList.toggle("is-selected", !isCard);
    Array.prototype.forEach.call(document.querySelectorAll(".pay-provider"), function (label) {
      label.classList.toggle("is-selected", label.querySelector("input").checked);
    });
    if (wallet) {
      var name = PROVIDERS[state.provider];
      $("payWalletText").textContent = name + " is not connected in this prototype. Continuing simulates a " + name + " payment; no real account is contacted and no real charge is made.";
    }
    $("payProviderTitle").textContent = wallet ? PROVIDERS[state.provider] + " Payment" : "Card Payment Details";
  }

  function enterStep2(showClearedNote) {
    state.card = null;
    renderStep2Summary();
    clearErrors();
    clearSensitive();
    $("payCardClearedNote").hidden = !(showClearedNote && state.method === "card" && state.provider === "card");
    applyMethodUI();
    goTo(2);
  }

  function continueFromStep2() {
    clearErrors();
    var firstInvalid = null;
    function check(ok, id) { if (!ok && !firstInvalid) firstInvalid = id; }

    if (state.method === "card" && state.provider === "card") {
      check(validateNumber(), "cardNumber");
      check(validateExpiry(), "cardExpiry");
      check(validateCvv(), "cardCvv");
      check(validateName(), "cardName");
      check(validateCountry(), "cardCountry");
      check(validateZip(), "cardZip");
      if (firstInvalid) { $(firstInvalid).focus(); return; }
      var digits = digitsOf($("cardNumber").value);
      state.card = { brand: detectBrand(digits), last4: digits.slice(-4), decline: digits === "4000000000000002" };
    } else if (state.method === "cash") {
      if (!validateCash()) { $("cashConfirm").focus(); return; }
      state.cashConfirmed = true;
      state.card = null;
    } else {
      state.card = null;
    }
    renderInvoice();
    goTo(3);
  }

  function row(label, value) { return '<div class="pay-row"><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>'; }

  function renderInvoice() {
    var p = state.patient, r = state.record;
    $("invoiceRows").innerHTML =
      row("Invoice Reference", "Assigned after successful payment") +
      row("Patient Name", fullName(p)) +
      row("MRN", p.mrn || "—") +
      row("Consulting Doctor", r.doctor) +
      row("Visit / Service", r.description) +
      row("Fee Type", r.feeType) +
      row("Original Fee", money(r.amount)) +
      row("Amount Due", money(r.amount)) +
      row("Payment Method", methodLabel());
    $("invoiceTotal").textContent = money(r.amount);
    $("invoiceNote").textContent = state.method === "cash"
      ? "Prototype: the cash hand-over was confirmed on the previous step. The record is marked Paid only after you choose Confirm Payment. No payment gateway is connected."
      : "Prototype: this payment is simulated in your browser. No payment gateway is connected and no real charge is made. The record is marked Paid only after you choose Confirm Payment.";
    var err = $("invoiceError");
    err.hidden = true;
    err.textContent = "";
    setProcessing(false);
  }

  function setProcessing(on) {
    state.processing = on;
    $("payConfirm").disabled = on;
    $("payBack3").disabled = on;
    $("payConfirmLabel").textContent = on ? "Processing payment…" : "Confirm Payment";
    document.querySelector('.pay-panel[data-panel="3"]').setAttribute("aria-busy", on ? "true" : "false");
    updateStepper();
  }

  function confirmPayment() {
    if (state.processing || state.result) return;
    var err = $("invoiceError");
    err.hidden = true;
    var fresh = findRecord(state.record.id);
    if (!fresh || fresh.status !== "Unpaid") {
      err.textContent = "This record is already marked Paid, so it cannot be charged again.";
      err.hidden = false;
      return;
    }
    setProcessing(true);
    announce("Processing payment");
    window.setTimeout(finishPayment, 1200);
  }

  function simulateOutcome() {
    if (state.method === "card" && state.provider === "card" && state.card && state.card.decline) {
      return { ok: false, reason: "The simulated payment processor declined this card (prototype test decline). Wrong card number, expiry date, CVV, or name entered." };
    }
    return { ok: true };
  }

  function finishPayment() {
    var outcome = simulateOutcome();
    var rec = state.record;
    var method = methodLabel();
    if (outcome.ok) {
      try {
        var ref = nextReference();
        var storedMethod = state.method === "card" && state.provider === "card" ? "Card Payment — " + (state.card && state.card.brand ? state.card.brand : "Card") : method;
        var saved = markRecordPaid(rec.id, { transactionRef: ref, paymentMethod: storedMethod, paidAt: new Date().toISOString() });
        outcome = { ok: true, ref: saved.transactionRef };
      } catch (e) {
        outcome = {
          ok: false,
          reason: e && e.message === "duplicate"
            ? "This record was already paid, so a second payment was not created."
            : "The payment result could not be saved in this browser, so the record was not marked Paid."
        };
      }
    }
    state.result = { ok: outcome.ok, ref: outcome.ref || "", reason: outcome.reason || "", method: method };
    state.card = null;
    clearSensitive();
    state.processing = false;
    $("payConfirm").disabled = false;
    $("payBack3").disabled = false;
    $("payConfirmLabel").textContent = "Confirm Payment";
    document.querySelector('.pay-panel[data-panel="3"]').setAttribute("aria-busy", "false");
    showOutcome();
  }

  function showOutcome() {
    var r = state.result, p = state.patient, rec = state.record;
    $("payResultSuccess").hidden = !r.ok;
    $("payResultFailed").hidden = r.ok;
    if (r.ok) {
      $("successRows").innerHTML =
        row("Transaction Reference #", r.ref) +
        row("Patient Name", fullName(p)) +
        row("Doctor Name", rec.doctor) +
        row(rec.feeType + " Fee", money(rec.amount)) +
        row("Payment Method", r.method);
      $("successProto").textContent = "Prototype: this reference was generated locally for demonstration. No real charge was made.";
    } else {
      $("failReason").textContent = r.reason;
      $("failRows").innerHTML =
        row("Patient Name", fullName(p)) +
        row("Doctor Name", rec.doctor) +
        row(rec.feeType + " Fee", money(rec.amount)) +
        row("Payment Method", r.method);
    }
    goTo(4);
    announce(r.ok ? "Payment successful. Reference " + r.ref : "Payment failed. " + r.reason);
  }

  function hasWork() {
    return !!(state.patient || lastNameInput.value.trim() || dobInput.value || mobileInput.value.trim());
  }

  function openModal() {
    modalReturnFocus = document.activeElement;
    $("payCancelModal").hidden = false;
    $("payCancelKeep").focus();
    document.addEventListener("keydown", modalKeydown);
  }

  function closeModal() {
    $("payCancelModal").hidden = true;
    document.removeEventListener("keydown", modalKeydown);
    if (modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus();
    modalReturnFocus = null;
  }

  function modalKeydown(e) {
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key !== "Tab") return;
    var items = [$("payCancelKeep"), $("payCancelLeave")];
    var idx = items.indexOf(document.activeElement);
    if (e.shiftKey && idx <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && idx === items.length - 1) { e.preventDefault(); items[0].focus(); }
  }

  function requestCancel() {
    if (hasWork()) openModal();
    else goHome();
  }

  function goHome() {
    clearSensitive();
    window.location.href = HOME_URL;
  }

  function closeAfterSuccess() {
    state.record = null;
    state.result = null;
    state.card = null;
    state.cashConfirmed = false;
    $("cashConfirm").checked = false;
    goTo(1);
  }

  function closeAfterFailure() {
    state.result = null;
    state.card = null;
    goTo(1);
  }

  function retryPayment() {
    state.result = null;
    state.cashConfirmed = false;
    $("cashConfirm").checked = false;
    enterStep2(true);
  }

  function initSearch() {
    lastNameInput = $("patientLastNameSearch");
    dobInput = $("patientDobSearch");
    mobileInput = $("patientMobileSearch");
    resultsEl = $("patientSearchResults");
    searchBtn = $("patientSearchBtn");
    clearBtn = $("patientClearBtn");
    dobInput.max = new Date().toISOString().slice(0, 10);

    searchBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      clearTimeout(debounceTimer);
      runSearch();
    });
    clearBtn.addEventListener("click", clearPatient);

    [lastNameInput, dobInput, mobileInput].forEach(function (input) {
      input.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runSearch, 300);
      });
      input.addEventListener("keydown", function (e) {
        var options = optionEls();
        if (e.key === "Enter") {
          e.preventDefault();
          if (activeIndex >= 0 && options[activeIndex]) selectPatientById(options[activeIndex].dataset.id);
          else { clearTimeout(debounceTimer); runSearch(); }
        } else if (e.key === "Escape") {
          closeResults();
        } else if (e.key === "ArrowDown" && resultsEl.classList.contains("show")) {
          e.preventDefault();
          setActiveOption(activeIndex + 1);
        } else if (e.key === "ArrowUp" && resultsEl.classList.contains("show")) {
          e.preventDefault();
          setActiveOption(activeIndex - 1);
        }
      });
    });

    resultsEl.addEventListener("click", function (e) {
      var item = e.target.closest(".pay-result-item");
      if (item) selectPatientById(item.dataset.id);
    });

    document.addEventListener("click", function (e) {
      var inside = resultsEl.contains(e.target) || lastNameInput.contains(e.target) || dobInput.contains(e.target) ||
        mobileInput.contains(e.target) || searchBtn.contains(e.target) || clearBtn.contains(e.target);
      if (!inside) closeResults();
    });
  }

  function initRecords() {
    var body = $("payRecordsBody");
    body.addEventListener("change", function (e) {
      if (e.target.name === "payRecord") selectRecord(e.target.value);
    });
    body.addEventListener("click", function (e) {
      var tr = e.target.closest("tr.is-clickable");
      if (tr && e.target.tagName !== "INPUT") selectRecord(tr.dataset.id);
    });
  }

  function initCardInputs() {
    var number = $("cardNumber"), expiry = $("cardExpiry"), cvv = $("cardCvv"), name = $("cardName"), zip = $("cardZip"), country = $("cardCountry");

    number.addEventListener("input", function () {
      number.value = formatCardNumber(number.value);
      var digits = digitsOf(number.value);
      updateBrand(digits);
      updateCvvHint(digits);
      cvv.maxLength = detectBrand(digits) === "American Express" ? 4 : 3;
      cvv.value = digitsOf(cvv.value).slice(0, cvv.maxLength);
      if (number.getAttribute("aria-invalid")) validateNumber();
    });
    expiry.addEventListener("input", function () {
      expiry.value = formatExpiry(expiry.value);
      if (expiry.getAttribute("aria-invalid")) validateExpiry();
    });
    cvv.addEventListener("input", function () {
      cvv.value = digitsOf(cvv.value).slice(0, cvv.maxLength || 3);
      if (cvv.getAttribute("aria-invalid")) validateCvv();
    });
    name.addEventListener("input", function () { if (name.getAttribute("aria-invalid")) validateName(); });
    zip.addEventListener("input", function () {
      zip.value = zip.value.toUpperCase();
      if (zip.getAttribute("aria-invalid")) validateZip();
    });
    country.addEventListener("change", function () {
      updateZipField();
      validateCountry();
      if (zip.value) validateZip();
    });

    number.addEventListener("blur", function () { if (number.value) validateNumber(); });
    expiry.addEventListener("blur", function () { if (expiry.value) validateExpiry(); });
    cvv.addEventListener("blur", function () { if (cvv.value) validateCvv(); });
    name.addEventListener("blur", function () { if (name.value) validateName(); });
    zip.addEventListener("blur", function () { if (zip.value) validateZip(); });

    $("payCardForm").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); continueFromStep2(); }
    });

    Array.prototype.forEach.call(document.querySelectorAll('input[name="payMethod"]'), function (radio) {
      radio.addEventListener("change", function () {
        state.method = radio.value;
        clearErrors();
        applyMethodUI();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="payProvider"]'), function (radio) {
      radio.addEventListener("change", function () {
        state.provider = radio.value;
        clearErrors();
        applyMethodUI();
      });
    });
    $("cashConfirm").addEventListener("change", function () {
      if ($("cashConfirm").checked) setError("cashConfirm", "");
    });
  }

  function initNavigation() {
    $("payCancel1").addEventListener("click", requestCancel);
    $("payCancel2").addEventListener("click", requestCancel);
    $("payContinue1").addEventListener("click", continueFromStep1);
    $("payBack2").addEventListener("click", function () { goTo(1); });
    $("payContinue2").addEventListener("click", continueFromStep2);
    $("payBack3").addEventListener("click", function () { if (!state.processing) enterStep2(true); });
    $("payConfirm").addEventListener("click", confirmPayment);
    $("successHome").addEventListener("click", goHome);
    $("failHome").addEventListener("click", goHome);
    $("successClose").addEventListener("click", closeAfterSuccess);
    $("failClose").addEventListener("click", closeAfterFailure);
    $("failRetry").addEventListener("click", retryPayment);
    $("payCancelKeep").addEventListener("click", closeModal);
    $("payCancelLeave").addEventListener("click", function () { closeModal(); goHome(); });
    $("payCancelModal").addEventListener("click", function (e) { if (e.target === $("payCancelModal")) closeModal(); });

    $("payStepper").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-goto]");
      if (!btn || btn.disabled) return;
      var n = parseInt(btn.dataset.goto, 10);
      if (n >= state.step || state.result || state.processing) return;
      if (n === 2) enterStep2(true);
      else goTo(n);
    });
  }

  window.addEventListener("pagehide", clearSensitive);

  document.addEventListener("DOMContentLoaded", function () {
    initSearch();
    initRecords();
    initCardInputs();
    initNavigation();
    updateZipField();
    renderRecords();
    updateStepper();
  });
})();
