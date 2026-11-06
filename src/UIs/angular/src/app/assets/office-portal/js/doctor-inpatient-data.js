window.InpatientRepository = (() => {
    const STORAGE_KEY = "hh.doctorPortal.inpatient.v1";
    const STATUSES = ["Stable", "Under Observation", "Review Due", "Critical", "Discharge Planning"];
    const ACUITIES = ["Low", "Moderate", "High"];
    const NOTE_TYPES = ["Progress Note", "Clinical Review", "Care Plan Update", "Patient / Family Communication"];

    const SEED = [
        {
            id: "HH-IP-1001", name: "Ramesh Iyer", age: 67, gender: "Male", ward: "Cardiology", room: "Room 204", bed: "Bed A",
            admittedOn: "2026-11-02", diagnosis: "Acute coronary syndrome", attending: "Dr. Morgan Maxwell", acuity: "High", status: "Review Due",
            allergies: "Penicillin",
            observations: { bp: "148/92", hr: "96", temp: "37.2", spo2: "95", rr: "20", recordedAt: "2026-11-06T07:30:00" },
            summary: "Presented with chest pain and ECG changes. Troponin trending down after initial management.",
            carePlan: ["Continuous cardiac monitoring", "Repeat troponin and ECG this afternoon", "Cardiology team review before mobilisation"],
            keyObservations: "Intermittent mild chest tightness overnight. Blood pressure remains above target.",
            notes: [{ id: "seed-1001-1", type: "Progress Note", text: "Comfortable at rest. No further chest pain since 02:00. Awaiting repeat troponin.", author: "Dr. Morgan Maxwell", createdAt: "2026-11-05T18:10:00" }]
        },
        {
            id: "HH-IP-1002", name: "Kavitha Menon", age: 54, gender: "Female", ward: "General Medicine", room: "Room 112", bed: "Bed B",
            admittedOn: "2026-11-04", diagnosis: "Community-acquired pneumonia", attending: "Dr. Kumaravel", acuity: "Moderate", status: "Under Observation",
            allergies: "None known",
            observations: { bp: "126/78", hr: "88", temp: "37.8", spo2: "94", rr: "22", recordedAt: "2026-11-06T06:45:00" },
            summary: "Productive cough and fever for four days. Chest X-ray shows right lower zone consolidation.",
            carePlan: ["Continue antibiotic course as prescribed", "Four-hourly observations", "Reassess oxygen requirement daily"],
            keyObservations: "Low-grade fever persists. Oxygen saturation adequate on room air.",
            notes: [{ id: "seed-1002-1", type: "Clinical Review", text: "Improving clinically. Cough less frequent. Continue current plan.", author: "Dr. Kumaravel", createdAt: "2026-11-05T09:20:00" }]
        },
        {
            id: "HH-IP-1003", name: "Arjun Nambiar", age: 45, gender: "Male", ward: "Orthopaedics", room: "Room 308", bed: "Bed A",
            admittedOn: "2026-11-03", diagnosis: "Post-operative total knee replacement", attending: "Dr. Vikram Shetty", acuity: "Low", status: "Stable",
            allergies: "Latex",
            observations: { bp: "122/80", hr: "74", temp: "36.8", spo2: "98", rr: "16", recordedAt: "2026-11-06T07:00:00" },
            summary: "Day 3 after elective right total knee replacement. Wound clean and dry.",
            carePlan: ["Physiotherapy twice daily", "Wound review daily", "Pain assessment each shift"],
            keyObservations: "Mobilising with frame. Pain controlled.",
            notes: [{ id: "seed-1003-1", type: "Progress Note", text: "Mobilised 20 metres with physiotherapy. Pain score 3 out of 10.", author: "Dr. Vikram Shetty", createdAt: "2026-11-05T15:40:00" }]
        },
        {
            id: "HH-IP-1004", name: "Fatima Sheikh", age: 72, gender: "Female", ward: "Neurology", room: "Room 215", bed: "Bed C",
            admittedOn: "2026-11-01", diagnosis: "Ischaemic stroke, left MCA territory", attending: "Dr. Arvind Pillai", acuity: "High", status: "Critical",
            allergies: "None known",
            observations: { bp: "158/94", hr: "102", temp: "37.0", spo2: "93", rr: "24", recordedAt: "2026-11-06T07:15:00" },
            summary: "Right-sided weakness and speech difficulty on admission. Under close neurological monitoring.",
            carePlan: ["Neurological observations hourly", "Swallow assessment before oral intake", "Blood pressure management per stroke protocol"],
            keyObservations: "Dysarthria unchanged. Right arm power 3 out of 5.",
            notes: [{ id: "seed-1004-1", type: "Clinical Review", text: "No new deficit overnight. Repeat imaging requested for review.", author: "Dr. Arvind Pillai", createdAt: "2026-11-06T06:30:00" }]
        },
        {
            id: "HH-IP-1005", name: "Suresh Babu", age: 59, gender: "Male", ward: "General Medicine", room: "Room 118", bed: "Bed A",
            admittedOn: "2026-10-30", diagnosis: "Diabetic ketoacidosis, resolving", attending: "Dr. Deepa Krishnan", acuity: "Moderate", status: "Discharge Planning",
            allergies: "Sulfonamides",
            observations: { bp: "130/82", hr: "80", temp: "36.9", spo2: "97", rr: "17", recordedAt: "2026-11-06T07:20:00" },
            summary: "Ketoacidosis resolved. Transitioned to subcutaneous insulin with stable glucose readings.",
            carePlan: ["Diabetes education session", "Dietitian review", "Confirm follow-up appointment before discharge"],
            keyObservations: "Glucose within target for 24 hours.",
            notes: [{ id: "seed-1005-1", type: "Care Plan Update", text: "Medically fit pending education session and follow-up arrangement.", author: "Dr. Deepa Krishnan", createdAt: "2026-11-05T17:00:00" }]
        },
        {
            id: "HH-IP-1006", name: "Lakshmi Narayanan", age: 38, gender: "Female", ward: "Surgical", room: "Room 402", bed: "Bed B",
            admittedOn: "2026-11-05", diagnosis: "Acute appendicitis, post-appendicectomy", attending: "Dr. Rohan Mehta", acuity: "Low", status: "Stable",
            allergies: "None known",
            observations: { bp: "118/74", hr: "78", temp: "37.0", spo2: "99", rr: "15", recordedAt: "2026-11-06T07:05:00" },
            summary: "Laparoscopic appendicectomy completed without complication. Tolerating oral fluids.",
            carePlan: ["Advance diet as tolerated", "Early mobilisation", "Wound check before discharge"],
            keyObservations: "Mild port-site tenderness. Afebrile.",
            notes: []
        },
        {
            id: "HH-IP-1007", name: "George Thomas", age: 81, gender: "Male", ward: "Cardiology", room: "Room 206", bed: "Bed B",
            admittedOn: "2026-10-31", diagnosis: "Congestive heart failure, acute decompensation", attending: "Dr. Anitha Raman", acuity: "High", status: "Under Observation",
            allergies: "Aspirin",
            observations: { bp: "136/84", hr: "90", temp: "36.7", spo2: "92", rr: "21", recordedAt: "2026-11-06T06:50:00" },
            summary: "Breathlessness and leg oedema on admission. Responding to diuretic therapy.",
            carePlan: ["Daily weight and fluid balance", "Electrolyte monitoring", "Review diuretic dose each morning"],
            keyObservations: "Weight down 2.4 kg since admission. Mild basal crackles remain.",
            notes: [{ id: "seed-1007-1", type: "Progress Note", text: "Urine output adequate. Breathlessness improved on exertion.", author: "Dr. Anitha Raman", createdAt: "2026-11-05T11:25:00" }]
        },
        {
            id: "HH-IP-1008", name: "Divya Prakash", age: 29, gender: "Female", ward: "Maternity", room: "Room 506", bed: "Bed A",
            admittedOn: "2026-11-05", diagnosis: "Pre-eclampsia, 36 weeks gestation", attending: "Dr. Neha Kapoor", acuity: "Moderate", status: "Review Due",
            allergies: "None known",
            observations: { bp: "144/94", hr: "84", temp: "36.8", spo2: "98", rr: "18", recordedAt: "2026-11-06T07:40:00" },
            summary: "Elevated blood pressure and proteinuria. Fetal monitoring reassuring.",
            carePlan: ["Four-hourly blood pressure", "Daily fetal monitoring", "Obstetric review regarding delivery planning"],
            keyObservations: "Blood pressure borderline. No headache or visual symptoms.",
            notes: []
        },
        {
            id: "HH-IP-1009", name: "Mohammed Rafi", age: 63, gender: "Male", ward: "Neurology", room: "Room 217", bed: "Bed A",
            admittedOn: "2026-11-04", diagnosis: "Seizure disorder, medication adjustment", attending: "Dr. Sunita Rao", acuity: "Moderate", status: "Under Observation",
            allergies: "Carbamazepine",
            observations: { bp: "128/80", hr: "72", temp: "36.6", spo2: "98", rr: "16", recordedAt: "2026-11-06T06:55:00" },
            summary: "Breakthrough seizure at home. Anti-epileptic regimen being adjusted under observation.",
            carePlan: ["Seizure precautions", "Drug level monitoring", "Neurology review of regimen"],
            keyObservations: "No seizure activity in last 36 hours.",
            notes: [{ id: "seed-1009-1", type: "Progress Note", text: "Seizure free. Alert and oriented. Drug level pending.", author: "Dr. Sunita Rao", createdAt: "2026-11-05T14:05:00" }]
        },
        {
            id: "HH-IP-1010", name: "Anita Deshmukh", age: 48, gender: "Female", ward: "Surgical", room: "Room 410", bed: "Bed A",
            admittedOn: "2026-11-01", diagnosis: "Cholecystectomy, post-operative recovery", attending: "Dr. Rohan Mehta", acuity: "Low", status: "Discharge Planning",
            allergies: "Iodine contrast",
            observations: { bp: "120/76", hr: "70", temp: "36.7", spo2: "99", rr: "14", recordedAt: "2026-11-06T07:10:00" },
            summary: "Uncomplicated recovery after laparoscopic cholecystectomy. Eating and mobilising independently.",
            carePlan: ["Wound care instructions", "Discharge medication review", "Outpatient follow-up in two weeks"],
            keyObservations: "Wounds healing well. Pain minimal.",
            notes: []
        }
    ];

    let memory = { notes: {}, status: {} };
    let persistent = true;

    function load() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : null;
            if (parsed && typeof parsed === "object") {
                memory = {
                    notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
                    status: parsed.status && typeof parsed.status === "object" ? parsed.status : {}
                };
            }
        } catch (error) {
            persistent = false;
        }
    }

    function save() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
            persistent = true;
        } catch (error) {
            persistent = false;
        }
        return persistent;
    }

    function merge(seed) {
        const stored = Array.isArray(memory.notes[seed.id]) ? memory.notes[seed.id] : [];
        const validStored = stored.filter(note => note && typeof note.text === "string" && typeof note.createdAt === "string");
        const status = STATUSES.indexOf(memory.status[seed.id]) >= 0 ? memory.status[seed.id] : seed.status;
        return Object.assign({}, seed, {
            status,
            observations: Object.assign({}, seed.observations),
            carePlan: seed.carePlan.slice(),
            notes: seed.notes.concat(validStored).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        });
    }

    function listPatients() {
        return SEED.map(merge);
    }

    function getPatient(id) {
        const seed = SEED.find(item => item.id === id);
        return seed ? merge(seed) : null;
    }

    function addNote(patientId, input) {
        if (!SEED.some(item => item.id === patientId)) return { ok: false, persisted: false };
        const note = {
            id: "note-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
            type: input.type,
            text: input.text,
            author: input.author,
            createdAt: input.createdAt
        };
        memory.notes[patientId] = (Array.isArray(memory.notes[patientId]) ? memory.notes[patientId] : []).concat(note);
        return { ok: true, persisted: save(), note };
    }

    function updateStatus(patientId, status, author, createdAt) {
        const current = getPatient(patientId);
        if (!current || STATUSES.indexOf(status) < 0 || current.status === status) return { ok: false, persisted: false };
        memory.status[patientId] = status;
        const result = addNote(patientId, {
            type: "Status Update",
            text: "Clinical status changed from " + current.status + " to " + status + ".",
            author,
            createdAt
        });
        return { ok: true, persisted: result.persisted };
    }

    load();

    return { STATUSES, ACUITIES, NOTE_TYPES, STORAGE_KEY, listPatients, getPatient, addNote, updateStatus, isPersistent: () => persistent };
})();
