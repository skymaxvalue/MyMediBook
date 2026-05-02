 (function() {
    const STORAGE_KEY = "associateScheduleDatabaseRows";
    const DEFAULT_ROWS = [
        { name: "Kumar Sekhar", dept: "Cardiology", spec: "EP", from: "2026-04-24", to: "2026-05-24", time: "64 Hours" },
        { name: "Julia Doe", dept: "Neurology", spec: "Epilepsy", from: "2026-04-24", to: "2026-05-24", time: "90 Hours" },
        { name: "Sunny Side", dept: "Orthopedics", spec: "Spine Surgery", from: "2026-04-24", to: "2026-05-24", time: "120 Hours" },
        { name: "Rohit Sans", dept: "Pediatrics", spec: "Neonatology", from: "2026-04-24", to: "2026-05-24", time: "60 Hours" }
    ];

    function ensureIds(rows) {
      rows.forEach(row => { if (!row.id) row.id = Date.now() + Math.random(); });
      return rows;
    }

    function loadRows() {
        let rows;
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            rows = Array.isArray(saved) && saved.length ? saved : [...DEFAULT_ROWS];
        } catch {
            rows = [...DEFAULT_ROWS];
        }
        return ensureIds(rows);
    }

    function saveRows(rows) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    }

    let masterRows = loadRows();
    let sortDirection = {}; 

    
    function sortTable(columnIndex) {
        
        if (sortDirection[columnIndex] === undefined) {
            sortDirection[columnIndex] = false; 
        } else {
            sortDirection[columnIndex] = !sortDirection[columnIndex];
        }
        const isAsc = sortDirection[columnIndex];

        masterRows.sort((a, b) => {
            let valA, valB;
            switch(columnIndex) {
                case 0: valA = a.name; valB = b.name; break;
                case 1: valA = a.dept; valB = b.dept; break;
                case 2: valA = a.spec; valB = b.spec; break;
                case 3: valA = a.from; valB = b.from; break;
                case 4: valA = a.to; valB = b.to; break;
                case 5: valA = a.time; valB = b.time; break;
                default: return 0;
            }
            // Date columns
            if (columnIndex === 3 || columnIndex === 4) {
                valA = new Date(valA);
                valB = new Date(valB);
            }
          
            else if (columnIndex === 5) {
                valA = parseInt(valA, 10) || 0;
                valB = parseInt(valB, 10) || 0;
            }
           
            else {
                valA = (valA || "").toLowerCase();
                valB = (valB || "").toLowerCase();
            }
            if (valA < valB) return isAsc ? -1 : 1;
            if (valA > valB) return isAsc ? 1 : -1;
            return 0;
        });

        renderTable();

    
        const headers = document.querySelectorAll(".associate-table thead th");
        headers.forEach((th, idx) => {
            const icon = th.querySelector(".sort-icon");
            if (icon && idx !== 6) { 
                if (idx === columnIndex) {
                    icon.innerText = isAsc ? "▲" : "▼";
                } else {
                    icon.innerText = "▼";
                }
            }
        });
    }

    function renderTable() {
        saveRows(masterRows);
        const tbody = document.getElementById("table-body");
        tbody.innerHTML = masterRows.map((row, idx) => `
            <tr>
                <td>${escapeHtml(row.name)}</td>
                <td>${escapeHtml(row.dept)}</td>
                <td>${escapeHtml(row.spec)}</td>
                <td>${escapeHtml(row.from)}</td>
                <td>${escapeHtml(row.to)}</td>
                <td>${escapeHtml(row.time)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" type="button" data-edit-index="${idx}">
                            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                                <path d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                                <path d="M14.5 5.5 18 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            </svg>
                            <span>Edit</span>
                        </button>
                        <button class="action-btn delete" type="button" data-delete-index="${idx}">
                            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            </svg>
                            <span>Delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

   
    let deleteIndex = null;
    const modal = document.getElementById("deleteModal");
    const deleteText = document.getElementById("deleteText");
    const confirmBtn = document.getElementById("confirmDelete");
    const cancelBtn = document.getElementById("cancelDelete");

    function handleTableActions() {
        const tbody = document.getElementById("table-body");
        tbody.addEventListener("click", (event) => {
            const editButton = event.target.closest("[data-edit-index]");
            const deleteButton = event.target.closest("[data-delete-index]");

            if (editButton) {
                const idx = Number(editButton.dataset.editIndex);
                const selected = masterRows[idx];
                if (selected) {
                    localStorage.setItem("associateScheduleSelected", JSON.stringify({ ...selected, index: idx }));
                    window.location.href = "associate-schedule-database-edit.html?index=" + idx;
                }
            }

            if (deleteButton) {
                deleteIndex = Number(deleteButton.dataset.deleteIndex);
                const item = masterRows[deleteIndex];
                if (item) {
                    deleteText.textContent = `Delete ${item.name}?`;
                    modal.classList.remove("hidden");
                }
            }
        });
    }

    confirmBtn.addEventListener("click", () => {
        if (deleteIndex !== null && deleteIndex >= 0 && deleteIndex < masterRows.length) {
            masterRows.splice(deleteIndex, 1);
            renderTable();
            
            const headers = document.querySelectorAll(".associate-table thead th");
            headers.forEach(th => {
                const icon = th.querySelector(".sort-icon");
                if (icon) icon.innerText = "▼";
            });
            sortDirection = {};
        }
        modal.classList.add("hidden");
        deleteIndex = null;
    });

    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        deleteIndex = null;
    });

    
    function attachSortListeners() {
        const sortableHeaders = document.querySelectorAll(".associate-table thead th[data-sort]");
        sortableHeaders.forEach(header => {
            header.addEventListener("click", (e) => {
                const colIndex = parseInt(header.getAttribute("data-sort"), 10);
                if (!isNaN(colIndex)) {
                    sortTable(colIndex);
                }
            });
        });
    }

    
    renderTable();
    attachSortListeners();
    handleTableActions();
  })();