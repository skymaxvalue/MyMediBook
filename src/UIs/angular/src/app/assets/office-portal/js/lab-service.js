
const PATIENTS_KEY = "labServicePatients_v1";

function seedPatients() {
  return [
    { id: "p1", mrn: "MRN-000001", firstName: "Rajesh", lastName: "Sharma", dob: "1990-05-12", gender: "Male",
      phone: "9998887770", insurance: "Star Health", memberId: "SH-778215" },

    { id: "p2", mrn: "MRN-000002", firstName: "Harshit", lastName: "Bhardwaj", dob: "1997-02-10", gender: "Male",
      phone: "9123456780", insurance: "", memberId: "" },

    { id: "p3", mrn: "MRN-000003", firstName: "Kavya", lastName: "Bhardwaj", dob: "2000-07-21", gender: "Female",
      phone: "9123456781", insurance: "", memberId: "" },

    { id: "p4", mrn: "MRN-000004", firstName: "Meera", lastName: "Sharma", dob: "2016-11-04", gender: "Female",
      phone: "9876543210", insurance: "", memberId: "" },

    { id: "p5", mrn: "MRN-000005", firstName: "Kabir", lastName: "Sharma", dob: "2012-01-19", gender: "Male",
      phone: "9876543210", insurance: "", memberId: "" },

    { id: "p6", mrn: "MRN-000006", firstName: "Priya", lastName: "Sharma", dob: "1985-03-22", gender: "Female",
      phone: "9876543210", insurance: "Care Plus", memberId: "CP-552310" }
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


function deriveMrn(p) {
  const digits = String(p.id).replace(/\D/g, "").padStart(6, "0");
  return "MRN-" + digits;
}

let allPatients = [];
let selectedPatientId = null;
let selectedPatientRecord = null;

(function () {
  "use strict";

  function wireChipRow(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var chips = el.querySelectorAll(".ls-chip");
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        Array.prototype.forEach.call(chips, function (c) {
          c.classList.remove("is-selected");
          var check = c.querySelector("svg");
          if (check) check.remove();
        });
        chip.classList.add("is-selected");
        if (!chip.querySelector("svg")) {
          chip.insertAdjacentHTML(
            "afterbegin",
            '<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          );
        }
      });
    });
  }


  function wireCheckTileGrid(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var tiles = el.querySelectorAll(".ls-check-tile");
    Array.prototype.forEach.call(tiles, function (tile) {
      tile.addEventListener("click", function () {
        tile.classList.toggle("is-selected");
      });
    });
  }


  function wireRadioGroup(groupId) {
    var group = document.getElementById(groupId);
    if (!group) return;
    var cards = group.querySelectorAll(".ls-radio-card");
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener("click", function () {
        Array.prototype.forEach.call(cards, function (c) {
          c.classList.remove("is-selected");
        });
        card.classList.add("is-selected");
      });
    });
  }



  function getSelectedSpecimenLabel() {
    var el = document.getElementById("lab-specimen-type");
    if (!el) return "";
    var chip = el.querySelector(".ls-chip.is-selected");
    return chip ? chip.textContent.trim() : "";
  }

  function getSelectedTestLabels() {
    var el = document.getElementById("lab-tests-grid");
    if (!el) return [];
    var tiles = el.querySelectorAll(".ls-check-tile.is-selected");
    return Array.prototype.map.call(tiles, function (t) {
      var strong = t.querySelector(".ls-check-tile__text strong");
      return strong ? strong.textContent.trim() : "";
    }).filter(Boolean);
  }

  function getSelectedPriorityLabel() {
    var el = document.getElementById("lab-priority");
    if (!el) return "";
    var card = el.querySelector(".ls-radio-card.is-selected");
    if (!card) return "";
    var strong = card.querySelector(".ls-radio-card__text strong");
    return strong ? strong.textContent.trim() : "";
  }

  function fieldVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function generateSequentialId(prefix, counterKey) {
    var next = parseInt(localStorage.getItem(counterKey) || "0", 10) + 1;
    localStorage.setItem(counterKey, String(next));
    return prefix + "-" + String(next).padStart(6, "0");
  }

  function appendToStoredList(storageKey, entry) {
    var raw = localStorage.getItem(storageKey);
    var list = [];
    try {
      var parsed = raw ? JSON.parse(raw) : [];
      list = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      list = [];
    }
    list.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(list));
  }



  var FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  var lastFocusedBeforeModal = null;

  function getFocusableIn(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll(FOCUSABLE_SELECTOR),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function handleModalKeydown(e) {
    var modal = document.querySelector('.modal[style*="flex"]');
    if (!modal) return;

    if (e.key === "Escape") {
      closeModal(modal);
      return;
    }

    if (e.key !== "Tab") return;

    var focusables = getFocusableIn(modal);
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocusedBeforeModal = document.activeElement;
    modal.style.display = "flex";

    var focusables = getFocusableIn(modal);
    (focusables[0] || modal).focus();

    document.addEventListener("keydown", handleModalKeydown);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = "none";
    document.removeEventListener("keydown", handleModalKeydown);

    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
      lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
  }

  function openLabModal(id) {
    openModal(document.getElementById(id));
  }
  window.closeLabModal = function (id) {
    closeModal(document.getElementById(id));
  };

  window.closeSelectPatientModal = function () {
    closeModal(document.getElementById("selectPatientModal"));
  };


  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeModal(document.getElementById(el.dataset.closeModal));
      });
    });
  });




  function initPatientSearch(){

    allPatients = loadPatients();

    const lastName  = document.getElementById("patientLastNameSearch");
    const dob       = document.getElementById("patientDobSearch");
    const mobile    = document.getElementById("patientMobileSearch");
    const results   = document.getElementById("patientSearchResults");
    const searchBtn = document.getElementById("patientSearchBtn");
    const clearBtn  = document.getElementById("patientClearBtn");


    dob.max = new Date().toISOString().slice(0, 10);

    let activeIndex = -1;
    let debounceTimer = null;

    function normalizePhone(value) {
        return String(value || "").replace(/\D/g, "");
    }

    function search(){

    const ln = lastName.value.trim().toLowerCase();
    const d  = dob.value;
    const ph = normalizePhone(mobile.value);

    if(!ln && !d && !ph){
        render([]);
        return;
    }

    const filtered = allPatients.filter(p=>{

        const lastDobMatch =
            ln !== "" &&
            p.lastName.toLowerCase().includes(ln) &&
            (d === "" || p.dob === d);

        const phoneMatch =
            ph !== "" &&
            normalizePhone(p.phone).includes(ph);

        return lastDobMatch || phoneMatch;

    });

    render(filtered);

}

    function debouncedSearch(){
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(search, 300);
    }

    function setExpanded(isExpanded){
        [lastName, mobile].forEach(function (el) {
            el.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        });
    }

    function closeResults(){
        results.classList.remove("show");
        results.innerHTML = "";
        results.removeAttribute("aria-activedescendant");
        activeIndex = -1;
        setExpanded(false);
    }

    function getOptionEls(){
        return Array.prototype.slice.call(results.querySelectorAll('[role="option"]'));
    }

    function setActiveOption(index){
        const options = getOptionEls();
        if (!options.length) return;

        activeIndex = (index + options.length) % options.length;

        options.forEach(function (opt, i) {
            const isActive = i === activeIndex;
            opt.classList.toggle("is-active", isActive);
            opt.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        const active = options[activeIndex];
        results.setAttribute("aria-activedescendant", active.id);
        active.scrollIntoView({ block: "nearest" });
    }

    function selectPatientById(id){
        const patient = allPatients.find(x => x.id === id);
        if (!patient) return;

        populatePatient(patient);

        lastName.value = patient.lastName;
        dob.value      = patient.dob;
        mobile.value   = patient.phone;

        closeResults();


        const nextField = document.querySelector("#lab-specimen-type .ls-chip");
        if (nextField) nextField.focus();
    }

    function render(list){

        activeIndex = -1;
        results.classList.add("show");
        setExpanded(true);

    if(list.length === 0){
        results.innerHTML = `
            <div class="ls-empty-result" role="status" aria-live="polite">
                No Matching Record Found
            </div>
        `;
        results.removeAttribute("aria-activedescendant");
        return;
    }

        results.innerHTML = list.map(p=>`
            <div class="ls-result-item"
                 id="patient-option-${p.id}"
                 role="option"
                 aria-selected="false"
                 data-id="${p.id}">

                <div class="ls-result-avatar">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7"/>
                        <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5"
                              stroke="currentColor"
                              stroke-width="1.7"
                              stroke-linecap="round"/>
                    </svg>
                </div>

                <div class="ls-result-info">
                    <div class="ls-result-name">
                        ${p.firstName} ${p.lastName}
                    </div>

                    <div class="ls-result-meta">
                        ${p.phone} • MRN ${p.mrn}
                    </div>
                </div>

                <button type="button"
                        class="ls-btn ls-btn--secondary ls-btn--sm ls-result-select-btn"
                        data-id="${p.id}"
                        aria-label="Select ${p.firstName} ${p.lastName} as patient">
                    Select Patient
                </button>

            </div>
        `).join("");

        results.querySelectorAll(".ls-result-item").forEach(item=>{

            item.addEventListener("click", function () {
                selectPatientById(item.dataset.id);
            });

            const selectBtn = item.querySelector(".ls-result-select-btn");
            if (selectBtn) {
                selectBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    selectPatientById(item.dataset.id);
                });
            }

        });

    }

searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearTimeout(debounceTimer);
    search();
});

clearBtn.addEventListener("click", () => {

    lastName.value = "";
    dob.value = "";
    mobile.value = "";

    selectedPatientId = null;
    selectedPatientRecord = null;
    

    document.getElementById("lab-patient-id").value = "";
    document.getElementById("lab-first-name").value = "";
    document.getElementById("lab-last-name").value = "";
    document.getElementById("lab-dob").value = "";
    document.getElementById("lab-sex").value = "";
    document.getElementById("lab-mrn").value = "";
    document.getElementById("lab-payer").value = "";
    document.getElementById("lab-member-id").value = "";

    closeResults();

});


    [lastName, dob, mobile].forEach(function (input) {

        input.addEventListener("input", debouncedSearch);

        input.addEventListener("keydown", function (e) {

            if (e.key === "Enter") {
                e.preventDefault();
                const options = getOptionEls();
                if (activeIndex >= 0 && options[activeIndex]) {
                    selectPatientById(options[activeIndex].dataset.id);
                } else {
                    clearTimeout(debounceTimer);
                    search();
                }
                return;
            }

            if (e.key === "Escape") {
                closeResults();
                return;
            }

            if (e.key === "ArrowDown") {
                if (!results.classList.contains("show")) return;
                e.preventDefault();
                setActiveOption(activeIndex + 1);
                return;
            }

            if (e.key === "ArrowUp") {
                if (!results.classList.contains("show")) return;
                e.preventDefault();
                setActiveOption(activeIndex - 1);
                return;
            }

        });
    });

    document.addEventListener("click", (e) => {

    const clickedInsideSearch =
        results.contains(e.target) ||
        lastName.contains(e.target) ||
        dob.contains(e.target) ||
        mobile.contains(e.target) ||
        searchBtn.contains(e.target) ||
        clearBtn.contains(e.target);

    if (!clickedInsideSearch) {
        closeResults();
    }

});

}


function populatePatient(patient){

    selectedPatientId = patient.id;
    selectedPatientRecord = patient;

    document.getElementById("lab-patient-id").value = patient.id;

    document.getElementById("lab-first-name").value = patient.firstName;
    document.getElementById("lab-last-name").value = patient.lastName;
    document.getElementById("lab-dob").value = patient.dob;
    document.getElementById("lab-sex").value = patient.gender;
    document.getElementById("lab-mrn").value = patient.mrn;
    document.getElementById("lab-payer").value = patient.insurance || "";
    document.getElementById("lab-member-id").value = patient.memberId || "";

    const err = document.getElementById("lab-patient-error");
    if(err) err.hidden = true;
}




function flagMissingPatient(){

    const err = document.getElementById("lab-patient-error");

    if(err) err.hidden = false;

    document
      .getElementById("patientLastNameSearch")
      ?.scrollIntoView({
          behavior:"smooth",
          block:"center"
      });

}

  document.addEventListener("DOMContentLoaded", function () {
    wireChipRow("lab-specimen-type");
    wireCheckTileGrid("lab-tests-grid");
    wireRadioGroup("lab-priority");
    initPatientSearch();

    var form = document.getElementById("lab-service-form");
    var saveDraftBtn = document.getElementById("lab-save-draft-btn");

    if (saveDraftBtn) {
      saveDraftBtn.addEventListener("click", function () {
        if (!selectedPatientId) {
          flagMissingPatient();
          return;
        }

        var draftId = generateSequentialId("DFT", "labServiceDraftCounter_v1");
        var draft = {
          draftId: draftId,
          status: "Draft",
          savedAt: new Date().toISOString(),
          patientId: selectedPatientId,
          patientName: fieldVal("lab-first-name") + " " + fieldVal("lab-last-name"),
          mrn: fieldVal("lab-mrn"),
          specimen: getSelectedSpecimenLabel(),
          tests: getSelectedTestLabels(),
          priority: getSelectedPriorityLabel(),
          providerName: fieldVal("lab-provider-name"),
          npi: fieldVal("lab-npi"),
          collectionDateTime: fieldVal("lab-collection-datetime"),
          collectedBy: fieldVal("lab-collected-by"),
          clinicalNotes: fieldVal("lab-clinical-notes")
        };

        appendToStoredList("labServiceDrafts_v1", draft);

        var draftIdValueEl = document.getElementById("lab-draft-id-value");
        if (draftIdValueEl) draftIdValueEl.textContent = draftId;
        openLabModal("labDraftModal");
      });
    }

    var draftOkBtn = document.getElementById("lab-draft-ok-btn");
    if (draftOkBtn) {
      draftOkBtn.addEventListener("click", function () {
        window.closeLabModal("labDraftModal");
      });
    }


    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!selectedPatientId) {
          flagMissingPatient();
          return;
        }

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        var tests = getSelectedTestLabels();

        document.getElementById("lab-review-patient").textContent =
          fieldVal("lab-first-name") + " " + fieldVal("lab-last-name");
        document.getElementById("lab-review-mrn").textContent = fieldVal("lab-mrn") || "—";
        document.getElementById("lab-review-specimen").textContent = getSelectedSpecimenLabel() || "—";
        document.getElementById("lab-review-tests").textContent = tests.length ? tests.join(", ") : "—";
        document.getElementById("lab-review-priority").textContent = getSelectedPriorityLabel() || "—";
        document.getElementById("lab-review-provider").textContent = fieldVal("lab-provider-name") || "—";

        openLabModal("labReviewModal");
      });
    }

    var reviewCancelBtn = document.getElementById("lab-review-cancel-btn");
    if (reviewCancelBtn) {
      reviewCancelBtn.addEventListener("click", function () {
        window.closeLabModal("labReviewModal");
      });
    }


    var reviewConfirmBtn = document.getElementById("lab-review-confirm-btn");
    if (reviewConfirmBtn) {
      reviewConfirmBtn.addEventListener("click", function () {
        var requestId = generateSequentialId("LAB", "labServiceRequestCounter_v1");
        var request = {
          requestId: requestId,
          status: "Pending Collection",
          submittedAt: new Date().toISOString(),
          patientId: selectedPatientId,
          patientName: fieldVal("lab-first-name") + " " + fieldVal("lab-last-name"),
          mrn: fieldVal("lab-mrn"),
          specimen: getSelectedSpecimenLabel(),
          tests: getSelectedTestLabels(),
          priority: getSelectedPriorityLabel(),
          providerName: fieldVal("lab-provider-name"),
          npi: fieldVal("lab-npi"),
          collectionDateTime: fieldVal("lab-collection-datetime"),
          collectedBy: fieldVal("lab-collected-by"),
          department: fieldVal("lab-department"),
          contactPhone: fieldVal("lab-contact-phone"),
          resultDelivery: fieldVal("lab-result-delivery"),
          clinicalNotes: fieldVal("lab-clinical-notes")
        };

        appendToStoredList("labServiceRequests_v1", request);

        window.closeLabModal("labReviewModal");

        var successIdEl = document.getElementById("lab-success-request-id");
        if (successIdEl) successIdEl.textContent = requestId;
        openLabModal("labSuccessModal");
      });
    }

    var successDoneBtn = document.getElementById("lab-success-done-btn");
    if (successDoneBtn) {
      successDoneBtn.addEventListener("click", function () {
        window.closeLabModal("labSuccessModal");
        if (form) form.reset();

   
        document.querySelectorAll("#lab-specimen-type .ls-chip.is-selected").forEach(function (c) {
          c.classList.remove("is-selected");
          var check = c.querySelector("svg");
          if (check) check.remove();
        });
        document.querySelectorAll("#lab-tests-grid .ls-check-tile.is-selected").forEach(function (t) {
          t.classList.remove("is-selected");
        });
        document.querySelectorAll("#lab-priority .ls-radio-card.is-selected").forEach(function (c) {
          c.classList.remove("is-selected");
        });

        selectedPatientId = null;
        selectedPatientRecord = null;
       document.getElementById("patientLastNameSearch").value = "";
document.getElementById("patientDobSearch").value = "";
document.getElementById("patientMobileSearch").value = "";

document.getElementById("patientSearchResults")
    .classList.remove("show");
      });
    }
  });
})();
