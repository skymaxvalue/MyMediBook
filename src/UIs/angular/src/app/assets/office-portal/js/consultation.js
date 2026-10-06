/* Physician Consultation stepper — keeps the existing Office Portal patient dataset pattern. */

const PATIENTS_KEY = 'savedPatients_v5';

let allPatients = [];
let selectedPatient = null;
let currentStep = 1;

/* Patient / account state (same model as the original booking page). */
let currentPatientType = 'existing';
let selectedAccountHolder = null;
let isExistingAccount = false;
let persistedNewPatientId = null;

/* Responsible Party state machine + OTP */
const RP_OTP_LENGTH = 4;
let currentRpOtpChannel = 'phone';
let currentResponsiblePartyState = 'hidden';
let lastFoundAccount = null;
let pendingResponsiblePartyOtp = null;
let rpOtpCountdownInterval = null;


/* =========================================================
   PATIENT DATA
========================================================= */

function seedPatients() {
    return [
        {
            id: 'p1',
            relation: 'Self',
            accountId: 'ACC100240',
            accountHolderName: 'Rajesh Sharma',
            accountHolderMobile: '9998887770',
            accountHolderEmail: 'rajesh@email.com',
            firstName: 'Rajesh',
            lastName: 'Sharma',
            dob: '1990-05-12',
            gender: 'Male',
            phone: '9998887770',
            email: 'rajesh@email.com',
            address: '204 MG Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pinCode: '560001',
            savedInsurance: {
                provider: 'Star Health',
                policy: 'SH-778215'
            }
        },
        {
            id: 'p2',
            relation: 'Sibling',
            accountId: 'ACC100246',
            accountHolderName: 'Aditi Bhardwaj',
            accountHolderMobile: '9123456780',
            accountHolderEmail: 'aditi@email.com',
            firstName: 'Harshit',
            lastName: 'Bhardwaj',
            dob: '1997-02-10',
            gender: 'Male',
            phone: '9123456780',
            email: 'harshit@email.com',
            address: 'MG Road',
            city: 'Delhi',
            state: 'Delhi',
            pinCode: '110001'
        },
        {
            id: 'p3',
            relation: 'Sibling',
            accountId: 'ACC100246',
            accountHolderName: 'Aditi Bhardwaj',
            accountHolderMobile: '9123456780',
            accountHolderEmail: 'aditi@email.com',
            firstName: 'K',
            lastName: 'Bhardwaj',
            dob: '2000-07-21',
            gender: 'Female',
            phone: '9123456780',
            email: 'k@email.com',
            address: 'MG Road',
            city: 'Delhi',
            state: 'Delhi',
            pinCode: '110001'
        },
        {
            id: 'p4',
            relation: 'Daughter',
            accountId: 'ACC100245',
            accountHolderName: 'Priya Sharma',
            accountHolderMobile: '9876543210',
            accountHolderEmail: 'priya@email.com',
            firstName: 'Meera',
            lastName: 'Sharma',
            dob: '2016-11-04',
            gender: 'Female',
            phone: '9876543210',
            email: 'priya@email.com',
            address: 'Park Street',
            city: 'Kolkata',
            state: 'West Bengal',
            pinCode: '700016'
        },
        {
            id: 'p5',
            relation: 'Son',
            accountId: 'ACC100245',
            accountHolderName: 'Priya Sharma',
            accountHolderMobile: '9876543210',
            accountHolderEmail: 'priya@email.com',
            firstName: 'Kabir',
            lastName: 'Sharma',
            dob: '2012-01-19',
            gender: 'Male',
            phone: '9876543210',
            email: 'priya@email.com',
            address: 'Park Street',
            city: 'Kolkata',
            state: 'West Bengal',
            pinCode: '700016'
        },
        {
            id: 'p6',
            relation: 'Self',
            accountId: 'ACC100245',
            accountHolderName: 'Priya Sharma',
            accountHolderMobile: '9876543210',
            accountHolderEmail: 'priya@email.com',
            firstName: 'Priya',
            lastName: 'Sharma',
            dob: '1985-03-22',
            gender: 'Female',
            phone: '9876543210',
            email: 'priya@email.com',
            address: 'Park Street',
            city: 'Kolkata',
            state: 'West Bengal',
            pinCode: '700016'
        }
    ];
}


function loadPatients() {
    try {
        const raw = localStorage.getItem(PATIENTS_KEY);

        if (raw) {
            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                return migratePatients(parsed);
            }
        }
    } catch (e) {
        console.warn('Unable to load saved patients:', e);
    }

    const seeded = seedPatients();

    localStorage.setItem(
        PATIENTS_KEY,
        JSON.stringify(seeded)
    );

    return seeded;
}


function savePatients(list) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(list));
}


/*
 * savedPatients_v5 is shared with the original booking page, so records may
 * be missing either the account fields (seeded by this page earlier) or the
 * contact fields (saved by the original page). Backfill without overwriting.
 */
function migratePatients(list) {
    const seeds = Object.fromEntries(seedPatients().map(item => [item.id, item]));
    let changed = false;

    list.forEach(patient => {
        const seed = seeds[patient.id];

        if (seed) {
            ['phone', 'email', 'address', 'city', 'state', 'pinCode'].forEach(key => {
                if (patient[key] === undefined) {
                    patient[key] = seed[key] ?? '';
                    changed = true;
                }
            });
        }

        if (!patient.accountId) {
            if (seed) {
                ['relation', 'accountId', 'accountHolderName', 'accountHolderMobile', 'accountHolderEmail']
                    .forEach(key => { patient[key] = seed[key]; });
            } else {
                patient.relation = patient.relation || 'Self';
                patient.accountId = `ACC-${patient.id}`;
                patient.accountHolderName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
                patient.accountHolderMobile = patient.phone || null;
                patient.accountHolderEmail = patient.email || null;
            }

            changed = true;
        }
    });

    if (changed) {
        try {
            savePatients(list);
        } catch (e) {
            console.warn('Unable to update saved patients:', e);
        }
    }

    return list;
}


function normalizeMobile(value) {
    return String(value || '')
        .replace(/\D/g, '')
        .slice(-10);
}


function formatDob(value) {
    if (!value) return '—';

    const [year, month, day] = value.split('-');

    return `${day}-${month}-${year}`;
}


/* =========================================================
   DOM HELPERS
========================================================= */

function el(id) {
    return document.getElementById(id);
}


function setValue(id, value) {
    const node = el(id);

    if (node) {
        node.value = value ?? '';
    }
}


function getValue(id) {
    return el(id)?.value?.trim() || '';
}


function setModal(id, open) {
    const node = el(id);

    if (!node) return;

    node.classList.toggle('open', open);

    node.setAttribute(
        'aria-hidden',
        String(!open)
    );
}


/* =========================================================
   CONSULTATION STATE
   One central object feeds every step, Review, Draft and Confirm.
========================================================= */

const DRAFT_KEY = 'physicianConsultationDraft';
const LATEST_KEY = 'latestPhysicianConsultation';
const CONSULTATIONS_KEY = 'physicianConsultations';

const MED_ROUTES = ['Oral', 'Topical', 'Inhaled', 'Injection', 'Sublingual', 'Ophthalmic', 'Other'];
const MED_FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Other'];
const MED_STATUSES = ['Currently Taking', 'Not Taking', 'Recently Stopped'];

const TRIAGE_HTML = `
    <strong>Immediate clinical attention required</strong>
    <p>
        This consultation has been flagged for immediate clinical / triage attention.
        If this is a life-threatening emergency, call your local emergency number
        (112 in India) now. You can continue completing this form.
    </p>`;

const VITAL_LIMITS = [
    ['vitalHr', 'Heart rate', 20, 250],
    ['vitalTemp', 'Temperature (°C)', 30, 45],
    ['vitalRr', 'Respiratory rate', 4, 80],
    ['vitalSpo2', 'SpO2', 50, 100],
    ['vitalHeight', 'Height', 30, 250],
    ['vitalWeight', 'Weight', 1, 500]
];

const newMedication = () => ({
    name: '', dose: '', route: '', frequency: '', indication: '', status: '', notes: ''
});

const consultation = {
    id: null,
    status: 'DRAFT',
    patientId: '',
    patientType: 'existing',
    accountHolder: '',   // 'self' | 'other' (New Patient only)
    account: null,       // billing responsibility / account holder
    fields: {},          // every plain input / select / textarea, keyed by element id
    symptoms: [],
    familyHistory: [],
    painLevel: null,
    urgency: 'Routine',
    allergyStatus: '',
    noMedications: false,
    medications: [newMedication()],
    documents: {},
    consents: {}
};

const isRemote = mode => /video|tele/i.test(mode || '');

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function checkedValues(selector) {
    return [...document.querySelectorAll(`${selector}:checked`)].map(input => input.value);
}

function calcBmi(heightCm, weightKg) {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);

    return h >= 0.3 && h <= 2.5 && w > 0
        ? (w / (h * h)).toFixed(1)
        : '';
}

function patientAge(dob) {
    if (!dob) return null;

    const born = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - born.getFullYear();

    if (today < new Date(today.getFullYear(), born.getMonth(), born.getDate())) {
        age--;
    }

    return age;
}

/*
 * The patient this consultation is for: the picked record for an Existing
 * Patient, or one assembled from the Patient step fields for a New Patient.
 * The step has a single Full Name field, so it is split on the last space.
 */
function currentPatient() {
    if (currentPatientType !== 'new') {
        return selectedPatient;
    }

    const parts = getValue('firstName').split(/\s+/).filter(Boolean);
    const lastName = parts.length > 1 ? parts.pop() : '';

    return {
        id: persistedNewPatientId,
        firstName: parts.join(' '),
        lastName,
        dob: getValue('dateOfBirth'),
        gender: getValue('gender'),
        phone: getValue('phone'),
        email: getValue('email'),
        address: getValue('address'),
        city: getValue('city'),
        state: getValue('state'),
        pinCode: getValue('pinCode'),
        isNew: true
    };
}

/* Billing responsibility + account holder for the current patient. */
function currentAccount() {
    const patient = currentPatient();

    if (!patient) return null;

    const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();

    if (currentPatientType === 'new') {
        const choice = document.querySelector('input[name="accountHolder"]:checked')?.value || 'self';

        if (choice === 'other') {
            const linked = isExistingAccount && selectedAccountHolder;

            return {
                responsibility: 'other',
                linked: !!linked,
                accountId: linked ? selectedAccountHolder.accountId : '',
                holderName: linked ? selectedAccountHolder.accountHolderName : '',
                mobile: linked ? (selectedAccountHolder.phone || '') : '',
                email: linked ? (selectedAccountHolder.email || '') : '',
                relation: getValue('relationToPatient')
            };
        }

        return {
            responsibility: 'self',
            linked: false,
            accountId: '',
            holderName: fullName,
            mobile: normalizeMobile(patient.phone),
            email: patient.email || '',
            relation: 'Self'
        };
    }

    const relation = patient.relation || 'Self';

    return {
        responsibility: relation === 'Self' ? 'self' : 'other',
        linked: true,
        accountId: patient.accountId || '',
        holderName: patient.accountHolderName || fullName,
        mobile: patient.accountHolderMobile || '',
        email: patient.accountHolderEmail || '',
        relation
    };
}

/* Pregnancy status is only asked for female patients of reproductive age. */
function pregnancyApplies() {
    const patient = currentPatient();
    const age = patientAge(patient?.dob);

    return patient?.gender === 'Female' && age >= 12 && age <= 55;
}

function stateFields() {
    return [...el('bookingForm').querySelectorAll('input[id], select[id], textarea[id]')]
        .filter(node =>
            !['file', 'checkbox', 'radio'].includes(node.type) &&
            !/^(patient|selectedPatient|consent|responsibleParty|accountHolderName|relationToPatient)/.test(node.id) &&
            !node.closest('#medicationList')
        );
}

/* DOM -> state */
function syncState() {
    const c = consultation;
    const f = c.fields;

    stateFields().forEach(node => {
        f[node.id] = node.value.trim();
    });

    f.vitalBmi = calcBmi(f.vitalHeight, f.vitalWeight);
    setValue('vitalBmi', f.vitalBmi);

    c.patientId = currentPatient()?.id || '';
    c.patientType = currentPatientType;
    c.accountHolder = currentPatientType === 'new'
        ? (document.querySelector('input[name="accountHolder"]:checked')?.value || 'self')
        : '';
    c.account = currentAccount();
    c.symptoms = checkedValues('#symptomGrid input');
    c.familyHistory = checkedValues('input[name="familyHistory"]');
    c.allergyStatus = document.querySelector('input[name="allergyStatus"]:checked')?.value || '';
    c.noMedications = !!el('noMedications')?.checked;

    c.consents = Object.fromEntries(
        ['Accurate', 'Consultation', 'Privacy', 'Telemedicine']
            .map(name => [name.toLowerCase(), !!el(`consent${name}`)?.checked])
    );

    c.documents = Object.fromEntries(
        ['insuranceCard', 'labReports', 'medicalReports']
            .map(id => [id, [...(el(id)?.files || [])].map(file => file.name)])
    );
}

/* Synced, normalised copy used by Review, validation and Confirm. */
function snapshot() {
    syncState();

    const c = structuredClone(consultation);
    const f = c.fields;

    if (c.allergyStatus !== 'Allergies Present') {
        ['drugAllergies', 'foodAllergies', 'otherAllergies', 'allergyReaction']
            .forEach(key => { f[key] = ''; });
    }

    c.medications = c.noMedications ? [] : c.medications.filter(med => med.name);

    if (!pregnancyApplies()) {
        f.pregnancyStatus = '';
    }

    const patient = currentPatient();

    c.patient = patient ? { ...patient } : null;
    c.remote = isRemote(f.consultationMode);
    c.requiresTriage = c.urgency === 'Emergency' || f.redFlags === 'Yes';

    if (!c.remote) {
        c.consents.telemedicine = false;
    }

    return c;
}

function consentsComplete(c) {
    return c.consents.accurate &&
        c.consents.consultation &&
        c.consents.privacy &&
        (!c.remote || c.consents.telemedicine);
}

/* State -> conditional parts of the UI */
function refreshUi() {
    const c = snapshot();

    el('allergyDetails').hidden = c.allergyStatus !== 'Allergies Present';
    el('medicationBlock').hidden = c.noMedications;
    el('pregnancyField').hidden = !pregnancyApplies();
    el('telemedicineConsentRow').hidden = !c.remote;

    document.querySelectorAll('.triage-alert').forEach(node => {
        node.hidden = !c.requiresTriage;
    });

    const confirmButton = el('continueBtn');

    if (confirmButton) {
        confirmButton.disabled = false;
    }
}

/* state -> DOM (used when resuming a saved draft) */
function renderState() {
    const c = consultation;

    Object.entries(c.fields).forEach(([id, value]) => setValue(id, value));

    document.querySelectorAll('#symptomGrid input').forEach(input => {
        input.checked = c.symptoms.includes(input.value);
    });

    document.querySelectorAll('input[name="familyHistory"]').forEach(input => {
        input.checked = c.familyHistory.includes(input.value);
    });

    document.querySelectorAll('input[name="allergyStatus"]').forEach(input => {
        input.checked = input.value === c.allergyStatus;
    });

    el('noMedications').checked = c.noMedications;

    if (!c.medications?.length) {
        c.medications = [newMedication()];
    }

    renderMedications();

    [...el('painScale').children].forEach((button, i) => {
        button.classList.toggle('selected', i === c.painLevel);
    });

    document.querySelectorAll('#urgencyGrid .urgency-card').forEach(button => {
        button.classList.toggle('selected', button.dataset.value === c.urgency);
    });

    document.querySelectorAll('#specialtyGrid .choice-card').forEach(button => {
        button.classList.toggle('selected', button.dataset.value === c.fields.medicalSpecialty);
    });

    ['chiefComplaint', 'otherSymptoms'].forEach(id => {
        el(id)?.dispatchEvent(new Event('input'));
    });

    refreshUi();
}

function restoreDraft() {
    try {
        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY))?.consultation;

        /* Ignore drafts saved in the older format. */
        if (!draft?.fields) return;

        /* Select the patient first: it refreshes state from the (still empty) form. */
        const patient = allPatients.find(item => item.id === draft.patientId);

        if (patient) {
            setPatientFields(patient);
        }

        /* renderState() re-syncs `consultation` from the DOM, so keep the saved values. */
        const saved = {
            patientType: draft.patientType,
            accountHolder: draft.accountHolder,
            account: draft.account
        };

        Object.assign(consultation, draft, { id: null, status: 'DRAFT', consents: {} });

        renderState();
        restorePatientAccountState(saved);
    } catch (e) {
        console.warn('Unable to restore draft:', e);
    }
}


/* =========================================================
   MEDICATION RECONCILIATION
========================================================= */

function renderMedications() {
    const list = el('medicationList');

    if (!list) return;

    const meds = consultation.medications;

    list.innerHTML = meds.map((med, i) => {
        const label = (key, text, required) => `
            <label for="med${i}-${key}">${text}${required ? ' <span class="req">*</span>' : ''}</label>`;

        const input = (key, text, placeholder, required) => `
            <div class="field-pair">
                ${label(key, text, required)}
                <input type="text" id="med${i}-${key}" data-med="${key}"
                    value="${esc(med[key])}" placeholder="${placeholder}">
            </div>`;

        const select = (key, text, options, placeholder, required) => `
            <div class="field-pair">
                ${label(key, text, required)}
                <select id="med${i}-${key}" data-med="${key}">
                    <option value="">${placeholder}</option>
                    ${options.map(option =>
                        `<option${option === med[key] ? ' selected' : ''}>${option}</option>`
                    ).join('')}
                </select>
            </div>`;

        return `
            <div class="med-entry" data-index="${i}">
                <div class="med-entry-head">
                    <strong>Medication ${i + 1}</strong>
                    ${meds.length > 1
                        ? '<button type="button" class="btn-outline-danger" data-remove-med>Remove</button>'
                        : ''}
                </div>
                <div class="detail-grid two-col">
                    ${input('name', 'Medication Name', 'Enter medication name', true)}
                    ${input('dose', 'Dose', 'e.g. 500 mg')}
                    ${select('route', 'Route', MED_ROUTES, 'Select route')}
                    ${select('frequency', 'Frequency', MED_FREQUENCIES, 'Select frequency')}
                    ${input('indication', 'Reason / Indication', 'e.g. Hypertension')}
                    ${select('status', 'Taking Status', MED_STATUSES, 'Select status', true)}
                    <div class="field-pair full-width">
                        ${label('notes', 'Notes')}
                        <textarea id="med${i}-notes" data-med="notes"
                            placeholder="Additional medication notes...">${esc(med.notes)}</textarea>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function bindIntakeEvents() {
    const form = el('bookingForm');

    document.querySelectorAll('.triage-alert').forEach(node => {
        node.innerHTML = TRIAGE_HTML;
    });

    const onChange = event => {
        const medField = event.target.closest('[data-med]');

        /* Medication rows write straight into the central state. */
        if (medField) {
            const index = Number(medField.closest('.med-entry').dataset.index);

            consultation.medications[index][medField.dataset.med] = medField.value.trim();

            return;
        }

        refreshUi();
    };

    form.addEventListener('input', onChange);
    form.addEventListener('change', onChange);

    el('addMedicationBtn')?.addEventListener('click', () => {
        consultation.medications.push(newMedication());
        renderMedications();
    });

    el('medicationList')?.addEventListener('click', event => {
        const button = event.target.closest('[data-remove-med]');

        if (!button) return;

        const index = Number(button.closest('.med-entry').dataset.index);

        consultation.medications.splice(index, 1);
        renderMedications();
    });
}


/* =========================================================
   SELECTED PATIENT
========================================================= */

function setPatientFields(patient) {

    if (!patient) return;

    /* Picking a profile IS choosing an Existing Patient. */
    if (currentPatientType !== 'existing') {
        applyPatientType('existing');
    }

    setValue(
        'firstName',
        `${patient.firstName} ${patient.lastName}`.trim()
    );

    setValue(
        'phone',
        patient.phone || ''
    );

    setValue(
        'dateOfBirth',
        patient.dob || ''
    );

    setValue(
        'gender',
        patient.gender || ''
    );

    setValue(
        'email',
        patient.email || ''
    );

    setValue(
        'address',
        patient.address || ''
    );

    setValue(
        'city',
        patient.city || ''
    );

    setValue(
        'state',
        patient.state || ''
    );

    setValue(
        'pinCode',
        patient.pinCode || ''
    );


    if (patient.savedInsurance) {

        setValue(
            'provider',
            patient.savedInsurance.provider || ''
        );

        setValue(
            'policy',
            patient.savedInsurance.policy || ''
        );
    }


    const selectedPatientId = el('selectedPatientId');

    if (selectedPatientId) {
        selectedPatientId.value = patient.id;
    }


    const selectedPatientName = el('selectedPatientName');

    if (selectedPatientName) {
        selectedPatientName.textContent =
            `${patient.firstName} ${patient.lastName}`;
    }


    const selectedPatientPhone = el('selectedPatientPhone');

    if (selectedPatientPhone) {
        selectedPatientPhone.textContent =
            patient.phone || '—';
    }


    const selectedPatientBar = el('selectedPatientBar');

    if (selectedPatientBar) {
        selectedPatientBar.hidden = false;
    }


    selectedPatient = patient;

    refreshUi();
}


/* =========================================================
   PATIENT TYPE  (Existing Patient / New Patient)
========================================================= */

/* Personal fields are typed by hand only for a New Patient. */
function setPersonalFieldsLocked(locked) {
    ['firstName', 'phone', 'dateOfBirth', 'email'].forEach(id => {
        const node = el(id);

        if (node) {
            node.readOnly = locked;
        }
    });

    const gender = el('gender');

    if (gender) {
        gender.disabled = locked;
    }

    document.querySelectorAll('.new-only').forEach(node => {
        node.hidden = locked;
    });
}

function clearPatientDetailFields() {
    selectedPatient = null;
    persistedNewPatientId = null;

    [
        'firstName', 'phone', 'dateOfBirth', 'gender', 'email',
        'address', 'city', 'state', 'pinCode', 'provider', 'policy',
        'selectedPatientId', 'patientLastNameSearch', 'patientMobileSearch', 'patientDobSearch'
    ].forEach(id => setValue(id, ''));

    const name = el('selectedPatientName');
    const phone = el('selectedPatientPhone');
    const bar = el('selectedPatientBar');
    const results = el('patientSearchResults');

    if (name) name.textContent = '—';
    if (phone) phone.textContent = '—';
    if (bar) bar.hidden = true;
    if (results) results.innerHTML = '';
}

function applyPatientType(type, { clear = true } = {}) {
    currentPatientType = type === 'new' ? 'new' : 'existing';

    document.querySelectorAll('input[name="patientType"]').forEach(radio => {
        radio.checked = radio.value === currentPatientType;
    });

    if (clear) {
        clearPatientDetailFields();
    }

    const existingSection = el('existingPatientSection');

    if (existingSection) {
        existingSection.hidden = currentPatientType === 'new';
    }

    if (currentPatientType === 'new') {
        setModal('selectPatientModal', false);
    }

    setPersonalFieldsLocked(currentPatientType !== 'new');
    updateAccountHolderUI(currentPatientType);
    refreshUi();
}

/* New Patient checks for step 1 (Existing Patients only need a selection). */
function newPatientError(f) {
    if (!f.firstName) {
        return 'Please enter the patient\'s full name.';
    }

    if (!f.dateOfBirth) {
        return 'Please enter the patient\'s date of birth.';
    }

    if (new Date(f.dateOfBirth) > new Date()) {
        return 'Date of birth cannot be in the future.';
    }

    if (!f.gender) {
        return 'Please select the patient\'s gender.';
    }

    if (normalizeMobile(f.phone).length < 10) {
        return 'Please enter a valid 10-digit mobile number.';
    }

    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
        return 'Please enter a valid email address.';
    }

    const choice = document.querySelector('input[name="accountHolder"]:checked')?.value || 'self';

    if (choice === 'other') {
        if (!(isExistingAccount && selectedAccountHolder)) {
            return 'Please search and verify the responsible party, or select "The Patient".';
        }

        if (!getValue('relationToPatient')) {
            return 'Please select the responsible party\'s relationship to the patient.';
        }
    }

    return '';
}

/* Same record shape as the original booking page's new-patient save. */
function buildNewPatientRecord() {
    const patient = currentPatient();
    const account = currentAccount();
    const other = account.responsibility === 'other';
    const stamp = Date.now();
    const age = patientAge(patient.dob);

    const record = {
        id: `p${stamp}`,
        firstName: patient.firstName,
        lastName: patient.lastName,
        relation: other ? account.relation : 'Self',
        accountHolder: other ? 'other' : 'self',
        accountId: other ? account.accountId : `ACC${stamp}`,
        accountHolderName: account.holderName,
        accountHolderMobile: account.mobile || null,
        accountHolderEmail: account.email || null,
        dob: patient.dob,
        age: age === null ? '' : String(age),
        ageType: 'years',
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        pinCode: patient.pinCode
    };

    const provider = getValue('provider');
    const policy = getValue('policy');

    if (provider || policy) {
        record.savedInsurance = { provider, policy };
    }

    return record;
}

/* Re-applies a New Patient draft: type, billing choice and linked account. */
function restorePatientAccountState(c) {
    if (c?.patientType !== 'new') return;

    applyPatientType('new', { clear: false });

    const choice = c.accountHolder === 'other' ? 'other' : 'self';
    const radio = document.querySelector(`input[name="accountHolder"][value="${choice}"]`);

    if (radio) {
        radio.checked = true;
    }

    updateAccountHolderDetailsVisibility(choice);

    const account = c.account;

    if (choice === 'other' && account?.linked && account.accountId) {
        lastFoundAccount = getAccountHolder(account.accountId) || {
            accountId: account.accountId,
            accountHolderName: account.holderName,
            phone: account.mobile,
            email: account.email,
            linkedPatients: countLinkedPatients(account.accountId)
        };

        linkResponsiblePartyAccount();
        setValue('relationToPatient', account.relation || '');
    }

    refreshUi();
}

function initPatientType() {
    document.querySelectorAll('input[name="patientType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                applyPatientType(radio.value);
            }
        });
    });

    document.querySelectorAll('input[name="accountHolder"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateAccountHolderDetailsVisibility(radio.value);
        });
    });

    setupResponsiblePartySearch();

    const dob = el('dateOfBirth');

    if (dob) {
        dob.max = new Date().toISOString().split('T')[0];
    }

    applyPatientType('existing', { clear: false });
}


/* =========================================================
   RESPONSIBLE PARTY  (Account / Billing)

   Exactly one visual state is shown at a time, and every change of
   visibility goes through setResponsiblePartyState():

     hidden    Existing Patient — whole section hidden.
     self      New Patient, "The Patient" — question only.
     search    New Patient, "Another Person" — search card.
     found     Search matched — found card.
     otp       Continue clicked — verification modals are open.
     notFound  No match — warning card.
     linked    Verified — account holder name + relationship.
========================================================= */

function setResponsiblePartyState(state) {
    const section = el('responsiblePartySection');

    if (!section) return;

    const hidden = state === 'hidden';
    const holderName = el('accountHolderName');
    const relation = el('relationToPatient');

    currentResponsiblePartyState = state;

    section.hidden = hidden;

    [
        ['accountHolderQuestion', hidden],
        ['responsiblePartySearchCard', state !== 'search'],
        ['responsiblePartyFoundCard', state !== 'found'],
        ['responsiblePartyNotFoundCard', state !== 'notFound'],
        ['accountHolderFields', state !== 'linked']
    ].forEach(([id, hide]) => {
        const node = el(id);

        if (node) {
            node.hidden = hide;
        }
    });

    if (holderName) holderName.disabled = true;
    if (relation) relation.disabled = state !== 'linked';
}

/* The billing question only applies to New Patients. */
function updateAccountHolderUI(type) {
    const radios = document.querySelectorAll('input[name="accountHolder"]');

    if (type !== 'new') {
        radios.forEach(radio => {
            radio.checked = false;
            radio.disabled = true;
        });

        resetResponsiblePartySearch();
        setResponsiblePartyState('hidden');

        return;
    }

    radios.forEach(radio => {
        radio.disabled = false;
    });

    let chosen = document.querySelector('input[name="accountHolder"]:checked');

    if (!chosen) {
        chosen = document.querySelector('input[name="accountHolder"][value="self"]');

        if (chosen) {
            chosen.checked = true;
        }
    }

    updateAccountHolderDetailsVisibility(chosen ? chosen.value : 'self');
}

function updateAccountHolderDetailsVisibility(value) {
    resetResponsiblePartySearch();

    setResponsiblePartyState(value === 'other' ? 'search' : 'self');
}

/* Account data comes from the patient dataset — records sharing an accountId. */
function countLinkedPatients(accountId) {
    if (!accountId) return 1;

    const count = allPatients.filter(patient => patient.accountId === accountId).length;

    return count > 0 ? count : 1;
}

function getAccountHolder(accountId) {
    if (!accountId) return null;

    const patient = allPatients.find(item => item.accountId === accountId);

    if (!patient) return null;

    return {
        accountId: patient.accountId,
        accountHolderName: patient.accountHolderName,
        phone: patient.accountHolderMobile,
        email: patient.accountHolderEmail,
        linkedPatients: countLinkedPatients(patient.accountId)
    };
}

/* Mobile takes priority over Name + DOB when both are filled in. */
function searchResponsibleParty() {
    const mobileInput = el('responsiblePartyMobile');
    const errorText = el('responsiblePartySearchError');

    const mobileValue = getValue('responsiblePartyMobile');
    const nameValue = getValue('responsiblePartyName');
    const dobValue = el('responsiblePartyDob')?.value || '';

    if (!mobileValue && !nameValue && !dobValue) {
        if (errorText) errorText.hidden = false;
        if (mobileInput) mobileInput.focus();

        return;
    }

    if (errorText) errorText.hidden = true;

    let match = null;

    if (mobileValue) {
        const normalized = normalizeMobile(mobileValue);

        match = allPatients.find(patient =>
            patient.accountHolderMobile &&
            normalizeMobile(patient.accountHolderMobile) === normalized
        );
    } else {
        const query = nameValue.toLowerCase();

        match = allPatients.find(patient =>
            (!query || `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query)) &&
            (!dobValue || patient.dob === dobValue)
        );
    }

    if (match) {
        lastFoundAccount = getAccountHolder(match.accountId);
        renderFoundAccount(lastFoundAccount);
        setResponsiblePartyState('found');
    } else {
        lastFoundAccount = null;
        selectedAccountHolder = null;
        isExistingAccount = false;

        setResponsiblePartyState('notFound');
    }
}

function renderFoundAccount(account) {
    const content = el('responsiblePartyFoundContent');

    if (!content || !account) return;

    content.innerHTML =
        `<div class="saved-row"><strong>Account Holder Name</strong><span>${esc(account.accountHolderName)}</span></div>` +
        `<div class="saved-row"><strong>Account ID</strong><span>${esc(account.accountId)}</span></div>` +
        `<div class="saved-row"><strong>Mobile Number</strong><span>+91 ${esc(account.phone)}</span></div>` +
        `<div class="saved-row"><strong>Email</strong><span>${esc(account.email)}</span></div>` +
        `<div class="saved-row"><strong>Patients Linked</strong><span>${esc(account.linkedPatients)}</span></div>`;
}


/* ---- OTP: four single-digit boxes ---- */

function getSelectedRpOtpChannel() {
    return document.querySelector('input[name="rpOtpChannel"]:checked')?.value || 'phone';
}

function getRpOtpInputs() {
    return [...document.querySelectorAll('#responsiblePartyOtpGroup .rp-otp-input')];
}

function getRpOtpValue() {
    return getRpOtpInputs().map(input => input.value).join('');
}

function clearRpOtpInputs(focusFirst) {
    const inputs = getRpOtpInputs();

    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'rp-otp-error');
    });

    if (focusFirst && inputs[0]) {
        inputs[0].focus();
    }
}

function setRpOtpError(hasError) {
    getRpOtpInputs().forEach(input => input.classList.toggle('rp-otp-error', hasError));
}

/* Type-to-advance, backspace-to-go-back and paste-to-fill. Wired once. */
function setupRpOtpInputs() {
    const inputs = getRpOtpInputs();

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, '').slice(-1);
            input.classList.toggle('filled', input.value !== '');
            setRpOtpError(false);

            if (input.value !== '' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', event => {
            if (event.key === 'Backspace' && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                verifyResponsiblePartyOTP();
            }
        });

        input.addEventListener('paste', event => {
            const pasted = (event.clipboardData || window.clipboardData)
                .getData('text')
                .replace(/\D/g, '');

            if (!pasted) return;

            event.preventDefault();

            inputs.forEach((box, i) => {
                box.value = pasted[i] || '';
                box.classList.toggle('filled', box.value !== '');
            });

            setRpOtpError(false);

            const nextEmpty = inputs.findIndex(box => box.value === '');

            (nextEmpty === -1 ? inputs[inputs.length - 1] : inputs[nextEmpty]).focus();
        });
    });
}

function stopRpOtpCountdown() {
    if (rpOtpCountdownInterval) {
        clearInterval(rpOtpCountdownInterval);
        rpOtpCountdownInterval = null;
    }
}

function startRpOtpCountdown(seconds) {
    const timerEl = el('responsiblePartyOtpTimer');
    const timerWrap = el('responsiblePartyOtpTimerWrap');
    const resendBtn = el('resendResponsiblePartyOtpBtn');

    stopRpOtpCountdown();

    let time = seconds;

    if (resendBtn) resendBtn.disabled = true;
    if (timerWrap) timerWrap.classList.remove('expired');

    const render = () => {
        if (!timerEl) return;

        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const secs = String(time % 60).padStart(2, '0');

        timerEl.textContent = `${minutes}:${secs}`;
    };

    render();

    rpOtpCountdownInterval = setInterval(() => {
        time--;

        if (time <= 0) {
            stopRpOtpCountdown();

            if (timerEl) timerEl.textContent = 'Expired';
            if (timerWrap) timerWrap.classList.add('expired');
            if (resendBtn) resendBtn.disabled = false;

            return;
        }

        render();
    }, 1000);
}

/*
 * Demo only: there is no SMS / email gateway, so the code is generated
 * here and logged. Replace with a real send-OTP call in production —
 * verification only compares against pendingResponsiblePartyOtp.
 */
function generateResponsiblePartyOtp(channel) {
    if (!lastFoundAccount) return;

    const hint = el('responsiblePartyOtpHint');

    pendingResponsiblePartyOtp = String(Math.floor(1000 + Math.random() * 9000));
    startRpOtpCountdown(60);

    if (hint) {
        if (channel === 'email') {
            hint.textContent = lastFoundAccount.email
                ? `An OTP has been sent to ${lastFoundAccount.email}.`
                : 'An OTP has been sent to the registered email address.';
        } else {
            hint.textContent = lastFoundAccount.phone
                ? `An OTP has been sent to +91 ${lastFoundAccount.phone}.`
                : 'An OTP has been sent to the registered mobile number.';
        }
    }

    console.log('[demo] Responsible Party OTP:', pendingResponsiblePartyOtp);
}


/* ---- Found account -> channel modal -> OTP modal -> linked ---- */

function continueWithExistingAccount() {
    if (!lastFoundAccount) return;

    openResponsiblePartyChannelModal();
}

function openResponsiblePartyChannelModal() {
    if (!lastFoundAccount) return;

    document.querySelectorAll('input[name="rpOtpChannel"]').forEach(radio => {
        radio.checked = radio.value === 'phone';
    });

    setResponsiblePartyState('otp');
    setModal('responsiblePartyChannelModal', true);
}

/* Closing without continuing falls back to the Found card. */
function closeResponsiblePartyChannelModal() {
    setModal('responsiblePartyChannelModal', false);

    if (lastFoundAccount) {
        setResponsiblePartyState('found');
    }
}

function proceedFromChannelSelection() {
    if (!lastFoundAccount) return;

    const channel = getSelectedRpOtpChannel();

    setModal('responsiblePartyChannelModal', false);

    /* "None" needs no code — link straight away. */
    if (channel === 'none') {
        pendingResponsiblePartyOtp = null;
        linkResponsiblePartyAccount();

        return;
    }

    currentRpOtpChannel = channel;
    openResponsiblePartyOtpModal();
}

function openResponsiblePartyOtpModal() {
    if (!lastFoundAccount) return;

    const otpError = el('responsiblePartyOtpError');

    clearRpOtpInputs(false);

    if (otpError) otpError.hidden = true;

    generateResponsiblePartyOtp(currentRpOtpChannel);

    setResponsiblePartyState('otp');
    setModal('responsiblePartyOtpModal', true);

    const inputs = getRpOtpInputs();

    if (inputs[0]) inputs[0].focus();
}

function closeResponsiblePartyOtpModal() {
    setModal('responsiblePartyOtpModal', false);

    stopRpOtpCountdown();
    pendingResponsiblePartyOtp = null;

    if (lastFoundAccount) {
        setResponsiblePartyState('found');
    }
}

/* "Change" goes back to channel selection without losing the account. */
function changeResponsiblePartyOtpChannel() {
    setModal('responsiblePartyOtpModal', false);

    stopRpOtpCountdown();
    pendingResponsiblePartyOtp = null;

    openResponsiblePartyChannelModal();
}

function resendResponsiblePartyOtp() {
    if (!lastFoundAccount) return;

    const otpError = el('responsiblePartyOtpError');

    clearRpOtpInputs(false);

    if (otpError) otpError.hidden = true;

    generateResponsiblePartyOtp(currentRpOtpChannel);

    const inputs = getRpOtpInputs();

    if (inputs[0]) inputs[0].focus();
}

function verifyResponsiblePartyOTP() {
    if (!lastFoundAccount) return;

    const otpError = el('responsiblePartyOtpError');
    const entered = getRpOtpValue().trim();

    if (!entered || entered.length < RP_OTP_LENGTH || entered !== pendingResponsiblePartyOtp) {
        if (otpError) otpError.hidden = false;

        setRpOtpError(true);

        const group = el('responsiblePartyOtpGroup');

        if (group) {
            group.classList.remove('rp-otp-shake');
            void group.offsetWidth;
            group.classList.add('rp-otp-shake');
        }

        clearRpOtpInputs(true);

        return;
    }

    setModal('responsiblePartyOtpModal', false);

    linkResponsiblePartyAccount();
}

/* Links the new patient to the existing account — never a duplicate one. */
function linkResponsiblePartyAccount() {
    selectedAccountHolder = lastFoundAccount;
    isExistingAccount = true;
    pendingResponsiblePartyOtp = null;
    stopRpOtpCountdown();

    setValue('accountHolderName', lastFoundAccount.accountHolderName);
    setValue('relationToPatient', '');

    setResponsiblePartyState('linked');

    const badge = el('linkedAccountBadge');

    if (badge) {
        badge.hidden = false;
        badge.textContent =
            `✅ Responsible Party Linked — ${lastFoundAccount.accountHolderName} (${lastFoundAccount.accountId})`;
    }

    refreshUi();
}

/* Data reset only; callers choose what to show next. */
function resetResponsiblePartySearch() {
    ['responsiblePartyMobile', 'responsiblePartyName', 'responsiblePartyDob', 'accountHolderName', 'relationToPatient']
        .forEach(id => setValue(id, ''));

    const errorText = el('responsiblePartySearchError');
    const otpError = el('responsiblePartyOtpError');
    const badge = el('linkedAccountBadge');

    if (errorText) errorText.hidden = true;
    if (otpError) otpError.hidden = true;

    if (badge) {
        badge.hidden = true;
        badge.textContent = '';
    }

    setModal('responsiblePartyChannelModal', false);
    setModal('responsiblePartyOtpModal', false);

    stopRpOtpCountdown();
    clearRpOtpInputs(false);

    selectedAccountHolder = null;
    isExistingAccount = false;
    lastFoundAccount = null;
    pendingResponsiblePartyOtp = null;
    currentRpOtpChannel = 'phone';
}

function searchResponsiblePartyAgain() {
    resetResponsiblePartySearch();
    setResponsiblePartyState('search');
}

/* Wired once from initPatientType(). */
function setupResponsiblePartySearch() {
    const on = (id, handler) => {
        el(id)?.addEventListener('click', event => {
            event.preventDefault();
            handler();
        });
    };

    on('searchResponsiblePartyBtn', searchResponsibleParty);
    on('continueWithAccountBtn', continueWithExistingAccount);
    on('searchAgainFoundBtn', searchResponsiblePartyAgain);
    on('searchAgainNotFoundBtn', searchResponsiblePartyAgain);
    on('continueRpChannelBtn', proceedFromChannelSelection);
    on('changeRpOtpChannelBtn', changeResponsiblePartyOtpChannel);
    on('verifyResponsiblePartyOtpBtn', verifyResponsiblePartyOTP);
    on('resendResponsiblePartyOtpBtn', resendResponsiblePartyOtp);

    ['closeRpChannelModal', 'cancelRpChannelModal']
        .forEach(id => on(id, closeResponsiblePartyChannelModal));

    ['closeRpOtpModal', 'cancelRpOtpModal']
        .forEach(id => on(id, closeResponsiblePartyOtpModal));

    ['responsiblePartyMobile', 'responsiblePartyName', 'responsiblePartyDob'].forEach(id => {
        el(id)?.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchResponsibleParty();
            }
        });
    });

    setupRpOtpInputs();
}


/* =========================================================
   PATIENT SEARCH
========================================================= */

function renderSearchResults(list) {

    const box = el('patientSearchResults');

    if (!box) return;

    box.innerHTML = '';


    if (!list.length) {

        box.innerHTML =
            '<div class="patient-search-empty">No matching patients found.</div>';

        return;
    }


    list.slice(0, 6).forEach(patient => {

        const row = document.createElement('div');

        row.className =
            'patient-search-result';


        row.innerHTML = `
            <div class="patient-search-result-main">

                <img
                    src="images/profile-solid-blue.png"
                    alt=""
                >

                <div>
                    <small>Patient</small>

                    <strong>
                        ${patient.firstName}
                        ${patient.lastName}
                    </strong>
                </div>

            </div>

            <div>

                <small>
                    DOB ${formatDob(patient.dob)}
                </small>

                <strong>
                    ${patient.phone || ''}
                </strong>

            </div>
        `;


        row.addEventListener(
            'click',
            () => {

                setPatientFields(patient);

                box.innerHTML = '';
            }
        );


        box.appendChild(row);
    });
}


function searchPatients(lastName, mobile, dob) {

    const lastNameQuery =
        lastName.toLowerCase();

    const mobileQuery =
        normalizeMobile(mobile);

    let list = [];


    /* Mobile search */

    if (mobileQuery) {

        list = allPatients.filter(
            patient =>
                normalizeMobile(patient.phone) ===
                mobileQuery
        );

    }

    /* Last name + DOB search */

    else if (lastNameQuery || dob) {

        list = allPatients.filter(
            patient =>
                patient.lastName
                    .toLowerCase()
                    .includes(lastNameQuery)
                &&
                (!dob || patient.dob === dob)
        );
    }


    renderSearchResults(list);
}


/* =========================================================
   PATIENT PROFILE MODAL
========================================================= */

function openPatientModal() {

    const searchInput =
        el('patientSearchInput');

    const dobInput =
        el('patientDobFilter');

    const patientList =
        el('patientList');

    const confirmButton =
        el('selectPatientConfirmBtn');


    if (searchInput) {
        searchInput.value = '';
    }

    if (dobInput) {
        dobInput.value = '';
    }

    if (patientList) {
        patientList.innerHTML = '';
    }

    if (confirmButton) {
        confirmButton.disabled = true;
    }


    setModal(
        'selectPatientModal',
        true
    );


    renderModalPatients(allPatients);


    if (searchInput) {
        searchInput.focus();
    }
}


let modalSelected = null;


function renderModalPatients(list) {

    const box = el('patientList');

    const confirmButton =
        el('selectPatientConfirmBtn');


    if (!box) return;


    box.innerHTML = '';

    modalSelected = null;


    if (confirmButton) {
        confirmButton.disabled = true;
    }


    if (!list.length) {

        box.innerHTML =
            '<div class="patient-search-empty">No matching patients found.</div>';

        return;
    }


    list.slice(0, 30).forEach(patient => {

        const row =
            document.createElement('div');

        row.className =
            'patient-item';


        row.innerHTML = `
            <img
                src="images/profile-solid-blue.png"
                alt=""
            >

            <div>

                <small>
                    Patient · DOB ${formatDob(patient.dob)}
                </small>

                <strong>
                    ${patient.firstName}
                    ${patient.lastName}
                </strong>

            </div>
        `;


        row.addEventListener(
            'click',
            () => {

                modalSelected = patient;


                box
                    .querySelectorAll('.patient-item')
                    .forEach(item =>
                        item.classList.remove('selected')
                    );


                row.classList.add('selected');


                if (confirmButton) {
                    confirmButton.disabled = false;
                }
            }
        );


        box.appendChild(row);
    });
}


function applyModalSearch() {

    const query =
        el('patientSearchInput')
            ?.value
            .trim()
            .toLowerCase() || '';

    const dob =
        el('patientDobFilter')
            ?.value || '';


    const filtered =
        allPatients.filter(patient => {

            const fullName =
                `${patient.firstName} ${patient.lastName}`
                    .toLowerCase();


            const nameMatch =
                !query ||
                fullName.includes(query) ||
                patient.lastName
                    .toLowerCase()
                    .includes(query);


            const dobMatch =
                !dob ||
                patient.dob === dob;


            return nameMatch && dobMatch;
        });


    renderModalPatients(filtered);
}


/* =========================================================
   STEPPER
========================================================= */

function setStep(step, force = false) {

    /* Navigation is free: validation runs only on Confirm Consultation. */

    currentStep =
        Math.max(
            1,
            Math.min(5, step)
        );


    /* Panels */

    document
        .querySelectorAll(
            '.consultation-step-panel'
        )
        .forEach(panel => {

            panel.classList.toggle(
                'active',
                Number(panel.dataset.step) ===
                currentStep
            );
        });


    /* Step navigation */

    document
        .querySelectorAll('.step-item')
        .forEach(item => {

            const number =
                Number(
                    item.dataset.stepTarget
                );


            item.classList.toggle(
                'active',
                number === currentStep
            );


            item.classList.toggle(
                'completed',
                number < currentStep
            );
        });


    /* Footer */

    const stepCounter =
        el('stepCounter');

    if (stepCounter) {

        stepCounter.textContent =
            `Step ${currentStep} of 5`;
    }


    const backButton =
        el('backBtn');

    if (backButton) {
        backButton.hidden =
            currentStep === 1;
    }


    const continueButton =
        el('continueBtn');


    if (continueButton) {

        continueButton.innerHTML =
            currentStep === 5
                ? `
                    Confirm Consultation
                    <img
                        src="images/check-white.png"
                        alt=""
                    >
                  `
                : `
                    Continue
                    <img
                        src="images/arrow-right.png"
                        alt=""
                    >
                  `;
    }


    if (currentStep === 5) {
        updateReview();
    }

    refreshUi();


    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/* =========================================================
   STEP VALIDATION
========================================================= */

/* Returns an error message for a step, or '' when the step is valid. */
function stepError(step) {
    const c = snapshot();
    const f = c.fields;

    /* STEP 1 — PATIENT */
    if (step === 1) {
        if (currentPatientType === 'new') {
            const newError = newPatientError(f);

            if (newError) {
                return newError;
            }
        } else if (!selectedPatient) {
            return 'Please select a patient profile before continuing.';
        }

        if (!f.emergencyName || !f.emergencyRelation || !f.emergencyPhone) {
            return 'Please complete the emergency contact details.';
        }

        if (!f.contactMethod || !f.appointmentReminder) {
            return 'Please select a preferred contact method and appointment reminder preference.';
        }
    }

    /* STEP 2 — APPOINTMENT */
    if (step === 2) {
        const required = ['preferredDate', 'preferredTime', 'consultationMode', 'visitType', 'reasonForVisit'];

        if (required.some(id => !f[id])) {
            return 'Please complete the required appointment details.';
        }
    }

    /* STEP 3 — SYMPTOMS */
    if (step === 3) {
        if (!f.chiefComplaint) {
            return 'Please enter the chief complaint.';
        }

        if (!f.symptomDuration) {
            return 'Please select the duration of symptoms.';
        }
    }

    /* STEP 4 — HISTORY */
    if (step === 4) {
        if (!c.allergyStatus) {
            return 'Please select an allergy status.';
        }

        if (c.allergyStatus === 'Allergies Present' &&
            !f.drugAllergies && !f.foodAllergies && !f.otherAllergies) {
            return 'Please list the drug, food or other allergies.';
        }

        if (!c.noMedications) {
            const entered = consultation.medications.filter(med => Object.values(med).some(Boolean));

            if (entered.some(med => !med.name)) {
                return 'Please enter a name for each medication.';
            }

            if (!c.medications.length) {
                return 'Please add a current medication or select "No Current Medications".';
            }

            if (c.medications.some(med => !med.status)) {
                return 'Please select the taking status for each medication.';
            }
        }

        if (f.vitalBp && !/^\d{2,3}\s*\/\s*\d{2,3}$/.test(f.vitalBp)) {
            return 'Please enter blood pressure as systolic/diastolic, e.g. 120/80.';
        }

        const outOfRange = VITAL_LIMITS.find(([id, , min, max]) => {
            const value = parseFloat(f[id]);

            return f[id] && !(value >= min && value <= max);
        });

        if (outOfRange) {
            return `${outOfRange[1]} looks out of range. Please check the value.`;
        }
    }

    /* STEP 5 — CONSENT */
    if (step === 5 && !consentsComplete(c)) {
        return 'Please complete all required consent confirmations.';
    }

    return '';
}

/* =========================================================
   VALIDATION MODAL
   One reusable, accessible modal that replaces the browser-native popup.
   Usage: showValidationModal(message)
          showValidationModal(message, { title, variant })
   variant: 'info' (default) | 'success' | 'error'
========================================================= */

const VALIDATION_MODAL_ICONS = {
    info:
        '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12.5"/><circle cx="12" cy="16.2" r="0.6" fill="currentColor"/></svg>',
    success:
        '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="8 12.5 11 15.5 16 9"/></svg>',
    error:
        '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>'
};

let validationModalReturnFocus = null;

function ensureValidationModal() {
    let modal = document.getElementById('validationModal');

    if (modal) {
        return modal;
    }

    /* Fallback: build the same markup if it is missing from the HTML. */
    modal = document.createElement('div');
    modal.id = 'validationModal';
    modal.className = 'modal validation-modal-overlay';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-content validation-modal" role="dialog" aria-modal="true"
             aria-labelledby="validationModalTitle" aria-describedby="validationModalMessage">
            <div class="validation-modal-header">
                <span class="validation-modal-icon" id="validationModalIcon"></span>
                <h2 id="validationModalTitle">Please Review</h2>
            </div>
            <p class="validation-modal-message" id="validationModalMessage"></p>
            <div class="modal-actions">
                <button type="button" class="btn-primary" id="validationModalOkBtn">OK</button>
            </div>
        </div>`;
    document.body.appendChild(modal);

    return modal;
}

function isValidationModalOpen() {
    const modal = document.getElementById('validationModal');

    return !!modal && modal.classList.contains('open');
}

function closeValidationModal() {
    const modal = document.getElementById('validationModal');

    if (!modal || !modal.classList.contains('open')) {
        return;
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    /* Return focus so the user can keep editing where they were. */
    const target = validationModalReturnFocus;
    validationModalReturnFocus = null;

    if (target && document.contains(target) && typeof target.focus === 'function') {
        target.focus();
    }
}

function showValidationModal(message, options = {}) {
    const modal = ensureValidationModal();
    const variant = VALIDATION_MODAL_ICONS[options.variant] ? options.variant : 'info';
    const dialog = modal.querySelector('.validation-modal');
    const okBtn = el('validationModalOkBtn');

    /* Only ever one modal: a second call just updates the open one. */
    if (!modal.classList.contains('open')) {
        validationModalReturnFocus = document.activeElement;
    }

    el('validationModalTitle').textContent = options.title || 'Please Review';
    el('validationModalMessage').textContent = message;
    el('validationModalIcon').innerHTML = VALIDATION_MODAL_ICONS[variant];

    dialog.classList.remove('is-info', 'is-success', 'is-error');
    dialog.classList.add(`is-${variant}`);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    okBtn.focus();
}

function initValidationModal() {
    const modal = ensureValidationModal();

    el('validationModalOkBtn').addEventListener('click', closeValidationModal);

    /* Escape closes; Tab stays inside the dialog (capture so other
       modals don't react to the same key press). */
    document.addEventListener('keydown', event => {
        if (!isValidationModalOpen()) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            closeValidationModal();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            el('validationModalOkBtn').focus();
        }
    }, true);
}


function validateStep(step) {
    const message = stepError(step);

    if (message) {
        showValidationModal(message);
    }

    return !message;
}


/* =========================================================
   REVIEW SCREEN
========================================================= */

function fillReview(id, rows) {
    const list = el(id);

    if (!list) return;

    list.replaceChildren(...rows.flatMap(([label, value]) => {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');

        dt.textContent = label;
        dd.textContent = value || '—';

        if (String(value || '').includes('\n')) {
            dd.className = 'multiline';
        }

        return [dt, dd];
    }));
}

function updateReview() {
    const c = snapshot();
    const f = c.fields;
    const p = c.patient;

    const join = (list, separator = ' · ') => list.filter(Boolean).join(separator);
    const lines = list => list.filter(Boolean).join('\n');
    const unit = (value, suffix) => value ? `${value} ${suffix}` : '';
    const when = date => date ? formatDob(date) : '';

    const screening = lines([
        f.redFlags && `Red flags: ${f.redFlags}`,
        f.fallRisk && `Fall risk: ${f.fallRisk}`,
        f.mobilityAssist && `Mobility assistance: ${f.mobilityAssist}`,
        f.interpreterRequired && `Interpreter: ${f.interpreterRequired}`,
        f.pregnancyStatus && `Pregnancy: ${f.pregnancyStatus}`
    ]);

    const account = c.account;
    const accountRows = [];

    if (account) {
        accountRows.push(['Billing Responsibility', account.responsibility === 'other' ? 'Another Person' : 'The Patient']);

        /* Responsible Party details only apply when someone else manages the account. */
        if (account.responsibility === 'other') {
            accountRows.push(
                ['Responsible Party', account.holderName],
                ['Relationship', account.relation],
                ['Account ID', account.accountId],
                ['Account Contact', join([account.mobile && `+91 ${account.mobile}`, account.email])]
            );
        }
    }

    fillReview('reviewPatient', [
        ['Name', p ? `${p.firstName} ${p.lastName}`.trim() : ''],
        ['Patient Type', c.patientType === 'new' ? 'New Patient' : 'Existing Patient'],
        ['DOB', when(p?.dob)],
        ['Gender', p?.gender],
        ['Phone', p?.phone],
        ['MRN', p ? (p.mrn || 'Not on file') : ''],
        ...accountRows,
        ['Language', f.preferredLanguage],
        ['Contact', join([f.contactMethod, f.appointmentReminder && `Reminder: ${f.appointmentReminder}`])],
        ['Emergency Contact', join([
            f.emergencyName && join([f.emergencyName, f.emergencyRelation && `(${f.emergencyRelation})`], ' '),
            f.emergencyPhone
        ])]
    ]);

    fillReview('reviewAppointment', [
        ['Specialty', f.medicalSpecialty],
        ['Physician', f.preferredPhysician || 'Not selected'],
        ['Date & Time', join([when(f.preferredDate), f.preferredTime])],
        ['Mode', f.consultationMode],
        ['Visit Type', f.visitType],
        ['Reason', f.reasonForVisit],
        ['Referral', join([f.referralSource, f.referredBy])]
    ]);

    const symptomRows = [
        ['Chief Complaint', f.chiefComplaint],
        ['HPI', lines([
            f.hpiLocation && `Location: ${f.hpiLocation}`,
            f.hpiQuality && `Quality: ${f.hpiQuality}`,
            f.hpiSeverity && `Severity: ${f.hpiSeverity}`,
            f.hpiPattern && `Pattern: ${f.hpiPattern}`,
            f.hpiProgression && `Progression: ${f.hpiProgression}`,
            f.hpiAggravating && `Aggravated by: ${f.hpiAggravating}`,
            f.hpiRelieving && `Relieved by: ${f.hpiRelieving}`
        ])],
        ['Duration / Onset', join([f.symptomDuration, f.symptomOnset && `since ${when(f.symptomOnset)}`])],
        ['Symptoms', join([c.symptoms.join(', '), f.otherSymptoms && `Other: ${f.otherSymptoms}`], '; ') || 'None selected'],
        ['Pain', c.painLevel === null ? 'Not specified' : `${c.painLevel}/10`],
        ['Urgency', c.urgency]
    ];

    if (c.requiresTriage) {
        symptomRows.push(['Triage', 'Immediate clinical / triage attention required']);
    }

    fillReview('reviewSymptomsCard', symptomRows);

    fillReview('reviewHistory', [
        ['Conditions', lines([
            f.existingConditions && `Existing: ${f.existingConditions}`,
            f.previousDiagnoses && `Previous: ${f.previousDiagnoses}`,
            f.chronicIllnesses && `Chronic: ${f.chronicIllnesses}`
        ]) || 'None provided'],
        ['Surgical History', join([f.previousSurgeries, f.surgicalProcedure, when(f.surgeryDate), f.surgeryNotes]) || 'None provided'],
        ['Allergy Status', c.allergyStatus === 'Allergies Present'
            ? lines([
                c.allergyStatus,
                f.drugAllergies && `Drug: ${f.drugAllergies}`,
                f.foodAllergies && `Food: ${f.foodAllergies}`,
                f.otherAllergies && `Other: ${f.otherAllergies}`,
                f.allergyReaction && `Reaction: ${f.allergyReaction}`
            ])
            : c.allergyStatus || 'Not specified'],
        ['Medications', c.noMedications
            ? 'No Current Medications'
            : lines(c.medications.map(med => join([
                join([med.name, med.dose], ' '),
                med.route,
                med.frequency,
                med.indication && `For: ${med.indication}`,
                med.status,
                med.notes && `Notes: ${med.notes}`
            ]))) || 'None provided'],
        ['Family History', c.familyHistory.join(', ') || 'None selected'],
        ['Lifestyle', join([
            f.smoking && `Smoking: ${f.smoking}`,
            f.alcohol && `Alcohol: ${f.alcohol}`,
            f.exercise && `Exercise: ${f.exercise}`,
            f.lifestyleNotes
        ], '; ') || 'None provided']
    ]);

    fillReview('reviewVitals', [
        ['Blood Pressure', unit(f.vitalBp, 'mmHg')],
        ['Heart Rate', unit(f.vitalHr, 'bpm')],
        ['Temperature', unit(f.vitalTemp, '°C')],
        ['Resp. Rate', unit(f.vitalRr, '/min')],
        ['SpO2', unit(f.vitalSpo2, '%')],
        ['Height', unit(f.vitalHeight, 'cm')],
        ['Weight', unit(f.vitalWeight, 'kg')],
        ['BMI', f.vitalBmi],
        ['Screening', screening]
    ]);

    fillReview('reviewOther', [
        ['Insurance', join([f.provider, f.policy, f.coverageType])],
        ['Pharmacy', join([f.pharmacyName, f.pharmacyPhone, f.pharmacyAddress]) || 'Not provided'],
        ['Documents', Object.values(c.documents).flat().join(', ') || 'None attached'],
        ['Notes', f.appointmentNotes]
    ]);
}


/* =========================================================
   SAVE DRAFT
========================================================= */

function saveDraft() {
    syncState();

    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
            /* Consent is never carried in a draft; it is given at confirmation. */
            consultation: { ...consultation, consents: {} },
            savedAt: new Date().toISOString()
        }));

        showValidationModal('Consultation draft saved successfully.', { title: 'Draft Saved', variant: 'success' });
    } catch (e) {
        showValidationModal('Unable to save the draft on this device.', { title: 'Unable to Save', variant: 'error' });
    }
}


/* =========================================================
   CONFIRM CONSULTATION
========================================================= */

function newConsultationId(existing) {
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let id;

    do {
        id = `CON-${day}-${Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0')}`;
    } while (existing.some(item => item.id === id));

    return id;
}

function confirmConsultation() {
    /* 1–2. Validate every step and the consent. */
    for (let step = 1; step <= 5; step++) {
        const message = stepError(step);

        if (message) {
            if (step < 5) {
                setStep(step, true);
            }

            showValidationModal(message);

            return;
        }
    }

    /* 3–5. Unique ID, complete record, status CONFIRMED. */
    let saved = [];

    try {
        saved = JSON.parse(localStorage.getItem(CONSULTATIONS_KEY)) || [];
    } catch (e) {
        saved = [];
    }

    const id = consultation.id || newConsultationId(saved);

    /* A New Patient becomes a saved patient record (never saved twice). */
    const storedNewPatient = allPatients.find(item => item.id === persistedNewPatientId);
    const newPatient = currentPatientType === 'new'
        ? (storedNewPatient || buildNewPatientRecord())
        : null;

    const record = {
        ...snapshot(),
        id,
        status: 'CONFIRMED',
        confirmedAt: new Date().toISOString()
    };

    if (newPatient) {
        record.patientId = newPatient.id;
        record.patient = { ...newPatient };
        record.account = { ...record.account, accountId: newPatient.accountId };
    }

    try {
        localStorage.setItem(
            CONSULTATIONS_KEY,
            JSON.stringify([...saved.filter(item => item.id !== id), record])
        );
        localStorage.setItem(LATEST_KEY, JSON.stringify(record));
        localStorage.removeItem(DRAFT_KEY);

        if (newPatient && !storedNewPatient) {
            allPatients.push(newPatient);
            savePatients(allPatients);
            persistedNewPatientId = newPatient.id;
        }
    } catch (e) {
        showValidationModal('Unable to save the consultation on this device. Please try again.', { title: 'Unable to Save', variant: 'error' });
        return;
    }

    consultation.id = id;
    consultation.status = 'CONFIRMED';

    /* 6–7. Existing success modal; stay on the page. */
    const f = record.fields;

    el('successConsultationId').textContent = id;
    el('successPatient').textContent = `${record.patient.firstName} ${record.patient.lastName}`;
    el('successPhysician').textContent = f.preferredPhysician || 'Not selected';
    el('successSpecialty').textContent = f.medicalSpecialty || '—';
    el('successDateTime').textContent = `${formatDob(f.preferredDate)} · ${f.preferredTime}`;
    el('successMode').textContent = f.consultationMode;
    el('successStatus').textContent = 'Confirmed';

    el('successMessage').textContent = record.requiresTriage
        ? 'The physician consultation has been confirmed and flagged for immediate clinical / triage attention.'
        : 'The physician consultation has been successfully confirmed.';

    setModal('successModal', true);
}


/* =========================================================
   PAIN SCALE
========================================================= */

function initPain() {

    const box =
        el('painScale');


    if (!box) return;


    for (let i = 0; i <= 10; i++) {

        const button =
            document.createElement('button');


        button.type = 'button';

        button.textContent = i;


        button.addEventListener(
            'click',
            () => {

                consultation.painLevel = i;


                box
                    .querySelectorAll('button')
                    .forEach(
                        item =>
                            item.classList.remove(
                                'selected'
                            )
                    );


                button.classList.add(
                    'selected'
                );
            }
        );


        box.appendChild(button);
    }
}


/* =========================================================
   CHOICE CARDS
========================================================= */

function initChoiceCards() {

    /* Specialty */

    document
        .querySelectorAll(
            '#specialtyGrid .choice-card'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    document
                        .querySelectorAll(
                            '#specialtyGrid .choice-card'
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    'selected'
                                )
                        );


                    button.classList.add(
                        'selected'
                    );


                    setValue(
                        'medicalSpecialty',
                        button.dataset.value
                    );
                }
            );
        });


    /* Consultation Mode */

    document
        .querySelectorAll(
            '#modeGrid .mode-card'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    document
                        .querySelectorAll(
                            '#modeGrid .mode-card'
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    'selected'
                                )
                        );


                    button.classList.add(
                        'selected'
                    );


                    setValue(
                        'consultationMode',
                        button.dataset.value
                    );
                }
            );
        });


    /* Urgency */

    document
        .querySelectorAll(
            '#urgencyGrid .urgency-card'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    document
                        .querySelectorAll(
                            '#urgencyGrid .urgency-card'
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    'selected'
                                )
                        );


                    button.classList.add(
                        'selected'
                    );


                    consultation.urgency =
                        button.dataset.value;

                    refreshUi();
                }
            );
        });
}


/* =========================================================
   TEXT COUNTERS
========================================================= */

function initCounters() {

    const counters = [
        [
            'chiefComplaint',
            'chiefComplaintCount'
        ],
        [
            'otherSymptoms',
            'otherSymptomsCount'
        ]
    ];


    counters.forEach(
        ([id, countId]) => {

            const input =
                el(id);

            const output =
                el(countId);


            if (!input || !output) {
                return;
            }


            const update = () => {

                output.textContent =
                    `${input.value.length}/${input.maxLength}`;
            };


            input.addEventListener(
                'input',
                update
            );


            update();
        }
    );
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        allPatients =
            loadPatients();


        initValidationModal();

        initPain();

        initChoiceCards();

        initCounters();
        renderMedications();
        bindIntakeEvents();
        initPatientType();
        restoreDraft();


        /* -----------------------------------------
           Appointment date/time from availability
        ----------------------------------------- */

        const selectedDate =
            localStorage.getItem(
                'selectedDate'
            );


        if (selectedDate) {

            setValue(
                'preferredDate',
                selectedDate
            );
        }


        const selectedTime =
            localStorage.getItem(
                'selectedTime'
            );


        if (selectedTime) {

            setValue(
                'preferredTime',
                selectedTime
            );
        }


        /* Minimum appointment date */

        const preferredDate =
            el('preferredDate');


        if (preferredDate) {

            const minDate =
                new Date()
                    .toISOString()
                    .split('T')[0];


            preferredDate.min =
                minDate;
        }


        /* -----------------------------------------
           Patient Selection
        ----------------------------------------- */

        el('patientSearchBtn')
            ?.addEventListener(
                'click',
                () => {

                    searchPatients(
                        getValue(
                            'patientLastNameSearch'
                        ),
                        getValue(
                            'patientMobileSearch'
                        ),
                        getValue(
                            'patientDobSearch'
                        )
                    );
                }
            );


        el('patientClearBtn')
            ?.addEventListener(
                'click',
                () => {

                    setValue(
                        'patientLastNameSearch',
                        ''
                    );

                    setValue(
                        'patientMobileSearch',
                        ''
                    );

                    setValue(
                        'patientDobSearch',
                        ''
                    );


                    const results =
                        el('patientSearchResults');


                    if (results) {
                        results.innerHTML = '';
                    }
                }
            );


        el('switchProfileBtn')
            ?.addEventListener(
                'click',
                openPatientModal
            );


        /* -----------------------------------------
           Patient Modal Search
        ----------------------------------------- */

        el('patientSearchInput')
            ?.addEventListener(
                'input',
                applyModalSearch
            );


        el('patientDobFilter')
            ?.addEventListener(
                'change',
                applyModalSearch
            );


        el('modalPatientSearchBtn')
            ?.addEventListener(
                'click',
                applyModalSearch
            );


        /* -----------------------------------------
           Confirm Patient
        ----------------------------------------- */

        el('selectPatientConfirmBtn')
            ?.addEventListener(
                'click',
                () => {

                    if (modalSelected) {

                        setPatientFields(
                            modalSelected
                        );


                        setModal(
                            'selectPatientModal',
                            false
                        );
                    }
                }
            );


        /* -----------------------------------------
           Close Patient Modal
        ----------------------------------------- */

        [
            'closePatientModal',
            'cancelPatientModal'
        ].forEach(id => {

            el(id)?.addEventListener(
                'click',
                () =>
                    setModal(
                        'selectPatientModal',
                        false
                    )
            );
        });


        /* -----------------------------------------
           Save Draft
        ----------------------------------------- */

        el('saveDraftBtn')
            ?.addEventListener(
                'click',
                saveDraft
            );


        /* -----------------------------------------
           Back
        ----------------------------------------- */

        el('backBtn')
            ?.addEventListener(
                'click',
                () => {

                    setStep(
                        currentStep - 1,
                        true
                    );
                }
            );


        /* -----------------------------------------
           Continue / Confirm
        ----------------------------------------- */

        el('continueBtn')
            ?.addEventListener(
                'click',
                () => {

                    if (currentStep === 5) {

                        confirmConsultation();

                    } else {

                        setStep(
                            currentStep + 1
                        );
                    }
                }
            );


        /* -----------------------------------------
           Stepper Navigation
        ----------------------------------------- */

        document
            .querySelectorAll(
                '.step-item'
            )
            .forEach(item => {

                item.addEventListener(
                    'click',
                    () => {

                        const target =
                            Number(
                                item.dataset.stepTarget
                            );


                        /*
                         * Allow jumping to any of the 5 steps.
                         */

                        if (
                            target >= 1 &&
                            target <= 5
                        ) {

                            setStep(
                                target,
                                true
                            );
                        }
                    }
                );
            });


        /* -----------------------------------------
           Review Edit Buttons
        ----------------------------------------- */

        document
            .querySelectorAll(
                '.review-edit'
            )
            .forEach(button => {

                button.addEventListener(
                    'click',
                    () => {

                        setStep(
                            Number(
                                button.dataset.goto
                            ),
                            true
                        );
                    }
                );
            });


        /* -----------------------------------------
           Success Modal
        ----------------------------------------- */

        el('closeSuccessModal')
            ?.addEventListener(
                'click',
                () =>
                    setModal(
                        'successModal',
                        false
                    )
            );


        el('viewConsultationBtn')
            ?.addEventListener(
                'click',
                () =>
                    setModal(
                        'successModal',
                        false
                    )
            );


        /* -----------------------------------------
           Start at Step 1
        ----------------------------------------- */

        setStep(
            1,
            true
        );
    }
);