    document.addEventListener("DOMContentLoaded", () => {

    const stepperTabs = document.querySelectorAll(".step-tab");
    const sections = document.querySelectorAll(".form-section");
    const backButtons = {
        personal: document.getElementById("backFromPersonal"),
        qualification: document.getElementById("backFromQual"),
        experience: document.getElementById("backFromExp"),
        employment: document.getElementById("backFromEmp")
    };
    const saveButtons = {
        personal: document.getElementById("savePersonalBtn"),
        qualification: document.getElementById("saveQualBtn"),
        experience: document.getElementById("saveExpBtn"),
        employment: document.getElementById("saveEmpBtn")
    };
    const pencilButtons = document.querySelectorAll(".pencil-edit-btn");


    const langContainer = document.getElementById("languageTagsContainer");
    const addLangSelect = document.getElementById("addLanguageSelect");
    const addLangBtn = document.getElementById("addLanguageBtn");

    let currentSection = 0;


    function lockSection(sectionElement) {
        if (!sectionElement) return;
        const controls = sectionElement.querySelectorAll("input, select, textarea");
        controls.forEach(control => {
     
            if (control.type !== "file") {
                control.disabled = true;
            }
        });
      
        if (sectionElement.id === "section-0") {
            if (addLangSelect) addLangSelect.disabled = true;
            if (addLangBtn) addLangBtn.disabled = true;
        }
    }

   
    function unlockSection(sectionElement) {
        if (!sectionElement) return;
        const controls = sectionElement.querySelectorAll("input, select, textarea");
        controls.forEach(control => {
            if (control.type !== "file") {
                control.disabled = false;
            }
        });

        if (sectionElement.id === "section-0") {
            if (addLangSelect) addLangSelect.disabled = false;
            if (addLangBtn) addLangBtn.disabled = false;
        }
    }


    function lockAllSections() {
        sections.forEach(section => lockSection(section));
    }

  
    function showSection(index) {
        sections.forEach((section, i) => {
            section.classList.toggle("active-section", i === index);
        });
        stepperTabs.forEach((tab, i) => {
            tab.classList.toggle("active", i === index);
        });
        currentSection = index;
    }


    stepperTabs.forEach((tab, idx) => {
        tab.addEventListener("click", () => {
            showSection(idx);
        });
    });

    if (backButtons.personal) {
        backButtons.personal.addEventListener("click", () => {
            if (currentSection > 0) showSection(currentSection - 1);
        });
    }
    if (backButtons.qualification) {
        backButtons.qualification.addEventListener("click", () => {
            if (currentSection > 0) showSection(currentSection - 1);
            else showSection(0);
        });
    }
    if (backButtons.experience) {
        backButtons.experience.addEventListener("click", () => {
            if (currentSection > 0) showSection(currentSection - 1);
            else showSection(0);
        });
    }
    if (backButtons.employment) {
        backButtons.employment.addEventListener("click", () => {
            if (currentSection > 0) showSection(currentSection - 1);
            else showSection(0);
        });
    }

  
    pencilButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
           
            let parentSection = btn.closest(".form-section");
            if (!parentSection) {
                
                parentSection = btn.closest(".form-section");
            }
            if (!parentSection) {
                console.warn("Could not find parent section for edit button");
                return;
            }
          
            unlockSection(parentSection);
            
            const firstInput = parentSection.querySelector("input:not([disabled]), select:not([disabled]), textarea:not([disabled])");
            if (firstInput) firstInput.focus();
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-pencil-alt"></i> Editing...';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 800);
        });
    });

   
    function attachSaveHandler(saveBtn, sectionId) {
        if (!saveBtn) return;
        saveBtn.addEventListener("click", () => {
            const sectionElem = document.getElementById(sectionId);
            if (!sectionElem) return;
           
            const data = {};
            const inputs = sectionElem.querySelectorAll("input:not([type='file']), select, textarea");
            inputs.forEach(field => {
                let key = field.placeholder || field.name || field.id || "field";
                if (key === "field" && field.labels && field.labels.length) key = field.labels[0].innerText;
                data[key] = field.value;
            });
            console.log(`Saved ${sectionId}:`, data);
            
            lockSection(sectionElem);
        });
    }

    attachSaveHandler(saveButtons.personal, "section-0");
    attachSaveHandler(saveButtons.qualification, "section-1");
    attachSaveHandler(saveButtons.experience, "section-2");
    attachSaveHandler(saveButtons.employment, "section-3");

    
    function createLangTag(language) {
        const span = document.createElement("span");
        span.className = "lang-tag";
        span.innerHTML = `${language} <i class="fas fa-times-circle remove-lang" data-lang="${language}"></i>`;
        const removeIcon = span.querySelector(".remove-lang");
        removeIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            span.remove();
        });
        return span;
    }

    function initLanguageTags() {
        const existingTags = langContainer.querySelectorAll(".lang-tag");
        existingTags.forEach(tag => {
            const removeIcon = tag.querySelector(".remove-lang");
            if (removeIcon) {
               
                const newRemove = removeIcon.cloneNode(true);
                removeIcon.parentNode.replaceChild(newRemove, removeIcon);
                newRemove.addEventListener("click", (e) => {
                    e.stopPropagation();
                    tag.remove();
                });
            }
        });
    }

    function addLanguage() {
        const selectedLang = addLangSelect.value;
        if (!selectedLang) return;
        const existing = Array.from(langContainer.querySelectorAll(".lang-tag")).some(tag => 
            tag.innerText.replace(/[×✗✘]/g, '').trim().toLowerCase() === selectedLang.toLowerCase()
        );
        if (existing) return;
        const newTag = createLangTag(selectedLang);
        langContainer.appendChild(newTag);
        addLangSelect.selectedIndex = 0;
    }

    if (addLangBtn) {
        addLangBtn.addEventListener("click", addLanguage);
    }
    if (addLangSelect) {
        addLangSelect.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addLanguage();
            }
        });
    }

    initLanguageTags();

   
    lockAllSections();
    
    const personalSection = document.getElementById("section-0");
    if (personalSection && addLangSelect && addLangBtn) {
        
        const anyFieldDisabled = personalSection.querySelector("input:not([type='file'])")?.disabled === true;
        if (anyFieldDisabled) {
            addLangSelect.disabled = true;
            addLangBtn.disabled = true;
        } else {
            addLangSelect.disabled = false;
            addLangBtn.disabled = false;
        }
    }

    
    showSection(0);
});