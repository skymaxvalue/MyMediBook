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

    let memory = { notes: {}, status: {}, workflows: {}, care: {} };
    let persistent = true;

    function load() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : null;
            if (parsed && typeof parsed === "object") {
                memory = {
                    notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
                    status: parsed.status && typeof parsed.status === "object" ? parsed.status : {},
                    workflows: parsed.workflows && typeof parsed.workflows === "object" ? parsed.workflows : {},
                    care: parsed.care && typeof parsed.care === "object" ? parsed.care : {}
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
            mrn: seed.mrn || seed.id,
            encounterId: encounterOf(seed),
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

    function getWorkflow(patientId) {
        return memory.workflows[patientId] && typeof memory.workflows[patientId] === "object" ? memory.workflows[patientId] : {};
    }

    function saveWorkflow(patientId, stepId, values, author, createdAt) {
        if (!SEED.some(item => item.id === patientId) || !stepId || !values || typeof values !== "object") return { ok: false, persisted: false };
        if (!memory.workflows[patientId]) memory.workflows[patientId] = {};
        memory.workflows[patientId][stepId] = { values, author: author || "Doctor", updatedAt: createdAt || new Date().toISOString(), completed: true };
        return { ok: true, persisted: save() };
    }


    /* ------------------------------------------------------------------
       Inpatient care workflow records.
       Stored under memory.care[patientId][encounterId] so that records from
       different admissions are never mixed. The legacy memory.workflows
       branch (old ten-stage form) is left untouched and no longer read.
       NOTE: browser localStorage is a prototype store, not a clinical record system.
       ------------------------------------------------------------------ */
    const ARRANGEMENTS = [
        { id: "destination", label: "Discharge destination" },
        { id: "social", label: "Social determinants / home support" },
        { id: "transport", label: "Transportation" },
        { id: "equipment", label: "Equipment" },
        { id: "insurance", label: "Insurance authorization" },
        { id: "caregiver", label: "Family / caregiver" }
    ];
    const READINESS_ITEMS = [
        { id: "stability", label: "Stable vital signs / clinical stability" },
        { id: "diagnosis", label: "Final diagnosis documented" },
        { id: "investigations", label: "Required laboratory tests and investigations completed" },
        { id: "medRec", label: "Medication reconciliation completed" },
        { id: "followUp", label: "Follow-up appointments arranged" },
        { id: "patientEd", label: "Patient education completed" },
        { id: "caregiverEd", label: "Caregiver education completed" },
        { id: "equipment", label: "Required equipment delivered" },
        { id: "transport", label: "Transportation confirmed" }
    ];
    const ITEM_STATUSES = ["Pending", "In Progress", "Completed", "Not Applicable"];
    const ACTION_STATUSES = ["Pending", "In Progress", "Completed"];
    const DETERMINATIONS = ["Not determined", "Not ready for discharge", "Ready for discharge (physician determination)"];
    const READY = DETERMINATIONS[2];
    const ROUND_LIMIT = 3;
    const ROUND_TYPE_KEYS = ["physician", "nursing"];


    /* Pre-populated care records for Ramesh Iyer (HH-IP-1001), used until the first edit is saved. */
    const SEED_CARE = (() => {
        const enc = "ENC-IP-1001-20261102", base = { patientId: "HH-IP-1001", encounterId: enc };
        const round = (id, type, number, date, time, status, name, v) => {
            const role = type === "nursing" ? "Nurse" : "Physician";
            const at = date + "T" + time + ":00";
            return Object.assign({ id, type, number, schema: 2, status, roundAt: date + "T" + time, provider: name, role, createdAt: at, createdBy: name, updatedAt: at, updatedBy: name }, status === "saved" ? { savedAt: at } : {}, base, { values: Object.assign({ roundDate: date, roundTime: time, providerName: name, providerRole: role }, v) });
        };
        const parts = d => [["Dr. Morgan Maxwell", "Physician"], ["Nurse Anjali Rao", "Nurse"], ["Priya Natarajan", "Case Manager"], ["Vivek Shah", "Pharmacist"], ["Meera Joseph", "Therapist"]].map(([name, role]) => ({ name, role, date: d }));
        const act = (id, action, responsible, due, status, at) => ({ id, action, responsible, due, status, history: [{ at, by: "Dr. Morgan Maxwell", status: "Pending" }].concat(status === "Pending" ? [] : [{ at: "2026-11-20T09:40:00", by: "Dr. Morgan Maxwell", status }]) });
        const item = (id, label, status, owner, date, notes) => ({ id, label, status, owner, date, notes });
        return { "HH-IP-1001": {
            rounds: [
                round("seed-round-1", "physician", 1, "2026-11-18", "08:00", "saved", "Dr. Morgan Maxwell", { subjective: "Intermittent mild chest tightness at rest that settles spontaneously.", intervalEvents: "No events overnight.", painScore: "2", temp: "37.0", bp: "148/92", hr: "96", rr: "20", spo2: "95", examFindings: "Chest clear. Heart sounds normal. No peripheral oedema.", investigations: "Troponin I 1.8 → 1.2 ng/mL (downtrending). Echo: EF 45%, anterior hypokinesia.", assessment: "NSTEMI, haemodynamically stable, troponin downtrending.", activeProblems: "NSTEMI. Blood pressure above target.", plan: "Continue current cardiac therapy. Repeat ECG daily. Plan coronary angiography.", ordersReferrals: "Cardiology review for angiography.", followUp: "Continuous cardiac monitoring.", barriers: "Angiography pending.", expectedDischarge: "2026-11-24" }),
                round("seed-round-2", "physician", 2, "2026-11-19", "07:45", "saved", "Dr. Morgan Maxwell", { subjective: "No chest pain since 02:00. Mild fatigue.", intervalEvents: "Brief chest tightness at 02:00 settled with rest; ECG unchanged.", painScore: "1", temp: "37.1", bp: "140/88", hr: "88", rr: "18", spo2: "96", examFindings: "No new findings.", investigations: "Troponin I 0.6 ng/mL. Creatinine 1.0 mg/dL.", assessment: "Improving. No recurrent ischaemia after the overnight episode.", activeProblems: "NSTEMI, improving.", plan: "Continue current therapy. Mobilise with physiotherapy. Angiography on 20-Nov per cardiology.", followUp: "Review angiography result.", barriers: "Angiography pending; cardiac rehab referral needed.", expectedDischarge: "2026-11-24" }),
                round("seed-round-3", "nursing", 1, "2026-11-19", "14:00", "saved", "Nurse Anjali Rao", { patientStatus: "Comfortable at rest, alert and oriented.", reportedConcerns: "Mild tiredness.", painScore: "1", temp: "37.0", bp: "138/86", hr: "84", rr: "17", spo2: "97", mobility: "Assisted (1 person)", diet: "Tolerating diet", woundSkin: "Skin intact.", fallIncident: "None", interventions: "Cardiac monitoring maintained. Assisted to walk 30 m. Comfort checks each hour.", patientEducation: "Explained when to report chest tightness.", response: "Tolerated mobilisation without chest pain or breathlessness.", nextActions: "Continue monitoring and reinforce symptom reporting.", escalationNeeded: "No" }),
                round("seed-round-4", "nursing", 2, "2026-11-20", "08:15", "draft", "Nurse Anjali Rao", { patientStatus: "Comfortable. No chest pain overnight.", painScore: "0", temp: "36.9", bp: "136/84", hr: "82", rr: "17", spo2: "97", mobility: "Supervised", diet: "Tolerating diet", fallIncident: "None", interventions: "Morning observations completed.", escalationNeeded: "No" })
            ],
            coordination: Object.assign({ createdAt: "2026-11-18T10:00:00", createdBy: "Priya Natarajan", updatedAt: "2026-11-20T09:55:00", updatedBy: "Priya Natarajan" }, base, {
                values: { expectedDischarge: "2026-11-24", disposition: "Home", living: "Lives with spouse in a ground-floor flat.", financial: "No access concerns identified.", homeSupport: "Spouse available; cardiac rehab follow-up required.", otherNeeds: "", transportRequired: "Yes", transportMode: "Family / caregiver transport", transportNotes: "Son to drive on the day of discharge.", eqWheelchair: false, eqWalker: false, eqOxygen: false, eqOther: "", eqDelivery: "Not required", insStatus: "Pending", authRef: "AUTH-48213", insPending: "Authorization for coronary angiography.", insNotes: "Payer response expected within 24 h.", caregiverName: "Sunita Iyer", caregiverRel: "Spouse", caregiverAvail: "Daytime and evenings", caregiverSupport: "Medication and warning-sign teaching." },
                arrangements: { destination: { status: "Completed", owner: "Priya Natarajan" }, social: { status: "Completed", owner: "Priya Natarajan" }, transport: { status: "In Progress", owner: "Priya Natarajan" }, equipment: { status: "Not Applicable", owner: "Priya Natarajan" }, insurance: { status: "In Progress", owner: "Priya Natarajan" }, caregiver: { status: "Completed", owner: "Priya Natarajan" } },
                log: [{ at: "2026-11-18T10:00:00", by: "Priya Natarajan", text: "Coordination started · 6 arrangement(s) outstanding" }, { at: "2026-11-20T09:55:00", by: "Priya Natarajan", text: "Coordination updated · 2 arrangement(s) outstanding" }] }),
            mdt: [
                Object.assign({ id: "seed-mdt-1", createdAt: "2026-11-19T09:30:00", author: "Dr. Morgan Maxwell", reviewAt: "2026-11-19T09:30" }, base, { participants: parts("2026-11-19"), values: { reviewAt: "2026-11-19T09:30", progress: "Troponin downtrending; one brief overnight episode of chest tightness.", condition: "Improving", response: "Good response to beta-blocker and antiplatelets.", bar_investigations: true, bar_insurance: true, barrierNotes: "Angiography and payer authorization pending.", pendLabs: "Repeat troponin and lipid profile.", consultStatus: "Cardiology agreed angiography on 20-Nov.", medReview: "Reviewed by pharmacist; no interactions.", medDiscrepancies: "Home aspirin dose differs from list; clarified.", mdtReadiness: "Potentially ready — actions pending", targetDischarge: "2026-11-24", outstandingReq: "Angiography, authorization, cardiac rehab referral." },
                    actions: [act("seed-act-1", "Complete discharge medication reconciliation", "Vivek Shah", "2026-11-19", "Completed", "2026-11-19T09:30:00"), act("seed-act-2", "Review coronary angiography result", "Dr. Morgan Maxwell", "2026-11-21", "In Progress", "2026-11-19T09:30:00"), act("seed-act-3", "Submit cardiac rehabilitation referral", "Priya Natarajan", "2026-11-22", "Pending", "2026-11-19T09:30:00")] }),
                Object.assign({ id: "seed-mdt-2", createdAt: "2026-11-20T09:30:00", author: "Dr. Morgan Maxwell", reviewAt: "2026-11-20T09:30" }, base, { participants: parts("2026-11-20"), values: { reviewAt: "2026-11-20T09:30", progress: "Asymptomatic for 30 h. Angiography scheduled this afternoon.", condition: "Stable", bar_investigations: true, bar_insurance: true, pendImaging: "Coronary angiography today.", mdtReadiness: "Not ready", targetDischarge: "2026-11-24", outstandingReq: "Angiography result and payer authorization." },
                    actions: [act("seed-act-4", "Chase insurance authorization for angiography", "Priya Natarajan", "2026-11-20", "In Progress", "2026-11-20T09:30:00")] })
            ],
            readiness: [Object.assign({ id: "seed-ready-1", createdAt: "2026-11-20T10:00:00", author: "Dr. Morgan Maxwell", determination: "Not ready for discharge", reviewingPhysician: "Dr. Morgan Maxwell", reviewAt: "2026-11-20T10:00", summary: "Clinically improving. Investigations and arrangements outstanding." }, base, { items: [
                item("stability", "Stable vital signs / clinical stability", "In Progress", "Dr. Morgan Maxwell", "", "Monitoring continues."),
                item("diagnosis", "Final diagnosis documented", "In Progress", "Dr. Morgan Maxwell", "", "Pending angiography."),
                item("investigations", "Required laboratory tests and investigations completed", "In Progress", "Cardiology", "", "Angiography today."),
                item("medRec", "Medication reconciliation completed", "Completed", "Vivek Shah (Pharmacy)", "2026-11-19", ""),
                item("followUp", "Follow-up appointments arranged", "Pending", "Priya Natarajan", "", "Cardiac rehab referral."),
                item("patientEd", "Patient education completed", "Pending", "Nurse Anjali Rao", "", ""),
                item("caregiverEd", "Caregiver education completed", "Pending", "Nurse Anjali Rao", "", ""),
                item("equipment", "Required equipment delivered", "Not Applicable", "Priya Natarajan", "", "No equipment needed."),
                item("transport", "Transportation confirmed", "In Progress", "Priya Natarajan", "", "Family transport.")] })],
            discharge: null } };
    })();

    function encounterOf(seed) {
        return seed.encounterId || ("ENC-" + seed.id.replace(/^HH-/, "") + "-" + String(seed.admittedOn).replace(/-/g, ""));
    }
    function uid(prefix) { return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8); }
    function clone(value) { return JSON.parse(JSON.stringify(value)); }
    function pad(n) { return String(n).padStart(2, "0"); }
    function todayLocal() { const d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function roundTypeOf(round) {
        if (ROUND_TYPE_KEYS.indexOf(round.type) >= 0) return round.type;
        const role = round.role || (round.values && round.values.providerRole) || "";
        return role === "Nurse" ? "nursing" : "physician";
    }

    function normaliseRounds(data) {
        const seen = { physician: 0, nursing: 0 };
        data.rounds.slice().sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || ""))).forEach(round => {
            round.type = roundTypeOf(round);
            seen[round.type] += 1;
            if (!(round.number > 0)) round.number = seen[round.type];
        });
    }

    function roundCounts(data) {
        const counts = {};
        ROUND_TYPE_KEYS.forEach(type => { counts[type] = { count: data.rounds.filter(round => round.type === type).length, max: ROUND_LIMIT }; });
        return counts;
    }

    function emptyCare() { return { rounds: [], coordination: null, mdt: [], readiness: [], discharge: null }; }

    function careBucket(patientId, create) {
        const seed = SEED.find(item => item.id === patientId);
        if (!seed) return null;
        const enc = encounterOf(seed);
        if (create && (!memory.care[patientId] || typeof memory.care[patientId] !== "object")) memory.care[patientId] = {};
        const byEnc = memory.care[patientId] && typeof memory.care[patientId] === "object" ? memory.care[patientId] : null;
        let data = byEnc && byEnc[enc] && typeof byEnc[enc] === "object" ? byEnc[enc] : null;
        if (!data) { data = SEED_CARE[patientId] ? clone(SEED_CARE[patientId]) : emptyCare(); if (create) byEnc[enc] = data; }
        ["rounds", "mdt", "readiness"].forEach(key => { if (!Array.isArray(data[key])) data[key] = []; });
        data.rounds = data.rounds.filter(round => round && typeof round === "object" && round.values && typeof round.values === "object");
        normaliseRounds(data);
        if (!data.coordination || typeof data.coordination !== "object") data.coordination = null;
        if (!data.discharge || typeof data.discharge !== "object") data.discharge = null;
        return { seed, enc, data };
    }

    function mutate(patientId, fn, options) {
        const bucket = careBucket(patientId, true);
        if (!bucket) return { ok: false, persisted: false, error: "Patient record not found." };
        const snapshot = options && options.strict ? JSON.stringify(memory.care[patientId]) : null;
        const result = fn(bucket.data, bucket);
        if (!result || !result.ok) return Object.assign({ persisted: false }, result || { ok: false });
        result.persisted = save();
        if (snapshot !== null && !result.persisted) {
            memory.care[patientId] = JSON.parse(snapshot);
            return { ok: false, persisted: false, error: "The round could not be saved because browser storage is unavailable or full. Your entries are still on screen; please try again." };
        }
        return result;
    }

    function getCare(patientId) {
        const bucket = careBucket(patientId, false);
        return bucket ? clone(bucket.data) : null;
    }

    function openActions(data) {
        const out = [];
        data.mdt.forEach(review => (review.actions || []).forEach(action => {
            if (action.status !== "Completed") out.push(Object.assign({ reviewId: review.id, reviewAt: review.reviewAt }, action));
        }));
        return out;
    }
    function itemsOutstanding(assessment) {
        return (assessment.items || []).filter(item => item.status === "Pending" || item.status === "In Progress");
    }
    function arrangementsOutstanding(coord) {
        const arr = (coord && coord.arrangements) || {};
        return ARRANGEMENTS.filter(a => { const s = arr[a.id] && arr[a.id].status; return s !== "Completed" && s !== "Not Applicable"; });
    }

    function getStageStatuses(patientId) {
        const bucket = careBucket(patientId, false);
        if (!bucket) return null;
        const d = bucket.data, today = todayLocal(), res = {};
        const saved = d.rounds.filter(r => r.status === "saved"), drafts = d.rounds.filter(r => r.status === "draft");
        const discharged = !!(d.discharge && d.discharge.status === "final");
        res.rounds = { label: "Not Started", detail: "No rounds recorded" };
        if (d.rounds.length) {
            res.rounds.label = (discharged || saved.some(r => r.values && r.values.roundDate === today)) ? "Completed" : "In Progress";
            const counts = roundCounts(d);
            res.rounds.detail = "Physician " + counts.physician.count + "/" + ROUND_LIMIT + " · Nursing " + counts.nursing.count + "/" + ROUND_LIMIT + (drafts.length ? " · " + drafts.length + " draft" : "");
        }
        res.coordination = { label: "Not Started", detail: "No plan recorded" };
        if (d.coordination) {
            const out = arrangementsOutstanding(d.coordination);
            const done = !out.length && d.coordination.values && d.coordination.values.disposition;
            res.coordination = { label: done ? "Completed" : "In Progress", detail: out.length ? out.length + " outstanding" : "All arranged" };
        }
        const open = openActions(d);
        res.mdt = { label: "Not Started", detail: "No reviews recorded" };
        if (d.mdt.length) res.mdt = { label: open.length ? "In Progress" : "Completed", detail: d.mdt.length + " review" + (d.mdt.length > 1 ? "s" : "") + " · " + open.length + " open action" + (open.length === 1 ? "" : "s") };
        res.readiness = { label: "Not Started", detail: "No assessment recorded" };
        if (d.readiness.length) {
            const latest = d.readiness[d.readiness.length - 1], out = itemsOutstanding(latest);
            res.readiness = { label: (!out.length && latest.determination === READY) ? "Completed" : "In Progress", detail: out.length ? out.length + " outstanding" : (latest.determination === READY ? "Physician determined ready" : "Awaiting physician decision") };
        }
        res.discharge = { label: "Not Started", detail: "Not discharged" };
        if (d.discharge) res.discharge = d.discharge.status === "final" ? { label: "Completed", detail: "Finalised" } : { label: "In Progress", detail: "Draft" };
        return res;
    }

    function getCareSummary(patientId) {
        const bucket = careBucket(patientId, false);
        if (!bucket) return null;
        const d = bucket.data;
        return { encounterId: bucket.enc, roundCounts: roundCounts(d), rounds: d.rounds.filter(r => r.status === "saved").length, drafts: d.rounds.filter(r => r.status === "draft").length, openActions: openActions(d).length, reviews: d.mdt.length, assessments: d.readiness.length, discharge: d.discharge ? d.discharge.status : "none" };
    }

    function saveRound(patientId, input) {
        return mutate(patientId, (d, b) => {
            const at = input.at || new Date().toISOString(), values = input.values || {};
            const status = input.status === "saved" ? "saved" : "draft";
            if (d.discharge && d.discharge.status === "final") return { ok: false, error: "This encounter has been discharged; the record is closed." };
            let rec;
            if (input.id) {
                rec = d.rounds.find(r => r.id === input.id);
                if (!rec) return { ok: false, error: "Round not found." };
                if (rec.status === "saved") return { ok: false, error: "Saved rounds are part of the clinical record and cannot be overwritten." };
                if (rec.schema !== 2) return { ok: false, error: "This round was recorded in the earlier format and can no longer be edited." };
            } else {
                const type = ROUND_TYPE_KEYS.indexOf(input.type) >= 0 ? input.type : null;
                if (!type) return { ok: false, error: "Choose a round type before saving." };
                if (input.clientKey && d.rounds.some(r => r.clientKey === input.clientKey)) return { ok: false, duplicate: true, error: "This round has already been saved." };
                const count = d.rounds.filter(r => r.type === type).length;
                if (count >= ROUND_LIMIT) return { ok: false, limitReached: true, error: "Maximum of " + ROUND_LIMIT + " " + type + " rounds reached for this patient." };
                rec = { id: uid("round"), patientId, encounterId: b.enc, type, number: count + 1, schema: 2, clientKey: input.clientKey || "", createdAt: at, createdBy: input.author || "Doctor" };
                d.rounds.push(rec);
            }
            const role = rec.type === "nursing" ? "Nurse" : "Physician";
            rec.status = status;
            rec.values = Object.assign({}, values, { providerRole: role });
            rec.roundAt = (values.roundDate || "") + "T" + (values.roundTime || "00:00");
            rec.provider = values.providerName || input.author || "Doctor";
            rec.role = role;
            rec.updatedAt = at;
            rec.updatedBy = input.author || "Doctor";
            if (status === "saved") rec.savedAt = at;
            return { ok: true, record: clone(rec) };
        }, { strict: true });
    }

    function getRoundCounts(patientId) {
        const bucket = careBucket(patientId, false);
        return bucket ? roundCounts(bucket.data) : null;
    }

    function saveCoordination(patientId, input) {
        return mutate(patientId, (d, b) => {
            if (d.discharge && d.discharge.status === "final") return { ok: false, error: "This encounter has been discharged; the record is closed." };
            const at = input.at || new Date().toISOString();
            const rec = d.coordination || { patientId, encounterId: b.enc, createdAt: at, createdBy: input.author || "Doctor", log: [] };
            rec.values = input.values || {};
            rec.arrangements = input.arrangements || {};
            rec.updatedAt = at;
            rec.updatedBy = input.author || "Doctor";
            rec.log = (Array.isArray(rec.log) ? rec.log : []).concat({ at, by: rec.updatedBy, text: input.summary || "Coordination record updated" }).slice(-100);
            d.coordination = rec;
            return { ok: true, record: clone(rec) };
        });
    }

    function addMdt(patientId, input) {
        return mutate(patientId, (d, b) => {
            if (d.discharge && d.discharge.status === "final") return { ok: false, error: "This encounter has been discharged; the record is closed." };
            const at = input.at || new Date().toISOString(), author = input.author || "Doctor";
            const rec = {
                id: uid("mdt"), patientId, encounterId: b.enc, createdAt: at, author,
                reviewAt: (input.values && input.values.reviewAt) || at,
                values: input.values || {}, participants: input.participants || [],
                actions: (input.actions || []).map(a => Object.assign({}, a, { id: uid("act"), history: [{ at, by: author, status: a.status }] }))
            };
            d.mdt.push(rec);
            return { ok: true, record: clone(rec) };
        });
    }

    function updateMdtAction(patientId, reviewId, actionId, status, author, at) {
        if (ACTION_STATUSES.indexOf(status) < 0) return { ok: false, persisted: false, error: "Invalid status." };
        return mutate(patientId, d => {
            const review = d.mdt.find(r => r.id === reviewId);
            const action = review && (review.actions || []).find(a => a.id === actionId);
            if (!action) return { ok: false, error: "Action not found." };
            if (action.status === status) return { ok: true, unchanged: true };
            action.status = status;
            action.history = (Array.isArray(action.history) ? action.history : []).concat({ at: at || new Date().toISOString(), by: author || "Doctor", status });
            return { ok: true };
        });
    }

    function addReadiness(patientId, input) {
        return mutate(patientId, (d, b) => {
            if (d.discharge && d.discharge.status === "final") return { ok: false, error: "This encounter has been discharged; the record is closed." };
            const at = input.at || new Date().toISOString();
            const rec = {
                id: uid("ready"), patientId, encounterId: b.enc, createdAt: at, author: input.author || "Doctor",
                items: input.items || [], determination: DETERMINATIONS.indexOf(input.determination) >= 0 ? input.determination : DETERMINATIONS[0],
                reviewingPhysician: input.reviewingPhysician || "", reviewAt: input.reviewAt || at, summary: input.summary || ""
            };
            d.readiness.push(rec);
            return { ok: true, record: clone(rec) };
        });
    }

    function saveDischarge(patientId, input) {
        const finalize = !!input.finalize;
        const result = mutate(patientId, (d, b) => {
            if (d.discharge && d.discharge.status === "final") return { ok: false, duplicate: true, error: "A finalised discharge already exists for this encounter and cannot be submitted again." };
            const at = input.at || new Date().toISOString(), author = input.author || "Doctor";
            const rec = d.discharge || { patientId, encounterId: b.enc, createdAt: at, createdBy: author };
            rec.values = input.values || {};
            rec.meds = input.meds || [];
            rec.followUps = input.followUps || [];
            rec.status = finalize ? "final" : "draft";
            rec.updatedAt = at;
            rec.updatedBy = author;
            if (finalize) { rec.finalizedAt = at; rec.finalizedBy = author; rec.authorizedBy = rec.values.authPhysician || author; }
            d.discharge = rec;
            return { ok: true, finalized: finalize, record: clone(rec) };
        });
        if (result.ok && finalize) {
            const note = addNote(patientId, { type: "Discharge Record", text: "Discharge finalised. Authorised by " + (result.record.authorizedBy || "physician") + ". Encounter " + (careBucket(patientId, false).enc) + " closed.", author: input.author || "Doctor", createdAt: input.at || new Date().toISOString() });
            result.persisted = result.persisted && note.persisted;
        }
        return result;
    }

    load();

    return { STATUSES, ACUITIES, NOTE_TYPES, STORAGE_KEY, listPatients, getPatient, addNote, updateStatus, getWorkflow, saveWorkflow, ARRANGEMENTS, READINESS_ITEMS, ITEM_STATUSES, ACTION_STATUSES, DETERMINATIONS, READY_DETERMINATION: READY, getCare, getCareSummary, getRoundCounts, ROUND_LIMIT, ROUND_TYPE_KEYS, getStageStatuses, openActions, itemsOutstanding, arrangementsOutstanding, saveRound, saveCoordination, addMdt, updateMdtAction, addReadiness, saveDischarge, isPersistent: () => persistent };
})();
