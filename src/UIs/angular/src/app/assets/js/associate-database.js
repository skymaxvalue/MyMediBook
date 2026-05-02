
        let associateData = [
            { id: 1, firstName: "Kumar", lastName: "Sekhar", dob: "1980-10-12", role: "Doctor", speciality: "Cardiology", joiningDate: "2026-04-24" },
            { id: 2, firstName: "Julia", lastName: "Doe", dob: "1999-05-12", role: "Nurse", speciality: "General", joiningDate: "2026-05-22" },
            { id: 3, firstName: "Sunny", lastName: "Side", dob: "1996-01-12", role: "Doctor", speciality: "Pediatrician", joiningDate: "2025-12-24" },
            { id: 4, firstName: "Rohit", lastName: "Sans", dob: "1980-10-12", role: "Surgeon", speciality: "Orthopedics", joiningDate: "2026-01-12" }
        ];

        let sortDirection = {};

        const tbody = document.getElementById("tableBody");
        const modal = document.getElementById("deleteModal");
        const deleteTextSpan = document.getElementById("deleteText");
        const confirmBtn = document.getElementById("confirmDelete");
        const cancelBtn = document.getElementById("cancelDelete");

        let pendingDeleteId = null;


        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function renderTable() {
            tbody.innerHTML = associateData.map(associate => `
                <tr data-id="${associate.id}">
                    <td>${escapeHtml(associate.firstName)}</td>
                    <td>${escapeHtml(associate.lastName)}</td>
                    <td>${escapeHtml(associate.dob)}</td>
                    <td>${escapeHtml(associate.role)}</td>
                    <td>${escapeHtml(associate.speciality)}</td>
                    <td>${escapeHtml(associate.joiningDate)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn--edit" data-action="edit" data-id="${associate.id}">
                                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                                    <path d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                                    <path d="M14.5 5.5 18 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                </svg>
                                <span>Edit</span>
                            </button>
                            <button class="btn btn--delete" data-action="delete" data-id="${associate.id}">
                                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                </svg>
                                <span>Delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

      
        function sortTable(columnIndex) {
           
            if (sortDirection[columnIndex] === undefined) {
                sortDirection[columnIndex] = false; 
            } else {
                sortDirection[columnIndex] = !sortDirection[columnIndex];
            }
            const isAsc = sortDirection[columnIndex];

            associateData.sort((a, b) => {
                let valA, valB;
                switch(columnIndex) {
                    case 0: valA = a.firstName; valB = b.firstName; break;
                    case 1: valA = a.lastName; valB = b.lastName; break;
                    case 2: valA = a.dob; valB = b.dob; break;
                    case 3: valA = a.role; valB = b.role; break;
                    case 4: valA = a.speciality; valB = b.speciality; break;
                    case 5: valA = a.joiningDate; valB = b.joiningDate; break;
                    default: return 0;
                }

              
                if (columnIndex === 2 || columnIndex === 5) {
                    valA = new Date(valA);
                    valB = new Date(valB);
                } else {
       
                    valA = (valA || "").toLowerCase();
                    valB = (valB || "").toLowerCase();
                }

                if (valA < valB) return isAsc ? -1 : 1;
                if (valA > valB) return isAsc ? 1 : -1;
                return 0;
            });

            renderTable();
            updateSortIcons(columnIndex, isAsc);
        }


        function updateSortIcons(activeColumn, isAsc) {
            const headers = document.querySelectorAll(".data-table thead th[data-sort]");
            headers.forEach((th, idx) => {
                const icon = th.querySelector(".sort-icon");
                if (icon) {
                    if (idx === activeColumn) {
                        icon.innerText = isAsc ? "▲" : "▼";
                    } else {
                        icon.innerText = "▼";
                    }
                }
            });
        }

       
        function attachSortListeners() {
            const sortableHeaders = document.querySelectorAll(".data-table thead th[data-sort]");
            sortableHeaders.forEach(header => {
                header.addEventListener("click", (e) => {
                    const colIndex = parseInt(header.getAttribute("data-sort"), 10);
                    if (!isNaN(colIndex)) {
                        sortTable(colIndex);
                    }
                });
            });
        }


        function attachActionListeners() {
            tbody.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-action]");
                if (!btn) return;

                const action = btn.getAttribute("data-action");
                const id = parseInt(btn.getAttribute("data-id"));

                if (action === "edit") {
                    const associate = associateData.find(a => a.id === id);
                    if (associate) {
                    
                        localStorage.setItem("associateToEdit", JSON.stringify(associate));
                  
                        window.location.href = "associate-database-edit.html";
                    }
                
                } else if (action === "delete") {
                    const associate = associateData.find(a => a.id === id);
                    if (associate) {
                        deleteTextSpan.innerText = `Delete ${associate.firstName} ${associate.lastName}?`;
                        pendingDeleteId = id;
                        modal.classList.remove("modal--hidden");
                    }
                }
            });
        }

        function setupModal() {
            confirmBtn.addEventListener("click", () => {
                if (pendingDeleteId !== null) {
                    associateData = associateData.filter(a => a.id !== pendingDeleteId);
           
                    sortDirection = {};
                    const headers = document.querySelectorAll(".data-table thead th");
                    headers.forEach(th => {
                        const icon = th.querySelector(".sort-icon");
                        if (icon) icon.innerText = "▼";
                    });
                    renderTable();
                    pendingDeleteId = null;
                }
                modal.classList.add("modal--hidden");
            });

            cancelBtn.addEventListener("click", () => {
                modal.classList.add("modal--hidden");
                pendingDeleteId = null;
            });

            
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    modal.classList.add("modal--hidden");
                    pendingDeleteId = null;
                }
            });
        }

        function init() {
            renderTable();
            attachSortListeners();
            attachActionListeners();
            setupModal();
        }

        init();


        
