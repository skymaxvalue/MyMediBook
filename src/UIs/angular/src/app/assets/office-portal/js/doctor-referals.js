(function () {

    const KEYS = {
        hospitals: "hhDoctorReferalHospitalDirectory",
        selectedHospital: "hhDoctorReferalSelectedHospital",
        records: "hhDoctorReferalRecords",
        drafts: "hhDoctorReferalDrafts"
    };

    const PLACEHOLDER = "Not available";

    const SPECIALISATIONS = ["Cardiology", "Dermatology", "Endocrinology", "ENT", "General Medicine", "Neurology", "Orthopaedics", "Paediatrics", "Radiology"];

    const SERVICES = ["Specialist consultation", "Second opinion", "Diagnostic imaging", "Diagnostic procedure", "Surgical evaluation", "In-patient admission", "Rehabilitation", "Follow-up care"];

    const STATUS_CLASS = {
        "Draft": "draft",
        "Submitted": "submitted",
        "Accepted": "accepted",
        "Rejected": "rejected",
        "In Progress": "progress",
        "Completed": "done",
        "Cancelled": "cancelled"
    };

    const STATUSES = Object.keys(STATUS_CLASS);

    const NEXT_STATUS = {
        "Submitted": ["Accepted", "Rejected"],
        "Accepted": ["In Progress"],
        "In Progress": ["Completed"]
    };

    const CANCELLABLE = ["Draft", "Submitted"];

    const SOURCE_LABEL = { demo: "", local: "Local, unverified" };

    const DEMO_HOSPITALS = [
        { id: "hosp-demo-001", name: "Lakshmi Memorial Hospital", address: "45 Anna Salai, Teynampet", city: "Chennai", phone: "+91 44 5550 0101", email: "", specialisations: ["Cardiology", "General Medicine", "Radiology"], source: "demo" },
        { id: "hosp-demo-002", name: "Kaveri Multispeciality Hospital", address: "27 Alwarpet Main Road, Alwarpet", city: "Chennai", phone: "+91 44 5550 0102", email: "", specialisations: ["Endocrinology", "ENT", "Orthopaedics"], source: "demo" },
        { id: "hosp-demo-003", name: "Nalam Neuro and Spine Centre", address: "102 Velachery Main Road, Velachery", city: "Chennai", phone: "+91 44 5550 0103", email: "", specialisations: ["Neurology", "Orthopaedics", "Radiology"], source: "demo" },
        { id: "hosp-demo-004", name: "Greenfield Children's and Women's Hospital", address: "19 Cathedral Road, Gopalapuram", city: "Chennai", phone: "+91 44 5550 0104", email: "", specialisations: ["Paediatrics", "Dermatology", "General Medicine"], source: "demo" },
        { id: "hosp-demo-005", name: "Coimbatore Advanced Medical Centre", address: "63 Avinashi Road, Peelamedu", city: "Coimbatore", phone: "+91 422 555 0105", email: "", specialisations: ["Cardiology", "Neurology", "Endocrinology"], source: "demo" },
        { id: "hosp-demo-006", name: "Madurai Central Hospital", address: "8 West Masi Street", city: "Madurai", phone: "+91 452 555 0106", email: "", specialisations: ["General Medicine", "ENT", "Dermatology"], source: "demo" }
    ];

    let hospitals = [];
    let records = [];
    let drafts = [];
    let patients = [];
    let selectedHospitalId = "";
    let selectedPatient = null;
    let editingId = "";
    let activeModal = null;
    let modalOpener = null;
    let confirmAction = null;
    let confirmBusy = false;
    let viewId = "";
    let doctorName = PLACEHOLDER;

    function readStorage(key) {
        try {
            const raw = window.localStorage.getItem(key);
            return raw === null ? null : JSON.parse(raw);
        } catch (error) {
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function removeStorage(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            return;
        }
    }

    function isText(value) {
        return typeof value === "string" && value.trim() !== "";
    }

    function isValidHospital(item) {
        return Boolean(item) && typeof item === "object" &&
            isText(item.id) && isText(item.name) && isText(item.address) && isText(item.city) && isText(item.phone) &&
            typeof item.email === "string" &&
            Array.isArray(item.specialisations) && item.specialisations.every(isText) &&
            (item.source === "demo" || item.source === "local");
    }

    function isValidReferral(item) {
        return Boolean(item) && typeof item === "object" &&
            isText(item.id) && STATUSES.includes(item.status) &&
            Boolean(item.patient) && typeof item.patient === "object" && isText(item.patient.name) &&
            typeof item.specialisation === "string" &&
            typeof item.createdAt === "string" && typeof item.updatedAt === "string" &&
            Array.isArray(item.history) &&
            (item.hospital === null || (Boolean(item.hospital) && typeof item.hospital === "object" && isText(item.hospital.name)));
    }

    function uniqueById(list) {
        const seen = new Set();
        return list.filter(item => {
            if (seen.has(item.id)) {
                return false;
            }
            seen.add(item.id);
            return true;
        });
    }

    function loadAll() {
        const storedHospitals = readStorage(KEYS.hospitals);
        const validHospitals = Array.isArray(storedHospitals) ? uniqueById(storedHospitals.filter(isValidHospital)) : [];
        hospitals = Array.isArray(storedHospitals) && validHospitals.length ? validHospitals : DEMO_HOSPITALS.map(item => ({ ...item, specialisations: item.specialisations.slice() }));
        persistHospitals();
        const storedRecords = readStorage(KEYS.records);
        records = Array.isArray(storedRecords) ? uniqueById(storedRecords.filter(isValidReferral)).filter(item => item.status !== "Draft") : [];
        const storedDrafts = readStorage(KEYS.drafts);
        drafts = Array.isArray(storedDrafts) ? uniqueById(storedDrafts.filter(isValidReferral)).filter(item => item.status === "Draft") : [];
        const storedSelected = readStorage(KEYS.selectedHospital);
        selectedHospitalId = typeof storedSelected === "string" && hospitals.some(item => item.id === storedSelected) ? storedSelected : "";
    }

    function persistHospitals() {
        return writeStorage(KEYS.hospitals, hospitals);
    }

    function persistRecords() {
        return writeStorage(KEYS.records, records);
    }

    function persistDrafts() {
        return writeStorage(KEYS.drafts, drafts);
    }

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) {
            node.className = className;
        }
        if (text !== undefined) {
            node.textContent = text;
        }
        return node;
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function formatDate(iso) {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) {
            return "---";
        }
        return pad(date.getDate()) + "-" + MONTHS[date.getMonth()] + "-" + date.getFullYear();
    }

    function formatDateTime(iso) {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) {
            return "---";
        }
        const hours = date.getHours() % 12 || 12;
        return formatDate(iso) + " " + pad(hours) + ":" + pad(date.getMinutes()) + (date.getHours() < 12 ? " am" : " pm");
    }

    function normalise(value) {
        return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
    }

    function showNotice(message) {
        const notice = byId("dcNotice");
        notice.textContent = message;
        notice.hidden = false;
        notice.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideNotice() {
        byId("dcNotice").hidden = true;
    }

    function setError(id, message) {
        const field = byId(id);
        const error = byId(id + "Error");
        if (field) {
            field.setAttribute("aria-invalid", "true");
        }
        if (error) {
            error.textContent = message;
            error.hidden = false;
        }
    }

    function clearError(id) {
        const field = byId(id);
        const error = byId(id + "Error");
        if (field) {
            field.removeAttribute("aria-invalid");
        }
        if (error) {
            error.textContent = "";
            error.hidden = true;
        }
    }

    function setFormError(message) {
        const error = byId("rfFormError");
        error.textContent = message;
        error.hidden = !message;
    }

    function fillDoctor(session) {
        const source = session || {};
        const values = {
            rfDoctorName: source.name,
            rfDoctorAge: source.age ? String(source.age).replace(/\s*years?$/i, "") + " years" : "",
            rfDoctorGender: source.gender,
            rfDoctorAddress: source.address,
            rfDoctorSpecialisation: source.specialisation || source.specialization,
            rfDoctorPhone: source.phone || source.mobile
        };
        Object.keys(values).forEach(id => {
            const field = byId(id);
            const value = isText(values[id]) ? values[id].trim() : "";
            field.value = value || PLACEHOLDER;
            field.classList.toggle("dc-rf-muted", !value);
        });
        doctorName = isText(source.name) ? source.name.trim() : PLACEHOLDER;
    }

    function loadPatients() {
        const source = typeof DEMO_APPOINTMENTS !== "undefined" && Array.isArray(DEMO_APPOINTMENTS) ? DEMO_APPOINTMENTS : [];
        const seen = new Set();
        patients = source.filter(item => item && isText(item.name)).filter(item => {
            const key = normalise(item.name);
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    function patientValue(value, suffix) {
        if (value === undefined || value === null || String(value).trim() === "") {
            return "Not recorded";
        }
        return String(value) + (suffix || "");
    }

    function renderPatientResults() {
        const list = byId("rfPatientResults");
        const input = byId("rfPatientSearch");
        const term = normalise(input.value);
        const matches = patients.filter(item => normalise(item.name).includes(term));
        list.replaceChildren();
        if (!matches.length) {
            list.appendChild(el("p", "dc-rf-result-empty", patients.length ? "No matching patients." : "No patient records are available."));
        }
        matches.forEach(item => {
            const option = el("button", "dc-rf-result");
            option.type = "button";
            option.setAttribute("role", "option");
            option.appendChild(el("span", "dc-rf-result-name", item.name));
            option.appendChild(el("span", "dc-rf-result-meta", [item.age ? item.age + " years" : "", item.gender || ""].filter(Boolean).join(" · ")));
            option.addEventListener("click", () => selectPatient(item));
            list.appendChild(option);
        });
        list.hidden = false;
        input.setAttribute("aria-expanded", "true");
    }

    function closePatientResults() {
        byId("rfPatientResults").hidden = true;
        byId("rfPatientSearch").setAttribute("aria-expanded", "false");
    }

    function selectPatient(item) {
        selectedPatient = {
            id: item.id || item.patientId || "",
            name: item.name,
            age: item.age || "",
            gender: item.gender || "",
            contact: item.mobile || item.contact || "",
            weight: item.weight || "",
            height: item.height || "",
            bloodPressure: item.bloodPressure || "",
            bloodSugar: item.bloodSugar || "",
            purpose: item.purpose || ""
        };
        byId("rfPatientSearch").value = "";
        closePatientResults();
        clearError("rfPatientSearch");
        renderPatientCard();
    }

    function clearPatient() {
        selectedPatient = null;
        renderPatientCard();
        byId("rfPatientSearch").focus();
    }

    function renderPatientCard() {
        const card = byId("rfPatientCard");
        byId("rfPatientEmpty").hidden = Boolean(selectedPatient);
        card.hidden = !selectedPatient;
        if (!selectedPatient) {
            return;
        }
        const patient = selectedPatient;
        const vitals = [
            patient.weight ? patient.weight + " kg" : "",
            patient.height ? patient.height + " cm" : "",
            patient.bloodPressure ? patient.bloodPressure + " mmHg" : "",
            patient.bloodSugar ? patient.bloodSugar + " mg/dL" : ""
        ].filter(Boolean).join(", ");
        byId("rfPatientCardName").textContent = patient.name;
        byId("rfPatId").textContent = patientValue(patient.id);
        byId("rfPatAge").textContent = patientValue(patient.age, " years");
        byId("rfPatGender").textContent = patientValue(patient.gender);
        byId("rfPatContact").textContent = patientValue(patient.contact);
        byId("rfPatVitals").textContent = vitals || "Not recorded";
        byId("rfPatPurpose").textContent = patientValue(patient.purpose);
    }

    function fillSelect(select, values, firstLabel) {
        const current = select.value;
        select.replaceChildren();
        if (firstLabel) {
            const first = el("option", "", firstLabel);
            first.value = "";
            select.appendChild(first);
        }
        values.forEach(value => {
            const option = el("option", "", value);
            option.value = value;
            select.appendChild(option);
        });
        select.value = values.includes(current) ? current : "";
    }

    function renderStaticOptions() {
        fillSelect(byId("rfSpecialisation"), SPECIALISATIONS, "Select specialisation");
        fillSelect(byId("rfSpecFilter"), SPECIALISATIONS, "All specialisations");
        const services = byId("rfServiceOptions");
        SERVICES.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            services.appendChild(option);
        });
        const checks = byId("rfHospSpecChecks");
        SPECIALISATIONS.forEach(value => {
            const label = el("label", "dc-rf-check");
            const box = document.createElement("input");
            box.type = "checkbox";
            box.name = "rfHospSpec";
            box.value = value;
            label.appendChild(box);
            label.appendChild(document.createTextNode(value));
            checks.appendChild(label);
        });
    }

    function renderCityFilter() {
        const cities = Array.from(new Set(hospitals.map(item => item.city))).sort();
        fillSelect(byId("rfCityFilter"), cities, "All cities");
    }

    function filteredHospitals() {
        const term = normalise(byId("rfHospitalSearch").value);
        const city = byId("rfCityFilter").value;
        const spec = byId("rfSpecFilter").value;
        return hospitals.filter(item =>
            (!term || normalise(item.name).includes(term)) &&
            (!city || item.city === city) &&
            (!spec || item.specialisations.includes(spec)));
    }

    function createCell(text, className) {
        const cell = el("td", className || "", text);
        return cell;
    }

    function renderHospitals() {
        const body = byId("rfHospitalRows");
        const visible = filteredHospitals();
        body.replaceChildren();
        if (!visible.length) {
            const row = document.createElement("tr");
            const cell = el("td", "dc-rf-empty", "No hospitals match your search or filters.");
            cell.colSpan = 6;
            row.appendChild(cell);
            body.appendChild(row);
        }
        visible.forEach(hospital => {
            const row = el("tr", "dc-rf-row-item");
            row.classList.toggle("dc-rf-selected", hospital.id === selectedHospitalId);
            const nameCell = el("td", "dc-rf-name");
            nameCell.appendChild(el("div", "", hospital.name));
            if (SOURCE_LABEL[hospital.source]) {
                nameCell.appendChild(el("span", "dc-rf-tag " + hospital.source, SOURCE_LABEL[hospital.source]));
            }
            row.appendChild(nameCell);
            row.appendChild(createCell(hospital.address + ", " + hospital.city));
            const specCell = el("td");
            const chips = el("div", "dc-rf-chips");
            hospital.specialisations.forEach(value => chips.appendChild(el("span", "dc-rf-chip", value)));
            specCell.appendChild(chips);
            row.appendChild(specCell);
            row.appendChild(createCell(hospital.phone));
            row.appendChild(createCell(hospital.email || "Not provided", hospital.email ? "" : "dc-rf-muted"));
            const pickCell = el("td", "dc-rf-select-col");
            const label = el("label", "dc-rf-pick");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "rfHospital";
            radio.value = hospital.id;
            radio.checked = hospital.id === selectedHospitalId;
            radio.setAttribute("aria-label", "Select " + hospital.name);
            radio.addEventListener("change", () => selectHospital(hospital.id));
            label.appendChild(radio);
            pickCell.appendChild(label);
            row.appendChild(pickCell);
            row.addEventListener("click", event => {
                if (!event.target.closest("label")) {
                    selectHospital(hospital.id);
                }
            });
            body.appendChild(row);
        });
        renderHospitalSummary(visible.length);
    }

    function renderHospitalSummary(visibleCount) {
        const selected = hospitals.find(item => item.id === selectedHospitalId);
        const count = "Showing " + visibleCount + " of " + hospitals.length + " hospitals. ";
        byId("rfHospitalSummary").textContent = count + (selected ? "Selected: " + selected.name + " (" + selected.city + ")." : "No hospital selected.");
    }

    function selectHospital(id) {
        selectedHospitalId = id;
        writeStorage(KEYS.selectedHospital, id);
        clearError("rfHospital");
        document.querySelectorAll("#rfHospitalRows tr").forEach(row => {
            const radio = row.querySelector("input[type='radio']");
            const active = Boolean(radio) && radio.value === id;
            row.classList.toggle("dc-rf-selected", active);
            if (radio) {
                radio.checked = active;
            }
        });
        renderHospitalSummary(filteredHospitals().length);
    }

    function clearHospitalSelection() {
        selectedHospitalId = "";
        removeStorage(KEYS.selectedHospital);
    }

    function clearFilters() {
        byId("rfHospitalSearch").value = "";
        byId("rfCityFilter").value = "";
        byId("rfSpecFilter").value = "";
        renderHospitals();
    }

    const FORM_FIELD_IDS = ["rfSpecialisation", "rfService", "rfDiagnosis", "rfUrgency", "rfReason", "rfSummary", "rfNotes"];

    function collectForm() {
        const values = {};
        FORM_FIELD_IDS.forEach(id => {
            values[id] = byId(id).value.trim();
        });
        return values;
    }

    function clearAllErrors() {
        ["rfPatientSearch", "rfSpecialisation", "rfService", "rfReason", "rfHospital"].forEach(clearError);
        setFormError("");
    }

    function validateReferral(mode) {
        clearAllErrors();
        const form = collectForm();
        const problems = [];
        if (!selectedPatient) {
            setError("rfPatientSearch", "Select a patient before continuing.");
            problems.push("rfPatientSearch");
        }
        if (!form.rfSpecialisation) {
            setError("rfSpecialisation", "Select the referral specialisation.");
            problems.push("rfSpecialisation");
        }
        if (mode === "submit") {
            if (!form.rfService) {
                setError("rfService", "Select or enter the requested service.");
                problems.push("rfService");
            }
            if (!form.rfReason) {
                setError("rfReason", "Enter the reason for referral.");
                problems.push("rfReason");
            }
            if (!selectedHospitalId) {
                setError("rfHospital", "Select a receiving hospital.");
                problems.push("rfHospitalSearch");
            }
        }
        if (problems.length) {
            setFormError(mode === "submit" ? "Please correct the highlighted fields before submitting." : "Select a patient and a specialisation to save a draft.");
            const first = byId(problems[0]);
            if (first) {
                first.focus();
            }
            return null;
        }
        return form;
    }

    function allReferrals() {
        return drafts.concat(records);
    }

    function createReferralId() {
        const now = new Date();
        const stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate());
        let id;
        do {
            id = "REF-" + stamp + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
        } while (allReferrals().some(item => item.id === id));
        return id;
    }

    function hospitalSnapshot() {
        const hospital = hospitals.find(item => item.id === selectedHospitalId);
        return hospital ? { id: hospital.id, name: hospital.name, city: hospital.city, source: hospital.source } : null;
    }

    function buildReferral(form, existing, status) {
        const now = new Date().toISOString();
        const history = existing ? existing.history.slice() : [];
        return {
            id: existing ? existing.id : createReferralId(),
            status,
            createdAt: existing ? existing.createdAt : now,
            updatedAt: now,
            doctor: doctorName,
            patient: {
                id: selectedPatient.id,
                name: selectedPatient.name,
                age: selectedPatient.age,
                gender: selectedPatient.gender,
                contact: selectedPatient.contact
            },
            hospital: hospitalSnapshot(),
            specialisation: form.rfSpecialisation,
            service: form.rfService,
            reason: form.rfReason,
            summary: form.rfSummary,
            diagnosis: form.rfDiagnosis,
            urgency: form.rfUrgency === "Urgent" ? "Urgent" : "Routine",
            notes: form.rfNotes,
            history
        };
    }

    function saveDraft() {
        hideNotice();
        const form = validateReferral("draft");
        if (!form) {
            return;
        }
        const existing = drafts.find(item => item.id === editingId);
        const draft = buildReferral(form, existing, "Draft");
        if (!existing) {
            draft.history.push({ status: "Draft", at: draft.createdAt, note: "Draft saved.", simulated: false });
        }
        const next = existing ? drafts.map(item => item.id === draft.id ? draft : item) : drafts.concat(draft);
        const previous = drafts;
        drafts = next;
        if (!persistDrafts()) {
            drafts = previous;
            setFormError("The draft could not be saved in this browser.");
            return;
        }
        editingId = draft.id;
        updateEditBanner();
        renderRecords();
        showNotice("Draft " + draft.id + " saved. It has not been submitted.");
    }

    function findDuplicate(form) {
        return records.find(item =>
            item.status !== "Cancelled" && item.status !== "Rejected" &&
            normalise(item.patient.name) === normalise(selectedPatient.name) &&
            item.hospital && item.hospital.id === selectedHospitalId &&
            normalise(item.specialisation) === normalise(form.rfSpecialisation) &&
            normalise(item.service) === normalise(form.rfService) &&
            normalise(item.reason) === normalise(form.rfReason));
    }

    function summaryRows(referral) {
        return [
            ["Patient", referral.patient.name],
            ["Receiving Hospital", referral.hospital ? referral.hospital.name + ", " + referral.hospital.city : "Not selected"],
            ["Specialisation", referral.specialisation || "---"],
            ["Requested Service", referral.service || "---"],
            ["Urgency", referral.urgency],
            ["Reason", referral.reason || "---"]
        ];
    }

    function requestSubmit() {
        hideNotice();
        const form = validateReferral("submit");
        if (!form) {
            return;
        }
        const duplicate = findDuplicate(form);
        if (duplicate) {
            setFormError("A matching referral (" + duplicate.id + ") has already been submitted for this patient and hospital.");
            return;
        }
        const preview = buildReferral(form, drafts.find(item => item.id === editingId), "Submitted");
        openConfirm({
            title: "Submit this referral?",
            intro: "Please confirm the patient and receiving hospital.",
            rows: summaryRows(preview),
            note: "Submission is simulated locally. No real hospital will receive this referral.",
            confirmLabel: "Submit Referral",
            cancelLabel: "Go Back",
            onConfirm: () => submitReferral()
        });
    }

    function submitReferral() {
        const form = validateReferral("submit");
        if (!form) {
            return false;
        }
        if (findDuplicate(form)) {
            setFormError("This referral has already been submitted.");
            return false;
        }
        const existing = drafts.find(item => item.id === editingId);
        const referral = buildReferral(form, existing, "Submitted");
        referral.history.push({ status: "Submitted", at: referral.updatedAt, note: "Submitted in the frontend simulation. No hospital received it.", simulated: false });
        const previousRecords = records;
        const previousDrafts = drafts;
        records = records.concat(referral);
        drafts = drafts.filter(item => item.id !== referral.id);
        if (!persistRecords() || !persistDrafts()) {
            records = previousRecords;
            drafts = previousDrafts;
            setFormError("The referral could not be saved in this browser.");
            return false;
        }
        resetForm();
        renderRecords();
        byId("rfResultId").textContent = referral.id;
        window.setTimeout(() => openModal("rfResultModal", "rfResultRecords"), 0);
        return true;
    }

    function resetForm() {
        FORM_FIELD_IDS.forEach(id => {
            byId(id).value = id === "rfUrgency" ? "Routine" : "";
        });
        selectedPatient = null;
        renderPatientCard();
        byId("rfPatientSearch").value = "";
        clearHospitalSelection();
        editingId = "";
        updateEditBanner();
        clearAllErrors();
        renderHospitals();
    }

    function updateEditBanner() {
        const banner = byId("rfEditBanner");
        banner.hidden = !editingId;
        byId("rfEditBannerText").textContent = editingId ? "Editing draft " + editingId + "." : "";
    }

    function editDraft(id) {
        const draft = drafts.find(item => item.id === id);
        if (!draft) {
            return;
        }
        hideNotice();
        clearAllErrors();
        const known = patients.find(item => normalise(item.name) === normalise(draft.patient.name));
        if (known) {
            selectPatient(known);
        } else {
            selectedPatient = { id: draft.patient.id || "", name: draft.patient.name, age: draft.patient.age || "", gender: draft.patient.gender || "", contact: draft.patient.contact || "", weight: "", height: "", bloodPressure: "", bloodSugar: "", purpose: "" };
            renderPatientCard();
        }
        byId("rfSpecialisation").value = draft.specialisation;
        byId("rfService").value = draft.service || "";
        byId("rfDiagnosis").value = draft.diagnosis || "";
        byId("rfUrgency").value = draft.urgency === "Urgent" ? "Urgent" : "Routine";
        byId("rfReason").value = draft.reason || "";
        byId("rfSummary").value = draft.summary || "";
        byId("rfNotes").value = draft.notes || "";
        if (draft.hospital && hospitals.some(item => item.id === draft.hospital.id)) {
            selectHospital(draft.hospital.id);
        } else {
            clearHospitalSelection();
        }
        editingId = draft.id;
        updateEditBanner();
        renderHospitals();
        switchTab("new");
        byId("rfEditBanner").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function createBadge(status) {
        return el("span", "dc-rf-badge " + STATUS_CLASS[status], status);
    }

    function createActionButton(label, handler) {
        const button = el("button", "dc-rf-link", label);
        button.type = "button";
        button.addEventListener("click", handler);
        return button;
    }

    function renderRecords() {
        const body = byId("rfRecordRows");
        const list = allReferrals().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        body.replaceChildren();
        byId("rfRecordTotal").textContent = String(list.length);
        if (!list.length) {
            const row = document.createElement("tr");
            const cell = el("td", "dc-rf-empty", "No referrals yet. Saved drafts and submitted referrals will appear here.");
            cell.colSpan = 8;
            row.appendChild(cell);
            body.appendChild(row);
            return;
        }
        list.forEach(item => {
            const row = document.createElement("tr");
            row.appendChild(createCell(item.id, "dc-rf-name"));
            row.appendChild(createCell(item.patient.name));
            row.appendChild(createCell(item.hospital ? item.hospital.name : "Not selected", item.hospital ? "" : "dc-rf-muted"));
            row.appendChild(createCell(item.specialisation || "---"));
            row.appendChild(createCell(formatDate(item.createdAt)));
            row.appendChild(createCell(item.urgency || "Routine"));
            const statusCell = el("td");
            statusCell.appendChild(createBadge(item.status));
            row.appendChild(statusCell);
            const actions = el("td", "dc-rf-actions-cell");
            actions.appendChild(createActionButton("View", () => openView(item.id)));
            if (item.status === "Draft") {
                actions.appendChild(createActionButton("Edit Draft", () => editDraft(item.id)));
            }
            if (CANCELLABLE.includes(item.status)) {
                actions.appendChild(createActionButton("Cancel", () => requestCancel(item.id)));
            }
            row.appendChild(actions);
            body.appendChild(row);
        });
    }

    function requestCancel(id) {
        const item = allReferrals().find(entry => entry.id === id);
        if (!item) {
            return;
        }
        openConfirm({
            title: "Cancel this referral?",
            intro: "Referral " + item.id + " will be marked Cancelled.",
            rows: summaryRows(item),
            note: "This only updates the local record. No hospital is notified.",
            confirmLabel: "Cancel Referral",
            cancelLabel: "Keep Referral",
            onConfirm: () => cancelReferral(id)
        });
    }

    function cancelReferral(id) {
        const now = new Date().toISOString();
        const entry = { status: "Cancelled", at: now, note: "Cancelled by the doctor. Local record only.", simulated: false };
        const draft = drafts.find(item => item.id === id);
        if (draft) {
            const cancelled = { ...draft, status: "Cancelled", updatedAt: now, history: draft.history.concat(entry) };
            records = records.concat(cancelled);
            drafts = drafts.filter(item => item.id !== id);
            persistRecords();
            persistDrafts();
            if (editingId === id) {
                resetForm();
            }
        } else {
            const record = records.find(item => item.id === id);
            if (!record || !CANCELLABLE.includes(record.status)) {
                return true;
            }
            record.status = "Cancelled";
            record.updatedAt = now;
            record.history.push(entry);
            persistRecords();
        }
        renderRecords();
        window.setTimeout(() => showNotice("Referral " + id + " was cancelled."), 0);
        return true;
    }

    function openView(id) {
        const item = allReferrals().find(entry => entry.id === id);
        if (!item) {
            return;
        }
        viewId = id;
        populateView(item);
        openModal("rfViewModal", null);
    }

    function populateView(item) {
        byId("rfViewSub").textContent = item.id + " · Created " + formatDateTime(item.createdAt);
        const list = byId("rfViewList");
        list.replaceChildren();
        const rows = [
            ["Status", item.status],
            ["Urgency", item.urgency || "Routine"],
            ["Patient", item.patient.name],
            ["Age / Gender", [item.patient.age ? item.patient.age + " years" : "", item.patient.gender].filter(Boolean).join(", ") || "Not recorded"],
            ["Referring Doctor", item.doctor || PLACEHOLDER],
            ["Receiving Hospital", item.hospital ? item.hospital.name + ", " + item.hospital.city + (SOURCE_LABEL[item.hospital.source] ? " (" + SOURCE_LABEL[item.hospital.source] + ")" : "") : "Not selected"],
            ["Specialisation", item.specialisation || "---"],
            ["Requested Service", item.service || "---"],
            ["Relevant Diagnosis", item.diagnosis || "---"],
            ["Reason for Referral", item.reason || "---"],
            ["Clinical Summary", item.summary || "---"],
            ["Additional Notes", item.notes || "---"]
        ];
        rows.forEach(([label, value]) => {
            const box = el("div");
            box.appendChild(el("dt", "", label));
            box.appendChild(el("dd", "", value));
            list.appendChild(box);
        });
        const history = byId("rfViewHistory");
        history.replaceChildren();
        item.history.forEach(entry => {
            const line = el("li");
            line.appendChild(el("strong", "", entry.status));
            line.appendChild(document.createTextNode(" · " + formatDateTime(entry.at) + (entry.simulated ? " · Simulated" : "")));
            if (entry.note) {
                line.appendChild(el("span", "dc-rf-history-note", entry.note));
            }
            history.appendChild(line);
        });
        const next = NEXT_STATUS[item.status] || [];
        const sim = byId("rfViewSim");
        sim.hidden = !next.length || !records.some(entry => entry.id === item.id);
        fillSelect(byId("rfSimStatus"), next, "");
        if (next.length) {
            byId("rfSimStatus").value = next[0];
        }
    }

    function applySimulatedStatus() {
        const record = records.find(item => item.id === viewId);
        const status = byId("rfSimStatus").value;
        if (!record || !(NEXT_STATUS[record.status] || []).includes(status)) {
            return;
        }
        const now = new Date().toISOString();
        record.status = status;
        record.updatedAt = now;
        record.history.push({ status, at: now, note: "Simulated status update for demonstration. Not a hospital acknowledgement.", simulated: true });
        persistRecords();
        renderRecords();
        populateView(record);
    }

    function openConfirm(config) {
        byId("rfConfirmTitle").textContent = config.title;
        byId("rfConfirmIntro").textContent = config.intro;
        byId("rfConfirmNote").textContent = config.note;
        byId("rfConfirmOk").textContent = config.confirmLabel;
        byId("rfConfirmCancel").textContent = config.cancelLabel;
        const list = byId("rfConfirmList");
        list.replaceChildren();
        config.rows.forEach(([label, value]) => {
            const box = el("div");
            box.appendChild(el("dt", "", label));
            box.appendChild(el("dd", "", value));
            list.appendChild(box);
        });
        confirmAction = config.onConfirm;
        confirmBusy = false;
        byId("rfConfirmOk").disabled = false;
        openModal("rfConfirmModal", "rfConfirmOk");
    }

    function runConfirm() {
        if (confirmBusy || !confirmAction) {
            return;
        }
        confirmBusy = true;
        byId("rfConfirmOk").disabled = true;
        const action = confirmAction;
        confirmAction = null;
        closeModal();
        action();
    }

    const HOSPITAL_FIELDS = ["rfHospName", "rfHospAddress", "rfHospCity", "rfHospPhone", "rfHospEmail", "rfHospSpec"];

    function isValidPhone(value) {
        if (!/^\+?[\d\s()\-]+$/.test(value)) {
            return false;
        }
        const digits = value.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15;
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function resetHospitalForm() {
        byId("rfHospitalForm").reset();
        HOSPITAL_FIELDS.forEach(clearError);
    }

    function createHospitalId() {
        let id;
        do {
            id = "hosp-local-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        } while (hospitals.some(item => item.id === id));
        return id;
    }

    function submitHospital(event) {
        event.preventDefault();
        HOSPITAL_FIELDS.forEach(clearError);
        const name = byId("rfHospName").value.trim().replace(/\s+/g, " ");
        const address = byId("rfHospAddress").value.trim().replace(/\s+/g, " ");
        const city = byId("rfHospCity").value.trim().replace(/\s+/g, " ");
        const phone = byId("rfHospPhone").value.trim();
        const email = byId("rfHospEmail").value.trim();
        const specs = Array.from(document.querySelectorAll("#rfHospSpecChecks input:checked")).map(box => box.value);
        const problems = [];
        if (!name) {
            setError("rfHospName", "Enter the hospital name.");
            problems.push("rfHospName");
        }
        if (!address) {
            setError("rfHospAddress", "Enter the hospital address.");
            problems.push("rfHospAddress");
        }
        if (!city) {
            setError("rfHospCity", "Enter the city.");
            problems.push("rfHospCity");
        }
        if (!phone) {
            setError("rfHospPhone", "Enter the phone number.");
            problems.push("rfHospPhone");
        } else if (!isValidPhone(phone)) {
            setError("rfHospPhone", "Enter a valid phone number with 8 to 15 digits.");
            problems.push("rfHospPhone");
        }
        if (!email) {
            setError("rfHospEmail", "Enter the email address.");
            problems.push("rfHospEmail");
        } else if (!isValidEmail(email)) {
            setError("rfHospEmail", "Enter a valid email address.");
            problems.push("rfHospEmail");
        }
        if (!specs.length) {
            setError("rfHospSpec", "Select at least one specialisation.");
            problems.push("rfHospSpecChecks");
        }
        if (!problems.length && hospitals.some(item => normalise(item.name) === normalise(name) && normalise(item.city) === normalise(city))) {
            setError("rfHospName", "A hospital with this name already exists in " + city + ".");
            problems.push("rfHospName");
        }
        if (problems.length) {
            const first = byId(problems[0]) || document.querySelector("#rfHospSpecChecks input");
            if (first) {
                first.focus();
            }
            return;
        }
        const hospital = { id: createHospitalId(), name, address, city, phone, email, specialisations: specs, source: "local" };
        const previous = hospitals;
        hospitals = hospitals.concat(hospital);
        if (!persistHospitals()) {
            hospitals = previous;
            setError("rfHospName", "The hospital could not be saved in this browser.");
            byId("rfHospName").focus();
            return;
        }
        renderCityFilter();
        clearFilters();
        closeModal();
        showNotice(name + " was added as a local, unverified demo entry.");
    }

    function openModal(id, focusId) {
        if (activeModal) {
            return;
        }
        const modal = byId(id);
        modalOpener = document.activeElement;
        modal.hidden = false;
        activeModal = modal;
        document.body.classList.add("dc-rf-modal-open");
        const target = (focusId && byId(focusId)) || modal.querySelector("button, input");
        if (target) {
            target.focus();
        }
    }

    function closeModal() {
        if (!activeModal) {
            return;
        }
        if (activeModal.id === "rfHospitalModal") {
            resetHospitalForm();
        }
        if (activeModal.id === "rfConfirmModal") {
            confirmAction = null;
        }
        activeModal.hidden = true;
        activeModal = null;
        document.body.classList.remove("dc-rf-modal-open");
        if (modalOpener && typeof modalOpener.focus === "function" && document.contains(modalOpener)) {
            modalOpener.focus();
        }
        modalOpener = null;
    }

    function setupModals() {
        document.querySelectorAll(".dc-rf-modal").forEach(modal => {
            modal.addEventListener("click", event => {
                if (event.target === modal || event.target.closest("[data-rf-close]")) {
                    closeModal();
                }
            });
        });
        document.addEventListener("keydown", event => {
            if (!activeModal) {
                return;
            }
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
                return;
            }
            if (event.key !== "Tab") {
                return;
            }
            const focusable = Array.from(activeModal.querySelectorAll("button, input, select, textarea")).filter(item => !item.disabled && item.offsetParent !== null);
            if (!focusable.length) {
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
        byId("rfHospitalForm").addEventListener("submit", submitHospital);
        byId("rfHospitalClear").addEventListener("click", () => {
            resetHospitalForm();
            byId("rfHospName").focus();
        });
        HOSPITAL_FIELDS.forEach(id => {
            const field = byId(id);
            if (field) {
                field.addEventListener("input", () => clearError(id));
            }
        });
        byId("rfHospSpecChecks").addEventListener("change", () => clearError("rfHospSpec"));
        byId("rfConfirmOk").addEventListener("click", runConfirm);
        byId("rfSimApply").addEventListener("click", applySimulatedStatus);
        byId("rfResultRecords").addEventListener("click", () => {
            closeModal();
            switchTab("records");
        });
    }

    function switchTab(key) {
        document.querySelectorAll(".dc-rf-tab").forEach(tab => {
            const active = tab.dataset.rfTab === key;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", String(active));
        });
        document.querySelectorAll(".dc-rf-panel").forEach(panel => {
            panel.hidden = panel.id !== "rfPanel-" + key;
        });
    }

    function setupForm() {
        const search = byId("rfPatientSearch");
        search.addEventListener("focus", renderPatientResults);
        search.addEventListener("input", () => {
            clearError("rfPatientSearch");
            renderPatientResults();
        });
        search.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closePatientResults();
            } else if (event.key === "ArrowDown") {
                const first = byId("rfPatientResults").querySelector("button");
                if (first) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
        byId("rfPatientResults").addEventListener("keydown", event => {
            const options = Array.from(byId("rfPatientResults").querySelectorAll("button"));
            const index = options.indexOf(document.activeElement);
            if (event.key === "ArrowDown" && index < options.length - 1) {
                event.preventDefault();
                options[index + 1].focus();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                (index > 0 ? options[index - 1] : search).focus();
            } else if (event.key === "Escape") {
                closePatientResults();
                search.focus();
            }
        });
        document.addEventListener("click", event => {
            if (!event.target.closest(".dc-rf-combo")) {
                closePatientResults();
            }
        });
        byId("rfPatientChange").addEventListener("click", clearPatient);
        ["rfSpecialisation", "rfService", "rfReason"].forEach(id => {
            const field = byId(id);
            field.addEventListener("input", () => clearError(id));
            field.addEventListener("change", () => clearError(id));
        });
        byId("rfHospitalSearch").addEventListener("input", renderHospitals);
        byId("rfCityFilter").addEventListener("change", renderHospitals);
        byId("rfSpecFilter").addEventListener("change", renderHospitals);
        byId("rfClearFilters").addEventListener("click", clearFilters);
        byId("rfAddHospital").addEventListener("click", () => {
            hideNotice();
            resetHospitalForm();
            openModal("rfHospitalModal", "rfHospName");
        });
        byId("rfSaveDraft").addEventListener("click", saveDraft);
        byId("rfSubmit").addEventListener("click", requestSubmit);
        byId("rfResetForm").addEventListener("click", () => {
            hideNotice();
            resetForm();
        });
        byId("rfEditDiscard").addEventListener("click", () => {
            hideNotice();
            resetForm();
        });
        document.querySelectorAll(".dc-rf-tab").forEach(tab => {
            tab.addEventListener("click", () => switchTab(tab.dataset.rfTab));
        });
    }

    function setupNavigation() {
        document.querySelectorAll("#dcTabs .nav-item").forEach(tab => {
            tab.classList.toggle("active", tab.dataset.tab === "referrals");
            tab.addEventListener("click", () => {
                const target = tab.dataset.tab;
                if (target === "referrals" || target === "inpatient") {
                    return;
                }
                if (target === "patients") {
                    window.location.href = "doctor-patient.html";
                    return;
                }
                window.location.href = "doctor-dashboard.html?tab=" + encodeURIComponent(target);
            });
        });
    }

    function initializeReferalPage() {
        const session = window.HHAuth && HHAuth.requireRole ? HHAuth.requireRole("doctor") : null;
        if (window.HHAuth && !session) {
            return;
        }
        document.body.classList.remove("auth-pending");
        if (session && typeof fillUser === "function") {
            fillUser(session);
        }
        if (typeof startClock === "function") {
            startClock();
        }
        setupNavigation();
        fillDoctor(session);
        loadAll();
        loadPatients();
        renderStaticOptions();
        renderCityFilter();
        renderPatientCard();
        renderHospitals();
        renderRecords();
        setupForm();
        setupModals();
        if (typeof setupProfileMenu === "function") {
            setupProfileMenu();
        }
        if (typeof window.setupModals === "function") {
            window.setupModals();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!document.getElementById("dcTabs")) {
            document.addEventListener("doctorNavbarReady", initializeReferalPage, { once: true });
            return;
        }
        initializeReferalPage();
    });

})();
