(() => {
    "use strict";

    const repo = window.InpatientRepository;
    const PAGE_SIZE = 8;
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const STATUS_TONE = { "Stable": "green", "Under Observation": "blue", "Review Due": "amber", "Critical": "red", "Discharge Planning": "purple" };
    const ACUITY_TONE = { "Low": "green", "Moderate": "amber", "High": "red" };

    const state = { search: "", ward: "", status: "", acuity: "", page: 1 };
    let patients = [];
    let activeModal = null;
    let modalOpener = null;
    let notePatientId = null;
    let noteReturnsToDetail = false;
    let detailPatientId = null;
    let noticeTimer = null;

    const byId = id => document.getElementById(id);

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function parseDate(value) {
        const date = new Date(value.length === 10 ? value + "T00:00:00" : value);
        return isNaN(date.getTime()) ? null : date;
    }

    function formatDate(value) {
        const date = parseDate(value);
        return date ? pad(date.getDate()) + "-" + MONTHS[date.getMonth()] + "-" + date.getFullYear() : "—";
    }

    function formatDateTime(value) {
        const date = value instanceof Date ? value : parseDate(value);
        if (!date) return "—";
        let hours = date.getHours();
        const suffix = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return formatDate(localIso(date)) + " " + pad(hours) + ":" + pad(date.getMinutes()) + " " + suffix;
    }

    function localIso(date) {
        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
    }

    function lengthOfStay(admittedOn) {
        const admitted = parseDate(admittedOn);
        if (!admitted) return "—";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Math.max(0, Math.round((today - admitted) / 86400000));
        if (days === 0) return "Admitted today";
        return days + (days === 1 ? " day" : " days");
    }

    function roomBed(patient) {
        return patient.room + " / " + patient.bed;
    }

    function pill(label, tone) {
        return el("span", "dc-ip-pill " + tone, label);
    }

    function currentAuthor() {
        const name = byId("dcUserName");
        const text = name ? name.textContent.trim() : "";
        return text || "Doctor";
    }

    function showNotice(message, isWarning) {
        const notice = byId("ipNotice");
        notice.textContent = message;
        notice.hidden = false;
        notice.style.color = isWarning ? "#B7791F" : "";
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => { notice.hidden = true; }, 6000);
    }

    function loadPatients() {
        patients = repo.listPatients();
    }

    function filteredPatients() {
        const query = state.search.trim().toLowerCase();
        return patients.filter(patient => {
            if (state.ward && patient.ward !== state.ward) return false;
            if (state.status && patient.status !== state.status) return false;
            if (state.acuity && patient.acuity !== state.acuity) return false;
            if (!query) return true;
            return [patient.name, patient.id, patient.diagnosis, patient.ward, patient.room, patient.bed, roomBed(patient)]
                .some(field => field.toLowerCase().indexOf(query) >= 0);
        });
    }

    function populateFilters() {
        const wards = Array.from(new Set(patients.map(p => p.ward))).sort();
        fillSelect(byId("ipFilterWard"), wards);
        fillSelect(byId("ipFilterStatus"), repo.STATUSES);
        fillSelect(byId("ipFilterAcuity"), repo.ACUITIES);
    }

    function fillSelect(select, values) {
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function textCell(value, className) {
        const cell = document.createElement("td");
        if (className) cell.className = className;
        cell.textContent = value;
        return cell;
    }

    function renderTable() {
        const rows = filteredPatients();
        const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
        if (state.page > totalPages) state.page = totalPages;
        const start = (state.page - 1) * PAGE_SIZE;
        const pageRows = rows.slice(start, start + PAGE_SIZE);
        const body = byId("ipRows");
        body.textContent = "";

        if (!pageRows.length) {
            const row = document.createElement("tr");
            const cell = el("td", "dc-empty");
            cell.colSpan = 11;
            cell.appendChild(el("span", "dc-ip-empty-title", "No in-patients match your search or filters."));
            cell.appendChild(document.createTextNode("Try a different search term or reset the filters."));
            row.appendChild(cell);
            body.appendChild(row);
        }

        pageRows.forEach(patient => {
            const row = document.createElement("tr");
            row.dataset.patientId = patient.id;
            row.appendChild(textCell(patient.name, "dc-ip-name"));
            row.appendChild(textCell(patient.id, "dc-ip-muted"));
            row.appendChild(textCell(patient.ward));
            row.appendChild(textCell(roomBed(patient)));
            row.appendChild(textCell(formatDate(patient.admittedOn)));
            row.appendChild(textCell(lengthOfStay(patient.admittedOn)));
            row.appendChild(textCell(patient.diagnosis, "dc-ip-diagnosis"));
            row.appendChild(textCell(patient.attending));
            const acuityCell = document.createElement("td");
            acuityCell.appendChild(pill(patient.acuity, ACUITY_TONE[patient.acuity] || "blue"));
            row.appendChild(acuityCell);
            const statusCell = document.createElement("td");
            statusCell.appendChild(pill(patient.status, STATUS_TONE[patient.status] || "blue"));
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");
            const actions = el("div", "dc-ip-actions");
            const view = el("button", "dc-ip-btn small", "View");
            view.type = "button";
            view.dataset.action = "view";
            view.setAttribute("aria-label", "View details for " + patient.name);
            const note = el("button", "dc-ip-btn small", "Add Note");
            note.type = "button";
            note.dataset.action = "note";
            note.setAttribute("aria-label", "Add note for " + patient.name);
            actions.appendChild(view);
            actions.appendChild(note);
            actionCell.appendChild(actions);
            row.appendChild(actionCell);
            body.appendChild(row);
        });

        const count = byId("ipRecordCount");
        if (rows.length) {
            count.textContent = "Showing " + (start + 1) + " to " + (start + pageRows.length) + " of " + rows.length + " records";
        } else {
            count.textContent = "Showing 0 of " + patients.length + " records";
        }
        renderPager(totalPages);
    }

    function renderPager(totalPages) {
        const pager = byId("ipPager");
        pager.textContent = "";
        if (totalPages <= 1) return;
        const make = (label, page, options) => {
            const button = el("button", "dc-page-btn" + (options && options.active ? " active" : ""), label);
            button.type = "button";
            button.dataset.page = page;
            if (options && options.disabled) button.disabled = true;
            if (options && options.aria) button.setAttribute("aria-label", options.aria);
            if (options && options.active) button.setAttribute("aria-current", "page");
            pager.appendChild(button);
        };
        make("‹", state.page - 1, { disabled: state.page === 1, aria: "Previous page" });
        for (let page = 1; page <= totalPages; page++) {
            make(String(page), page, { active: page === state.page, aria: "Page " + page });
        }
        make("›", state.page + 1, { disabled: state.page === totalPages, aria: "Next page" });
    }

    function refresh() {
        renderTable();
    }

    function section(title) {
        const wrapper = el("section", "dc-ip-section");
        wrapper.appendChild(el("h4", "dc-ip-section-head", title));
        const body = el("div", "dc-ip-section-body");
        wrapper.appendChild(body);
        return { wrapper, body };
    }

    function definitionGrid(items) {
        const list = el("dl", "dc-ip-grid");
        items.forEach(([label, value]) => {
            const group = document.createElement("div");
            group.appendChild(el("dt", null, label));
            const dd = document.createElement("dd");
            if (value instanceof Node) dd.appendChild(value);
            else dd.textContent = value;
            group.appendChild(dd);
            list.appendChild(group);
        });
        return list;
    }

    function vitalsGrid(observations) {
        const list = el("dl", "dc-ip-vitals");
        [
            ["Blood pressure", observations.bp, "mmHg"],
            ["Heart rate", observations.hr, "bpm"],
            ["Temperature", observations.temp, "°C"],
            ["Oxygen saturation", observations.spo2, "%"],
            ["Respiratory rate", observations.rr, "breaths/min"]
        ].forEach(([label, value, unit]) => {
            const tile = el("div", "dc-ip-vital");
            tile.appendChild(el("dt", null, label));
            const dd = document.createElement("dd");
            dd.appendChild(document.createTextNode(value + " "));
            dd.appendChild(el("small", null, unit));
            tile.appendChild(dd);
            list.appendChild(tile);
        });
        return list;
    }

    function textBlock(title, content) {
        const block = el("div", "dc-ip-block");
        block.appendChild(el("h5", null, title));
        if (Array.isArray(content)) {
            const list = document.createElement("ul");
            content.forEach(item => list.appendChild(el("li", null, item)));
            block.appendChild(list);
        } else {
            block.appendChild(el("p", null, content));
        }
        return block;
    }

    function notesList(notes) {
        if (!notes.length) return el("p", "dc-ip-muted", "No progress notes recorded yet.");
        const list = el("ol", "dc-ip-notes");
        notes.forEach(note => {
            const item = el("li", "dc-ip-note");
            const meta = el("div", "dc-ip-note-meta");
            meta.appendChild(el("strong", null, note.type));
            meta.appendChild(el("span", null, formatDateTime(note.createdAt)));
            meta.appendChild(el("span", null, note.author));
            item.appendChild(meta);
            item.appendChild(el("p", "dc-ip-note-text", note.text));
            list.appendChild(item);
        });
        return list;
    }

    function statusControl(patient) {
        const row = el("div", "dc-ip-status-row");
        const field = el("div", "dc-ip-field");
        const label = el("label", null, "Update clinical status");
        label.htmlFor = "ipStatusSelect";
        const select = document.createElement("select");
        select.id = "ipStatusSelect";
        repo.STATUSES.forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            option.selected = status === patient.status;
            select.appendChild(option);
        });
        field.appendChild(label);
        field.appendChild(select);
        const button = el("button", "dc-ip-btn", "Update Status");
        button.type = "button";
        button.id = "ipStatusSave";
        row.appendChild(field);
        row.appendChild(button);
        return row;
    }

    function renderDetail(patient) {
        byId("ipDetailTitle").textContent = patient.name;
        byId("ipDetailSub").textContent = patient.id + " · Demo data, not a live medical record";
        const body = byId("ipDetailBody");
        body.textContent = "";

        const info = section("Patient Information");
        info.body.appendChild(definitionGrid([
            ["Patient name", patient.name],
            ["Patient ID", patient.id],
            ["Age / Gender", patient.age + " years / " + patient.gender],
            ["Admitted on", formatDate(patient.admittedOn) + " (" + lengthOfStay(patient.admittedOn) + ")"],
            ["Ward", patient.ward],
            ["Room / Bed", roomBed(patient)]
        ]));
        body.appendChild(info.wrapper);

        const clinical = section("Clinical Information");
        clinical.body.appendChild(definitionGrid([
            ["Primary diagnosis", patient.diagnosis],
            ["Attending doctor", patient.attending],
            ["Known allergies", patient.allergies],
            ["Acuity", pill(patient.acuity, ACUITY_TONE[patient.acuity] || "blue")],
            ["Clinical status", pill(patient.status, STATUS_TONE[patient.status] || "blue")]
        ]));
        clinical.body.appendChild(statusControl(patient));
        body.appendChild(clinical.wrapper);

        const vitals = section("Latest Observations");
        vitals.body.appendChild(vitalsGrid(patient.observations));
        vitals.body.appendChild(el("p", "dc-ip-caption", "Recorded " + formatDateTime(patient.observations.recordedAt) + " · Demo values"));
        body.appendChild(vitals.wrapper);

        const care = section("Care Overview");
        care.body.appendChild(textBlock("Clinical summary", patient.summary));
        care.body.appendChild(textBlock("Current care plan", patient.carePlan));
        care.body.appendChild(textBlock("Important observations", patient.keyObservations));
        body.appendChild(care.wrapper);

        const notes = section("Recent Progress Notes");
        notes.body.appendChild(notesList(patient.notes));
        body.appendChild(notes.wrapper);
    }

    function focusableIn(container) {
        return Array.from(container.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
            .filter(node => !node.disabled && !node.hidden && node.offsetParent !== null);
    }

    function openModal(id, opener) {
        if (activeModal) closeModal(true);
        const modal = byId(id);
        modal.hidden = false;
        document.body.classList.add("dc-ip-modal-open");
        activeModal = modal;
        modalOpener = opener || null;
        const dialog = modal.querySelector(".dc-ip-dialog");
        const first = focusableIn(dialog).find(node => !node.classList.contains("dc-ip-close"));
        (first || dialog).focus();
    }

    function closeModal(skipFocus) {
        if (!activeModal) return;
        activeModal.hidden = true;
        document.body.classList.remove("dc-ip-modal-open");
        const wasNote = activeModal.id === "ipNoteModal";
        activeModal = null;
        const opener = modalOpener;
        modalOpener = null;
        if (skipFocus) return;
        if (wasNote && noteReturnsToDetail && detailPatientId) {
            noteReturnsToDetail = false;
            openDetail(detailPatientId, opener);
            return;
        }
        noteReturnsToDetail = false;
        if (opener && document.contains(opener)) opener.focus();
    }

    function openDetail(patientId, opener) {
        const patient = repo.getPatient(patientId);
        if (!patient) return;
        detailPatientId = patientId;
        renderDetail(patient);
        openModal("ipDetailModal", opener);
    }

    function openNoteForm(patientId, opener, fromDetail) {
        const patient = repo.getPatient(patientId);
        if (!patient) return;
        notePatientId = patientId;
        noteReturnsToDetail = Boolean(fromDetail);
        const select = byId("ipNoteType");
        select.textContent = "";
        fillSelect(select, repo.NOTE_TYPES);
        byId("ipNoteText").value = "";
        byId("ipNoteCounter").textContent = "0 / 1000";
        byId("ipNoteSub").textContent = patient.name + " · " + patient.id + " · " + roomBed(patient);
        byId("ipNoteAuthor").value = currentAuthor();
        byId("ipNoteTime").value = formatDateTime(new Date());
        clearNoteErrors();
        openModal("ipNoteModal", opener);
    }

    function setFieldError(inputId, errorId, message) {
        const input = byId(inputId);
        const error = byId(errorId);
        error.textContent = message || "";
        error.hidden = !message;
        if (message) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
    }

    function clearNoteErrors() {
        setFieldError("ipNoteType", "ipNoteTypeError", "");
        setFieldError("ipNoteText", "ipNoteTextError", "");
        const formError = byId("ipNoteFormError");
        formError.hidden = true;
        formError.textContent = "";
    }

    function submitNote(event) {
        event.preventDefault();
        clearNoteErrors();
        const type = byId("ipNoteType").value;
        const text = byId("ipNoteText").value.trim();
        let valid = true;
        if (repo.NOTE_TYPES.indexOf(type) < 0) {
            setFieldError("ipNoteType", "ipNoteTypeError", "Select a note type.");
            valid = false;
        }
        if (!text) {
            setFieldError("ipNoteText", "ipNoteTextError", "Enter the progress note.");
            valid = false;
        } else if (text.length < 10) {
            setFieldError("ipNoteText", "ipNoteTextError", "Progress note must be at least 10 characters.");
            valid = false;
        }
        if (!valid) {
            const firstInvalid = document.querySelector("#ipNoteForm [aria-invalid='true']");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const result = repo.addNote(notePatientId, { type, text, author: byId("ipNoteAuthor").value, createdAt: localIso(new Date()) });
        if (!result.ok) {
            const formError = byId("ipNoteFormError");
            formError.textContent = "The note could not be saved. Please try again.";
            formError.hidden = false;
            return;
        }
        const patient = repo.getPatient(notePatientId);
        loadPatients();
        refresh();
        closeModal();
        showNotice("Note saved for " + patient.name + "." + (result.persisted ? "" : " Browser storage is unavailable, so it will be lost when this page is closed."), !result.persisted);
    }

    function submitStatus() {
        const select = byId("ipStatusSelect");
        const patient = repo.getPatient(detailPatientId);
        if (!patient) return;
        if (select.value === patient.status) {
            showNotice("Clinical status is already " + patient.status + ".");
            return;
        }
        const result = repo.updateStatus(detailPatientId, select.value, currentAuthor(), localIso(new Date()));
        if (!result.ok) {
            showNotice("The status could not be updated.", true);
            return;
        }
        loadPatients();
        refresh();
        renderDetail(repo.getPatient(detailPatientId));
        byId("ipStatusSelect").focus();
        showNotice(patient.name + " clinical status updated to " + select.value + "." + (result.persisted ? "" : " Browser storage is unavailable, so this will be lost when the page is closed."), !result.persisted);
    }

    function resetFilters() {
        state.search = "";
        state.ward = "";
        state.status = "";
        state.acuity = "";
        state.page = 1;
        byId("ipSearch").value = "";
        byId("ipFilterWard").value = "";
        byId("ipFilterStatus").value = "";
        byId("ipFilterAcuity").value = "";
        renderTable();
    }

    function setupEvents() {
        byId("ipSearch").addEventListener("input", event => {
            state.search = event.target.value;
            state.page = 1;
            renderTable();
        });
        byId("ipSearchBtn").addEventListener("click", () => byId("ipSearch").focus());
        [["ipFilterWard", "ward"], ["ipFilterStatus", "status"], ["ipFilterAcuity", "acuity"]].forEach(([id, key]) => {
            byId(id).addEventListener("change", event => {
                state[key] = event.target.value;
                state.page = 1;
                renderTable();
            });
        });
        byId("ipReset").addEventListener("click", resetFilters);

        byId("ipRows").addEventListener("click", event => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const row = button.closest("tr");
            if (!row || !row.dataset.patientId) return;
            if (button.dataset.action === "view") openDetail(row.dataset.patientId, button);
            else openNoteForm(row.dataset.patientId, button, false);
        });

        byId("ipPager").addEventListener("click", event => {
            const button = event.target.closest("button[data-page]");
            if (!button || button.disabled) return;
            state.page = Number(button.dataset.page);
            renderTable();
        });

        byId("ipDetailAddNote").addEventListener("click", event => {
            if (!detailPatientId) return;
            const opener = modalOpener;
            openNoteForm(detailPatientId, opener || event.currentTarget, true);
        });
        byId("ipDetailBody").addEventListener("click", event => {
            if (event.target.id === "ipStatusSave") submitStatus();
        });

        byId("ipNoteForm").addEventListener("submit", submitNote);
        byId("ipNoteText").addEventListener("input", event => {
            byId("ipNoteCounter").textContent = event.target.value.length + " / 1000";
            if (event.target.value.trim()) setFieldError("ipNoteText", "ipNoteTextError", "");
        });

        document.querySelectorAll(".dc-ip-modal").forEach(modal => {
            modal.addEventListener("mousedown", event => {
                if (event.target === modal) closeModal();
            });
            modal.querySelectorAll("[data-ip-close]").forEach(button => button.addEventListener("click", () => closeModal()));
        });

        document.addEventListener("keydown", event => {
            if (!activeModal) return;
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
                return;
            }
            if (event.key !== "Tab") return;
            const items = focusableIn(activeModal.querySelector(".dc-ip-dialog"));
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    function setupNavigation() {
        document.querySelectorAll("#dcTabs .nav-item").forEach(tab => {
            tab.classList.toggle("active", tab.dataset.tab === "inpatient");
            if (tab.dataset.tab === "inpatient") {
                tab.setAttribute("aria-current", "page");
                return;
            }
            tab.addEventListener("click", () => {
                if (tab.dataset.tab === "patients") window.location.href = "doctor-patient.html";
                else if (tab.dataset.tab === "referrals") window.location.href = "doctor-referals.html";
                else window.location.href = "doctor-dashboard.html?tab=" + encodeURIComponent(tab.dataset.tab);
            });
        });
    }

    function initializeInpatient() {
        const session = window.HHAuth && HHAuth.requireRole ? HHAuth.requireRole("doctor") : null;
        if (window.HHAuth && !session) return;

        document.body.classList.remove("auth-pending");
        if (session && typeof fillUser === "function") fillUser(session);
        if (typeof startClock === "function") startClock();
        setupNavigation();
        loadPatients();
        populateFilters();
        setupEvents();
        refresh();
        if (typeof setupProfileMenu === "function") setupProfileMenu();
        if (typeof setupModals === "function") setupModals();
        if (!repo.isPersistent()) showNotice("Browser storage is unavailable. Notes and status changes will not be kept after closing this page.", true);
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!document.getElementById("dcTabs")) {
            document.addEventListener("doctorNavbarReady", initializeInpatient, { once: true });
            return;
        }
        initializeInpatient();
    });
})();
