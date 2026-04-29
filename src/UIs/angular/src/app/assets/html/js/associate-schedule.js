const associateForm = document.getElementById("scheduleForm");
const schedulePanels = Array.from(document.querySelectorAll(".schedule-panel"));
const scheduleSteps = Array.from(document.querySelectorAll(".schedule-step"));
const progressFill = document.querySelector(".progress-line-fill");
const associatePopup = document.getElementById("associateModal");
const successPopup = document.getElementById("successModal");

const associateDepartment = document.getElementById("associateDepartment");
const associateName = document.getElementById("associateName");
const associateRole = document.getElementById("associateRole");
const associateSpeciality = document.getElementById("associateSpeciality");

const modalDepartment = document.getElementById("modalDepartment");
const modalName = document.getElementById("modalName");
const modalRole = document.getElementById("modalRole");
const modalSpeciality = document.getElementById("modalSpeciality");
const scheduleSummary = document.getElementById("scheduleSummary");

let currentStep = 0;

const associateRecords = [
    { department: "GENERAL", name: "Dr. Kumar", role: "Doctor", speciality: "Cardiology" },
    { department: "GENERAL", name: "Dr. Bose", role: "Consultant", speciality: "General Medicine" },
    { department: "CARDIOLOGY", name: "Dr. Raman", role: "Specialist", speciality: "Interventional Cardiology" },
    { department: "ORTHOPEDICS", name: "Dr. Arya", role: "Doctor", speciality: "Sports Injury" }
];

document.addEventListener("DOMContentLoaded", () => {
    bindStepNavigation();
    bindAssociateSelection();
    bindDays();
    bindPopups();
    renderStep();
});

function bindStepNavigation() {
    document.getElementById("stepOneBack").addEventListener("click", () => {
        window.history.back();
    });

    document.querySelectorAll("[data-prev]").forEach(button => {
        button.addEventListener("click", () => {
            currentStep = Math.max(0, currentStep - 1);
            renderStep();
        });
    });

    document.querySelectorAll("[data-next]").forEach(button => {
        button.addEventListener("click", () => {
            if (!validateCurrentStep()) return;
            currentStep = Math.min(schedulePanels.length - 1, currentStep + 1);
            renderStep();
        });
    });

    document.getElementById("openAssociatePopup").addEventListener("click", () => {
        if (!validateCurrentStep()) return;
        populateAssociateModal();
        openModal(associatePopup);
    });

    associateForm.addEventListener("submit", event => {
        event.preventDefault();
        if (!validateCurrentStep()) return;
        populateSummary();
        openModal(successPopup);
    });
}

function bindAssociateSelection() {
    associateDepartment.addEventListener("change", updateNameOptions);
    associateName.addEventListener("change", updateSpeciality);
    associateRole.addEventListener("change", updateSpeciality);
    updateNameOptions();
}

function updateNameOptions() {
    const department = associateDepartment.value;
    const filtered = associateRecords.filter(record => !department || record.department === department);

    associateName.innerHTML = `<option value="">Select Full Name</option>` +
        filtered.map(record => `<option value="${record.name}">${record.name}</option>`).join("");

    associateSpeciality.value = "Auto Displayed";
}

function updateSpeciality() {
    const record = findSelectedRecord();
    associateSpeciality.value = record ? record.speciality : "Auto Displayed";
}

function findSelectedRecord() {
    return associateRecords.find(record =>
        record.department === associateDepartment.value &&
        record.name === associateName.value &&
        record.role === associateRole.value
    );
}

function bindDays() {
    document.querySelectorAll(".day-pill").forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
        });
    });
}

function bindPopups() {
    document.getElementById("closeAssociateModal").addEventListener("click", () => closeModal(associatePopup));
    document.getElementById("cancelAssociateModal").addEventListener("click", () => closeModal(associatePopup));
    document.getElementById("confirmAssociateModal").addEventListener("click", () => {
        closeModal(associatePopup);
        currentStep = 1;
        renderStep();
    });

    document.getElementById("closeSuccessModal").addEventListener("click", () => closeModal(successPopup));
    document.getElementById("doneScheduleModal").addEventListener("click", () => closeModal(successPopup));

    [associatePopup, successPopup].forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal(modal);
        });
    });
}

function populateAssociateModal() {
    const record = findSelectedRecord() || associateRecords[0];
    modalDepartment.textContent = record.department;
    modalName.textContent = record.name;
    modalRole.textContent = record.role;
    modalSpeciality.textContent = record.speciality;
}

function populateSummary() {
    const selectedDays = Array.from(document.querySelectorAll(".day-pill.active")).map(button => button.dataset.day).join(", ") || "None";
    scheduleSummary.innerHTML = `
        <div><strong>Associate:</strong> ${associateName.value || "Not selected"}</div>
        <div><strong>Department:</strong> ${associateDepartment.value || "Not selected"}</div>
        <div><strong>Availability:</strong> ${document.getElementById("fromDate").value} to ${document.getElementById("toDate").value}</div>
        <div><strong>Time:</strong> ${document.getElementById("fromTime").value} - ${document.getElementById("toTime").value}</div>
        <div><strong>Days:</strong> ${selectedDays}</div>
        <div><strong>Consultation:</strong> ${document.getElementById("consultDuration").value}, ${document.getElementById("averageCharge").value}</div>
    `;
}

function validateCurrentStep() {
    const panel = schedulePanels[currentStep];
    const fields = Array.from(panel.querySelectorAll("input, select"))
        .filter(field => field.required && !field.disabled);

    for (const field of fields) {
        if (!field.reportValidity()) {
            field.focus();
            return false;
        }
    }

    if (currentStep === 0 && !findSelectedRecord()) {
        alert("Please select a matching department, full name, and role.");
        return false;
    }

    return true;
}

function renderStep() {
    schedulePanels.forEach((panel, index) => {
        panel.classList.toggle("active", index === currentStep);
    });

    scheduleSteps.forEach((step, index) => {
        step.classList.remove("active", "completed");
        if (index < currentStep) step.classList.add("completed");
        if (index === currentStep) step.classList.add("active");
    });

    progressFill.style.width = currentStep < 2 ? "50%" : "100%";
}

function openModal(modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}
