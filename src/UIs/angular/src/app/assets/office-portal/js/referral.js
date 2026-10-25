const PATIENTS_KEY = 'savedPatients_v5';
const CONSULTATIONS_KEY = 'physicianConsultations';
const REFERRALS_KEY = 'physicianReferrals';

const TEXT_FIELDS = [
    'referralDate',
    'patientId', 'patientName', 'patientDob', 'patientGender', 'patientPhone',
    'referringName', 'referringSpecialty',
    'receivingName', 'receivingSpecialty', 'receivingFacility', 'receivingContact',
    'referralReason', 'clinicalSummary', 'diagnosis', 'requestedAction'
];

const PREFILLED_PATIENT_FIELDS = ['patientId', 'patientName', 'patientDob', 'patientGender', 'patientPhone'];

const REQUIRED_MESSAGES = {
    referralDate: 'Enter the referral date.',
    patientId: 'Enter the patient ID.',
    patientName: 'Enter the patient\'s full name.',
    patientDob: 'Enter the patient\'s date of birth.',
    patientGender: 'Select the patient\'s gender.',
    patientPhone: 'Enter the patient\'s contact number.',
    referringName: 'Enter the referring physician\'s name.',
    referringSpecialty: 'Enter the referring physician\'s specialty.',
    receivingName: 'Enter the receiving doctor\'s name.',
    receivingSpecialty: 'Enter the receiving doctor\'s specialty.',
    receivingFacility: 'Enter the receiving hospital or clinic.',
    receivingContact: 'Enter the receiving doctor\'s phone number or email.',
    referralReason: 'Enter the reason for referral.',
    clinicalSummary: 'Enter the relevant clinical summary.',
    diagnosis: 'Enter the diagnosis or working diagnosis.',
    requestedAction: 'Enter the specific questions or requested action.'
};

const PRIORITIES = ['Routine', 'Urgent', 'Emergency'];

let context = {
    consultationId: '',
    consultation: null,
    referralId: '',
    existing: null
};

let lastFocusBeforeModal = null;

function el(id) {
    return document.getElementById(id);
}

function getValue(id) {
    return el(id)?.value?.trim() || '';
}

function setValue(id, value) {
    const node = el(id);

    if (node) {
        node.value = value ?? '';
    }
}

function readJson(key, fallback) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key));

        return parsed ?? fallback;
    } catch (e) {
        return fallback;
    }
}

function readList(key) {
    const value = readJson(key, []);

    return Array.isArray(value) ? value : [];
}

function today() {
    return new Date().toISOString().split('T')[0];
}

function normalizeDigits(value) {
    return String(value || '').replace(/\D/g, '');
}

function formatDate(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';

    const [year, month, day] = value.split('-');

    return `${day}-${month}-${year}`;
}

function newReferralId(existing) {
    const day = today().replace(/-/g, '');
    let id;

    do {
        id = `REF-${day}-${Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0')}`;
    } while (existing.some(item => item.id === id));

    return id;
}

function loadContext() {
    const params = new URLSearchParams(window.location.search);

    context.consultationId = params.get('consultationId') || '';
    context.referralId = params.get('referralId') || '';

    const consultations = readList(CONSULTATIONS_KEY);

    context.consultation = context.consultationId
        ? consultations.find(item => item?.id === context.consultationId) || null
        : null;

    const referrals = readList(REFERRALS_KEY);

    context.existing = context.referralId
        ? referrals.find(item => item?.id === context.referralId) || null
        : null;

    if (context.existing && !context.consultation && context.existing.consultationId) {
        context.consultationId = context.existing.consultationId;
        context.consultation = consultations.find(item => item?.id === context.consultationId) || null;
    }

    return {
        patientId: params.get('patientId') || context.consultation?.patientId || '',
        referrals
    };
}

function findPatient(patientId) {
    if (!patientId) return null;

    const stored = readList(PATIENTS_KEY).find(item => item?.id === patientId);

    if (stored) return stored;

    const snapshot = context.consultation?.patient;

    return snapshot && snapshot.id === patientId ? snapshot : null;
}

function fillPatient(patient) {
    if (!patient) return false;

    const name = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();

    if (!patient.id || !name) return false;

    setValue('patientId', patient.id);
    setValue('patientName', name);
    setValue('patientDob', patient.dob || '');
    setValue('patientGender', patient.gender || '');
    setValue('patientPhone', normalizeDigits(patient.phone).slice(-10));

    PREFILLED_PATIENT_FIELDS.forEach(id => {
        const node = el(id);

        if (node && getValue(id)) {
            if (node.tagName === 'SELECT') {
                node.disabled = true;
            } else {
                node.readOnly = true;
            }
        }
    });

    const note = el('patientSourceNote');

    if (note) {
        note.textContent = 'Filled from the patient record. Fields left empty can be entered manually.';
        note.hidden = false;
    }

    return true;
}

function fillPhysician() {
    const fields = context.consultation?.fields;

    if (!fields) return;

    setValue('referringName', fields.preferredPhysician || '');
    setValue('referringSpecialty', fields.medicalSpecialty || '');
}

function fillPriority() {
    const urgency = context.consultation?.urgency;

    if (PRIORITIES.includes(urgency)) {
        selectPriority(urgency);
    }
}

function selectPriority(value) {
    document.querySelectorAll('input[name="referralPriority"]').forEach(radio => {
        radio.checked = radio.value === value;
    });
}

function selectedPriority() {
    return document.querySelector('input[name="referralPriority"]:checked')?.value || '';
}

function renderConsultationDocuments(selected) {
    const block = el('consultationDocsBlock');
    const list = el('consultationDocList');
    const documents = context.consultation?.documents;

    if (!block || !list || !documents) return;

    const names = [...new Set(
        ['labReports', 'medicalReports']
            .flatMap(key => Array.isArray(documents[key]) ? documents[key] : [])
            .filter(Boolean)
    )];

    if (!names.length) return;

    names.forEach(name => {
        const label = document.createElement('label');
        const input = document.createElement('input');

        label.className = 'check-card';

        input.type = 'checkbox';
        input.name = 'consultationDocument';
        input.value = name;
        input.checked = selected.includes(name);

        label.append(input, document.createTextNode(name));
        list.appendChild(label);
    });

    block.hidden = false;
}

function renderSelectedFiles() {
    const list = el('selectedDocList');
    const files = [...(el('referralDocuments')?.files || [])];

    if (!list) return;

    list.replaceChildren(...files.map(file => {
        const item = document.createElement('li');

        item.textContent = file.name;

        return item;
    }));
}

function checkedConsultationDocuments() {
    return [...document.querySelectorAll('input[name="consultationDocument"]:checked')].map(input => input.value);
}

function selectedFileNames() {
    return [...(el('referralDocuments')?.files || [])].map(file => file.name);
}

function applyExisting(record) {
    TEXT_FIELDS.forEach(id => setValue(id, record.fields?.[id] ?? ''));

    selectPriority(record.priority || '');
    setValue('referralReference', record.id);

    const patient = findPatient(record.fields?.patientId);

    if (patient) {
        fillPatient(patient);
        TEXT_FIELDS.forEach(id => {
            if (PREFILLED_PATIENT_FIELDS.includes(id) && record.fields?.[id]) {
                setValue(id, record.fields[id]);
            }
        });
    }
}

function isValidContact(value) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;

    const digits = normalizeDigits(value);

    return /^\+?[\d\s\-()]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
}

function collectErrors() {
    const errors = [];
    const add = (id, message) => errors.push({ id, message });
    const now = today();

    TEXT_FIELDS.forEach(id => {
        if (!getValue(id)) {
            add(id, REQUIRED_MESSAGES[id]);
        }
    });

    const has = id => errors.some(error => error.id === id);

    if (!has('referralDate') && getValue('referralDate') > now) {
        add('referralDate', 'Referral date cannot be in the future.');
    }

    if (!has('patientDob') && getValue('patientDob') > now) {
        add('patientDob', 'Date of birth cannot be in the future.');
    }

    if (!has('patientPhone') && normalizeDigits(getValue('patientPhone')).length !== 10) {
        add('patientPhone', 'Enter a valid 10-digit contact number.');
    }

    if (!has('receivingContact') && !isValidContact(getValue('receivingContact'))) {
        add('receivingContact', 'Enter a valid phone number (at least 10 digits) or email address.');
    }

    if (!selectedPriority()) {
        errors.push({ id: 'priorityGroup', message: 'Select a referral priority.' });
    }

    const order = ['referralDate', 'priorityGroup', ...TEXT_FIELDS];

    return errors.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

function errorElementId(id) {
    return id === 'priorityGroup' ? 'priorityError' : `${id}Error`;
}

function clearError(id) {
    const node = el(id);
    const message = el(errorElementId(id));

    if (message) {
        message.textContent = '';
        message.hidden = true;
    }

    if (id === 'priorityGroup') {
        node?.classList.remove('is-invalid');
    } else {
        node?.removeAttribute('aria-invalid');
    }
}

function clearAllErrors() {
    [...TEXT_FIELDS, 'priorityGroup'].forEach(clearError);

    const summary = el('formErrorSummary');

    if (summary) {
        summary.hidden = true;
        summary.replaceChildren();
    }
}

function showErrors(errors) {
    clearAllErrors();

    errors.forEach(({ id, message }) => {
        const node = el(id);
        const output = el(errorElementId(id));

        if (output) {
            output.textContent = message;
            output.hidden = false;
        }

        if (id === 'priorityGroup') {
            node?.classList.add('is-invalid');
        } else {
            node?.setAttribute('aria-invalid', 'true');
        }
    });

    showSummary(
        errors.length === 1
            ? 'Please correct 1 problem before submitting.'
            : `Please correct ${errors.length} problems before submitting.`,
        errors
    );

    const first = errors[0];

    if (first) {
        const target = first.id === 'priorityGroup'
            ? document.querySelector('input[name="referralPriority"]')
            : el(first.id);

        el('formErrorSummary')?.focus();

        if (target && typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ block: 'center' });
        }
    }
}

function showSummary(title, errors) {
    const summary = el('formErrorSummary');

    if (!summary) return;

    const heading = document.createElement('strong');

    heading.textContent = title;

    const nodes = [heading];

    if (errors.length) {
        const list = document.createElement('ul');

        errors.forEach(({ id, message }) => {
            const item = document.createElement('li');
            const link = document.createElement('a');

            link.href = `#${id}`;
            link.textContent = message;

            link.addEventListener('click', event => {
                event.preventDefault();

                const target = id === 'priorityGroup'
                    ? document.querySelector('input[name="referralPriority"]')
                    : el(id);

                target?.focus();
            });

            item.appendChild(link);
            list.appendChild(item);
        });

        nodes.push(list);
    }

    summary.replaceChildren(...nodes);
    summary.hidden = false;
}

function buildRecord() {
    const fields = {};

    TEXT_FIELDS.forEach(id => {
        fields[id] = getValue(id);
    });

    fields.patientPhone = normalizeDigits(fields.patientPhone);

    const attached = [...new Set([...checkedConsultationDocuments(), ...selectedFileNames()])];

    return {
        id: getValue('referralReference'),
        consultationId: context.consultationId || '',
        priority: selectedPriority(),
        fields,
        documents: attached,
        status: 'SAVED_LOCALLY',
        sent: false,
        savedAt: new Date().toISOString()
    };
}

function openSuccessModal(record) {
    const modal = el('referralSuccessModal');

    if (!modal) return;

    el('successReference').textContent = record.id;
    el('successPatient').textContent = record.fields.patientName;
    el('successReceiving').textContent =
        `${record.fields.receivingName}, ${record.fields.receivingFacility}`;
    el('successPriority').textContent = record.priority;
    el('successStatus').textContent = 'Saved locally — not sent';

    lastFocusBeforeModal = document.activeElement;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    el('leaveReferralBtn')?.focus();
}

function closeSuccessModal() {
    const modal = el('referralSuccessModal');

    if (!modal || !modal.classList.contains('open')) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    if (lastFocusBeforeModal && document.contains(lastFocusBeforeModal)) {
        lastFocusBeforeModal.focus();
    }

    lastFocusBeforeModal = null;
}

function leavePage() {
    let cameFromConsultation = false;

    try {
        const referrer = new URL(document.referrer);

        cameFromConsultation =
            referrer.origin === window.location.origin &&
            /consultation/i.test(referrer.pathname) &&
            window.history.length > 1;
    } catch (e) {
        cameFromConsultation = false;
    }

    if (cameFromConsultation) {
        window.history.back();
    } else {
        window.location.href = 'dashboard.html';
    }
}

function submitReferral(event) {
    event.preventDefault();

    const errors = collectErrors();

    if (errors.length) {
        showErrors(errors);

        return;
    }

    clearAllErrors();

    const record = buildRecord();

    try {
        const saved = readList(REFERRALS_KEY);

        localStorage.setItem(
            REFERRALS_KEY,
            JSON.stringify([...saved.filter(item => item?.id !== record.id), record])
        );
    } catch (e) {
        showSummary('Unable to save the referral on this device. Please try again.', []);
        el('formErrorSummary')?.focus();

        return;
    }

    openSuccessModal(record);
}

function bindEvents() {
    el('referralForm')?.addEventListener('submit', submitReferral);

    el('referralForm')?.addEventListener('input', event => {
        const id = event.target?.id;

        if (id && TEXT_FIELDS.includes(id)) {
            clearError(id);
        }

        if (event.target?.name === 'referralPriority') {
            clearError('priorityGroup');
        }
    });

    el('referralForm')?.addEventListener('change', event => {
        const id = event.target?.id;

        if (id && TEXT_FIELDS.includes(id)) {
            clearError(id);
        }

        if (event.target?.name === 'referralPriority') {
            clearError('priorityGroup');
        }
    });

    el('referralDocuments')?.addEventListener('change', renderSelectedFiles);

    el('cancelBtn')?.addEventListener('click', leavePage);
    el('closeReferralModal')?.addEventListener('click', closeSuccessModal);
    el('leaveReferralBtn')?.addEventListener('click', leavePage);

    document.addEventListener('keydown', event => {
        const modal = el('referralSuccessModal');

        if (!modal || !modal.classList.contains('open')) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closeSuccessModal();
        }

        if (event.key === 'Tab') {
            const buttons = [el('closeReferralModal'), el('leaveReferralBtn')].filter(Boolean);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const { patientId, referrals } = loadContext();

    const maxDate = today();

    ['referralDate', 'patientDob'].forEach(id => {
        const node = el(id);

        if (node) {
            node.max = maxDate;
        }
    });

    if (context.existing) {
        applyExisting(context.existing);
        renderConsultationDocuments(context.existing.documents || []);
    } else {
        setValue('referralReference', newReferralId(referrals));
        setValue('referralDate', maxDate);

        fillPatient(findPatient(patientId));
        fillPhysician();
        fillPriority();
        renderConsultationDocuments([]);
    }

    bindEvents();
});
