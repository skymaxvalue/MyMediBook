const masterForm = document.getElementById("masterForm");
const steps = Array.from(document.querySelectorAll(".form-step"));
const stepChips = Array.from(document.querySelectorAll(".step-chip"));
const submitModal = document.getElementById("submitModal");
const summaryList = document.getElementById("summaryList");
const closeSubmitModalBtn = document.getElementById("closeSubmitModal");
const confirmSubmitBtn = document.getElementById("confirmSubmit");
const previewModal = document.getElementById("filePreviewModal");
const closePreviewModalBtn = document.getElementById("closePreviewModal");
const donePreviewBtn = document.getElementById("donePreview");
const changePreviewFileBtn = document.getElementById("changePreviewFile");
const previewTitle = document.getElementById("previewTitle");
const previewMeta = document.getElementById("previewMeta");
const previewSurface = document.getElementById("filePreviewSurface");
const sameAddressCheckbox = document.getElementById("sameAddress");
const residentialAddressInput = document.getElementById("residentialAddress");
const permanentAddressInput = document.getElementById("permanentAddress");

let currentStep = 0;
let activePreviewInputId = "";
let previewObjectUrl = "";

document.addEventListener("DOMContentLoaded", () => {
    bindWizardActions();
    bindUploads();
    bindAddressSync();
    renderStep();
});

function bindWizardActions() {
    document.querySelectorAll("[data-next]").forEach(button => {
        button.addEventListener("click", () => {
            if (!validateStep(currentStep)) return;
            currentStep += 1;
            renderStep();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    document.querySelectorAll("[data-prev]").forEach(button => {
        button.addEventListener("click", () => {
            currentStep = Math.max(currentStep - 1, 0);
            renderStep();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    stepChips.forEach((chip, index) => {
        chip.addEventListener("click", () => {
            if (index > currentStep && !validateStep(currentStep)) return;
            currentStep = index;
            renderStep();
        });
    });

    masterForm.addEventListener("submit", event => {
        event.preventDefault();
        if (!validateStep(currentStep)) return;
        openSubmitModal();
    });

    closeSubmitModalBtn.addEventListener("click", closeSubmitModal);
    confirmSubmitBtn.addEventListener("click", closeSubmitModal);
    submitModal.addEventListener("click", event => {
        if (event.target === submitModal) closeSubmitModal();
    });

    closePreviewModalBtn.addEventListener("click", closePreviewModal);
    donePreviewBtn.addEventListener("click", closePreviewModal);
    changePreviewFileBtn.addEventListener("click", () => {
        const input = document.getElementById(activePreviewInputId);
        closePreviewModal();
        input?.click();
    });
    previewModal.addEventListener("click", event => {
        if (event.target === previewModal) closePreviewModal();
    });
}

function bindUploads() {
    document.querySelectorAll("[data-file-trigger]").forEach(button => {
        button.addEventListener("click", () => {
            const inputId = button.dataset.fileTrigger;
            const input = document.getElementById(inputId);

            if (!input) return;

            if (input.files?.length) {
                openPreviewModal(inputId);
                return;
            }

            input.click();
        });
    });

    document.querySelectorAll("[data-upload-target]").forEach(button => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.uploadTarget);
            if (!input?.files?.length) {
                alert("Please choose a file first");
                return;
            }

            button.classList.add("uploaded");
            button.textContent = "uploaded";

            const trigger = document.querySelector(`[data-file-trigger="${button.dataset.uploadTarget}"]`);
            trigger?.classList.add("uploaded");
        });
    });

    [
        ["identityFile", "identityFileName"],
        ["qualificationDocuments", "qualificationFileName"]
    ].forEach(([inputId, labelId]) => {
        const input = document.getElementById(inputId);
        const label = document.getElementById(labelId);
        const trigger = document.querySelector(`[data-file-trigger="${inputId}"]`);
        const uploadButton = document.querySelector(`[data-upload-target="${inputId}"]`);

        input?.addEventListener("change", () => {
            const hasFile = Boolean(input.files?.[0]);
            label.textContent = input.files?.[0]?.name || "choose file";
            trigger?.classList.toggle("has-file", hasFile);
            trigger?.classList.remove("uploaded");
            uploadButton?.classList.remove("uploaded");
            if (uploadButton) uploadButton.textContent = "upload";
        });
    });
}

function bindAddressSync() {
    sameAddressCheckbox.addEventListener("change", () => {
        if (sameAddressCheckbox.checked) {
            permanentAddressInput.value = residentialAddressInput.value;
        }
    });

    residentialAddressInput.addEventListener("input", () => {
        if (sameAddressCheckbox.checked) {
            permanentAddressInput.value = residentialAddressInput.value;
        }
    });
}

function validateStep(stepIndex) {
    const currentSection = steps[stepIndex];
    const fields = Array.from(currentSection.querySelectorAll("input, select, textarea"))
        .filter(field => field.type !== "hidden" && !field.disabled && field.required);

    for (const field of fields) {
        if (!field.reportValidity()) {
            field.focus();
            return false;
        }
    }

    return true;
}

function renderStep() {
    steps.forEach((section, index) => {
        section.classList.toggle("active", index === currentStep);
    });

    stepChips.forEach((chip, index) => {
        chip.classList.remove("active", "completed");

        const status = chip.querySelector(".step-status");
        if (index < currentStep) {
            chip.classList.add("completed");
            status.textContent = "Completed";
        } else if (index === currentStep) {
            chip.classList.add("active");
            status.textContent = "In Progress";
        } else {
            status.textContent = "Pending";
        }
    });
}

function openSubmitModal() {
    const summaryFields = [
        ["Name", `${getValue("firstName")} ${getValue("lastName")}`.trim()],
        ["Email", getValue("emailId")],
        ["Phone", `${getValue("phoneCountryCode")} ${getValue("phoneNumber")}`.trim()],
        ["Highest Degree", getValue("highestDegree")],
        ["Experience", getValue("experienceYears")],
        ["Employee Type", getValue("employeeType")],
        ["Department", getValue("departmentName")]
    ];

    summaryList.innerHTML = summaryFields
        .filter(([, value]) => value)
        .map(([label, value]) => `
            <div class="summary-row">
                <strong>${label}</strong>
                <span>${value}</span>
            </div>
        `)
        .join("");

    submitModal.classList.add("show");
    submitModal.setAttribute("aria-hidden", "false");
}

function closeSubmitModal() {
    submitModal.classList.remove("show");
    submitModal.setAttribute("aria-hidden", "true");
}

function openPreviewModal(inputId) {
    const input = document.getElementById(inputId);
    const file = input?.files?.[0];
    if (!file) return;

    activePreviewInputId = inputId;
    clearPreviewObjectUrl();
    previewSurface.innerHTML = "";

    previewTitle.textContent = file.name;
    previewMeta.textContent = `${formatFileSize(file.size)} • ${file.type || "Unknown type"}`;

    if (file.type.startsWith("image/")) {
        previewObjectUrl = URL.createObjectURL(file);
        previewSurface.innerHTML = `<img src="${previewObjectUrl}" alt="${file.name} preview">`;
    } else if (file.type === "application/pdf") {
        previewObjectUrl = URL.createObjectURL(file);
        previewSurface.innerHTML = `<iframe src="${previewObjectUrl}" title="${file.name} preview"></iframe>`;
    } else {
        previewObjectUrl = URL.createObjectURL(file);
        previewSurface.innerHTML = `
            <div class="file-preview-fallback">
                <strong>Preview not available</strong>
                <span>${file.name}</span>
                <span>${file.type || "Unknown file type"}</span>
                <a class="file-preview-link" href="${previewObjectUrl}" target="_blank" rel="noopener noreferrer">Open file</a>
            </div>
        `;
    }

    previewModal.classList.add("show");
    previewModal.setAttribute("aria-hidden", "false");
}

function closePreviewModal() {
    previewModal.classList.remove("show");
    previewModal.setAttribute("aria-hidden", "true");
    clearPreviewObjectUrl();
    previewSurface.innerHTML = "";
}

function clearPreviewObjectUrl() {
    if (!previewObjectUrl) return;
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = "";
}

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getValue(id) {
    return document.getElementById(id)?.value?.trim() || "";
}


function setupFilePreview(buttonId, previewTargetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    document.body.appendChild(input);
    document.getElementById(buttonId).addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            alert(`Preview: ${e.target.files[0].name}`);
            // You can extend to show actual preview in a modal
        }
    });
}
setupFilePreview('resumeUpload');
setupFilePreview('photoUpload');










// Add new language functionality
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addLanguageBtn');
    const languageInput = document.getElementById('newLanguageInput');
    const languagesContainer = document.getElementById('languagesContainer');

    if (addBtn && languageInput && languagesContainer) {
        addBtn.addEventListener('click', function() {
            const newLanguage = languageInput.value.trim();
            if (newLanguage === '') {
                alert('Please enter a language name');
                return;
            }
            
            // Check if language already exists (case-insensitive)
            const existingLanguages = Array.from(languagesContainer.querySelectorAll('.check-item span'));
            const exists = existingLanguages.some(span => span.innerText.toLowerCase() === newLanguage.toLowerCase());
            
            if (exists) {
                alert('This language is already added');
                return;
            }
            
            // Create new checkbox item
            const newCheckItem = document.createElement('label');
            newCheckItem.className = 'check-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'languagesSpoken';
            checkbox.value = newLanguage;
            
            const span = document.createElement('span');
            span.innerText = newLanguage;
            
            newCheckItem.appendChild(checkbox);
            newCheckItem.appendChild(span);
            languagesContainer.appendChild(newCheckItem);
            
            // Clear input
            languageInput.value = '';
        });
        
        // Allow Enter key to add language
        languageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addBtn.click();
            }
        });
    }
    
    // Update file button hint to show "preview after selection" is always visible
    const fileButtons = document.querySelectorAll('.file-button');
    fileButtons.forEach(button => {
        const hintSpan = button.querySelector('.file-button-hint');
        if (hintSpan) {
            hintSpan.style.display = 'block';
            hintSpan.style.fontSize = '10px';
            hintSpan.style.marginTop = '4px';
            hintSpan.style.opacity = '0.8';
        }
    });
});