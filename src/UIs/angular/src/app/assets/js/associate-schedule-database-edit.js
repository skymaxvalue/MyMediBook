const STORAGE_KEY = "associateScheduleDatabaseRows";
const SELECTED_KEY = "associateScheduleSelected";

const defaultRecord = {
    index: 0,
    name: "Kumar Sekhar",
    dept: "Physician",
    role: "Doctor",
    spec: "ED",
    from: "2026-04-24",
    to: "2026-05-24",
    fromTime: "10:00 AM",
    toTime: "10:00 PM",
    days: ["Mon", "Tue", "Thu", "Fri"],
    breakFrom: "02:00 PM",
    breakTo: "06:00 PM",
    duration: "30 Minutes",
    charge: "600Rs",
    time: "64 Hours",
    deptId: "10",
    deptName: "Physician",
    roleDeptId: "10",
    roleId: "2",
    roleName: "Physical Examiner"
};

const state = loadSelected();

const editForm = document.getElementById("editForm");
const nameDisplay = document.getElementById("nameDisplay");
const departmentInput = document.getElementById("department");
const roleInput = document.getElementById("role");
const specialityInput = document.getElementById("speciality");
const fromDateInput = document.getElementById("fromDate");
const toDateInput = document.getElementById("toDate");
const fromTimeSelect = document.getElementById("fromTime");
const toTimeSelect = document.getElementById("toTime");
const breakFromSelect = document.getElementById("breakFrom");
const breakToSelect = document.getElementById("breakTo");
const consultationDurationInput = document.getElementById("consultationDuration");
const chargeInput = document.getElementById("charge");
const backBtn = document.getElementById("backBtn");
const saveBtn = document.getElementById("saveBtn");

const dayPills = Array.from(document.querySelectorAll(".day-pill"));
const modalButtons = Array.from(document.querySelectorAll("[data-open-modal]"));
const focusButtons = Array.from(document.querySelectorAll("[data-focus-target]"));
const daysEditBtn = document.getElementById("daysEditBtn");

const departmentModal = document.getElementById("departmentModal");
const roleModal = document.getElementById("roleModal");
const deptIdDropdown = document.getElementById('deptIdDropdown');
const deptNameField = document.getElementById('deptNameField');
const deptConfirmBtn = document.getElementById('deptConfirmBtn');
const roleDeptIdSelect = document.getElementById('roleDeptIdSelect');
const roleIdDropdown = document.getElementById('roleIdDropdown');
const roleNameField = document.getElementById('roleNameField');
const roleConfirmBtn = document.getElementById('roleConfirmBtn');


const deptMap = {
    '10': 'Physician',
    '11': 'Cardiology',
    '12': 'Neurology',
    '13': 'Orthopedics',
    '14': 'Pediatrics'
};


const roleData = {
    '10': { '1': 'General Physician', '2': 'Physical Examiner', '3': 'Senior Doctor' },
    '11': { '21': 'Cardiologist', '22': 'Echo Specialist' },
    '12': { '31': 'Neurologist', '32': 'Neurosurgeon' },
    '13': { '41': 'Orthopedic Surgeon', '42': 'Trauma Specialist' },
    '14': { '51': 'Pediatrician', '52': 'Neonatologist' }
};

populateForm();
bindEvents();

function loadSelected() {
    const params = new URLSearchParams(window.location.search);
    const indexParam = params.get("index");

    try {
        const rows = loadRows();
        if (indexParam !== null && rows[Number(indexParam)]) {
            return { ...defaultRecord, ...rows[Number(indexParam)], index: Number(indexParam) };
        }
        const saved = JSON.parse(localStorage.getItem(SELECTED_KEY) || "null");
        if (saved && typeof saved === "object") return { ...defaultRecord, ...saved };
    } catch {
       
    }
    return { ...defaultRecord };
}

function populateForm() {
    nameDisplay.textContent = state.name || "";
    departmentInput.value = state.dept || "";
    roleInput.value = state.role || "";
    specialityInput.value = state.spec || "";
    fromDateInput.value = state.from || "";
    toDateInput.value = state.to || "";
    fromTimeSelect.value = state.fromTime || fromTimeSelect.value;
    toTimeSelect.value = state.toTime || toTimeSelect.value;
    breakFromSelect.value = state.breakFrom || breakFromSelect.value;
    breakToSelect.value = state.breakTo || breakToSelect.value;
    consultationDurationInput.value = state.duration || "";
    chargeInput.value = state.charge || "";

    const selectedDays = new Set(state.days || []);
    dayPills.forEach(pill => {
        const label = pill.querySelector("span")?.textContent?.trim();
        pill.classList.toggle("active", selectedDays.has(label));
        pill.querySelector("input").checked = selectedDays.has(label);
    });
}

function bindEvents() {
    modalButtons.forEach(button => {
        button.addEventListener("click", () => openModal(button.dataset.openModal));
    });

    focusButtons.forEach(button => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.focusTarget);
            if (!target) return;
            unlockField(target);
            if (typeof target.showPicker === "function") {
                target.showPicker();
            } else {
                target.focus();
            }
        });
    });

    if (daysEditBtn) {
        daysEditBtn.addEventListener("click", () => unlockDays());
    }

    dayPills.forEach(pill => {
        pill.addEventListener("click", () => {
            if (pill.classList.contains("locked")) return;
            const input = pill.querySelector("input");
            input.checked = !input.checked;
            pill.classList.toggle("active", input.checked);
        });
    });

    backBtn.addEventListener("click", () => {
        window.location.href = "associate-schedule-database.html";
    });

    saveBtn.addEventListener("click", saveChanges);

    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => closeModal(button.dataset.closeModal));
    });

    departmentModal.addEventListener("click", event => {
        if (event.target === departmentModal) closeModal("departmentModal");
    });

    roleModal.addEventListener("click", event => {
        if (event.target === roleModal) closeModal("roleModal");
    });

  
    deptIdDropdown.addEventListener('change', updateDepartmentName);
    deptConfirmBtn.addEventListener('click', () => {
        const newDeptId = deptIdDropdown.value;
        const newDeptName = deptNameField.value;
        departmentInput.value = newDeptName;
        state.dept = newDeptName;
        state.deptId = newDeptId;
        state.deptName = newDeptName;
        closeModal('departmentModal');
    });

    roleDeptIdSelect.addEventListener('change', () => populateRoleIdDropdown());
    roleIdDropdown.addEventListener('change', updateRoleName);
    roleConfirmBtn.addEventListener('click', () => {
        const newRoleId = roleIdDropdown.value;
        const newRoleName = roleNameField.value;
        const newDeptId = roleDeptIdSelect.value;
        roleInput.value = newRoleName;
        state.role = newRoleName;
        state.roleId = newRoleId;
        state.roleName = newRoleName;
        state.roleDeptId = newDeptId;
        closeModal('roleModal');
    });

    editForm.addEventListener("submit", event => {
        event.preventDefault();
        saveChanges();
    });
}

function updateDepartmentName() {
    const selectedId = deptIdDropdown.value;
    deptNameField.value = deptMap[selectedId] || '';
}

function populateRoleIdDropdown() {
    const selectedDeptId = roleDeptIdSelect.value;
    const roles = roleData[selectedDeptId] || {};
    roleIdDropdown.innerHTML = '';
    for (const [roleId, roleName] of Object.entries(roles)) {
        const option = document.createElement('option');
        option.value = roleId;
        option.textContent = `${roleId}`; 
        roleIdDropdown.appendChild(option);
    }
    updateRoleName();
}

function updateRoleName() {
    const selectedDeptId = roleDeptIdSelect.value;
    const selectedRoleId = roleIdDropdown.value;
    const roleName = (roleData[selectedDeptId] || {})[selectedRoleId] || '';
    roleNameField.value = roleName;
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    if (id === 'departmentModal') {
        // Prefill with current state
        const currentDeptId = state.deptId || '10';
        deptIdDropdown.value = currentDeptId;
        updateDepartmentName();
    }
    if (id === 'roleModal') {
        const currentDeptId = state.roleDeptId || '10';
        roleDeptIdSelect.value = currentDeptId;
        populateRoleIdDropdown();
        const currentRoleId = state.roleId || '2';
        if (roleIdDropdown.querySelector(`option[value="${currentRoleId}"]`)) {
            roleIdDropdown.value = currentRoleId;
        }
        updateRoleName();
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    }
}

function unlockField(target) {
    if (target.matches("input, select, textarea")) {
        target.disabled = false;
        target.removeAttribute("disabled");
        target.removeAttribute("readonly");
    }
    if (target.id === "fromDate" || target.id === "toDate") {
        target.type = "date";
    }
}

function unlockDays() {
    dayPills.forEach(pill => {
        pill.classList.remove("locked");
        const input = pill.querySelector("input");
        input.disabled = false;
    });
}

function saveChanges() {
    const rows = loadRows();
    const index = Number(state.index || 0);
    const days = dayPills
        .filter(pill => pill.classList.contains("active"))
        .map(pill => pill.querySelector("span").textContent.trim());

    const updated = {
        name: state.name,
        dept: departmentInput.value.trim(),
        role: roleInput.value.trim(),
        spec: specialityInput.value.trim(),
        from: fromDateInput.value,
        to: toDateInput.value,
        fromTime: fromTimeSelect.value,
        toTime: toTimeSelect.value,
        breakFrom: breakFromSelect.value,
        breakTo: breakToSelect.value,
        duration: consultationDurationInput.value.trim(),
        charge: chargeInput.value.trim(),
        days,
        deptId: state.deptId,
        deptName: state.deptName,
        roleDeptId: state.roleDeptId,
        roleId: state.roleId,
        roleName: state.roleName
    };

    if (rows[index]) {
        rows[index] = {
            ...rows[index],
            ...updated,
            time: state.time || rows[index].time || "64 Hours"
        };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    localStorage.setItem(SELECTED_KEY, JSON.stringify({ ...state, ...updated }));
    window.location.href = "associate-schedule-database.html";
}

function loadRows() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (Array.isArray(saved) && saved.length) return saved;
    } catch {
     
    }
    return [
        { name: "Kumar Sekhar", dept: "Physician", spec: "EP", from: "2026-04-24", to: "2026-05-24", time: "64 Hours", deptId: "10", deptName: "Physician" },
        { name: "Julia Doe", dept: "Neurology", spec: "Epilepsy", from: "2026-04-24", to: "2026-05-24", time: "90 Hours", deptId: "12", deptName: "Neurology" },
        { name: "Sunny Side", dept: "Orthopedics", spec: "Spine Surgery", from: "2026-04-24", to: "2026-05-24", time: "120 Hours", deptId: "13", deptName: "Orthopedics" },
        { name: "Rohit Sans", dept: "Pediatrics", spec: "Neonatology", from: "2026-04-24", to: "2026-05-24", time: "60 Hours", deptId: "14", deptName: "Pediatrics" }
    ];
}










