
document.addEventListener("DOMContentLoaded", function () {
    // ----- DOM elements -----
    const steps = document.querySelectorAll(".step");
    const tabs = document.querySelectorAll(".tab");
    const nextBtn = document.getElementById("nextBtn");
    let currentStep = 0;


    const input = document.querySelector("#phone");
    const countrySelect = document.getElementById("country");
    const stateSelect = document.getElementById("state");

    const statesData = {
        India: ["West Bengal", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu"],
        USA: ["California", "Texas", "Florida", "New York"],
        UK: ["England", "Scotland", "Wales", "Northern Ireland"],
        Australia: ["New South Wales", "Victoria", "Queensland"],
        Canada: ["Ontario", "Quebec", "British Columbia"],
        Germany: ["Bavaria", "Berlin", "Hamburg"],
        France: ["Île-de-France", "Provence", "Normandy"],
        UAE: ["Dubai", "Abu Dhabi"],
        Japan: ["Tokyo", "Osaka"],
        Brazil: ["São Paulo", "Rio de Janeiro"]
    };

    const countryMap = {
        in: "India", us: "USA", gb: "UK", au: "Australia", ca: "Canada",
        de: "Germany", fr: "France", it: "Italy", es: "Spain", nl: "Netherlands",
        sg: "Singapore", ae: "UAE", sa: "Saudi Arabia", jp: "Japan",
        kr: "South Korea", cn: "China", br: "Brazil", za: "South Africa"
    };

    function updateStates(country) {
        stateSelect.innerHTML = '<option value="" disabled selected>Select state</option>';
        if (!statesData[country]) return;
        statesData[country].forEach(state => {
            const option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }

    function setCountryDropdown(mappedCountry) {
        const options = countrySelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === mappedCountry) {
                countrySelect.selectedIndex = i;
                updateStates(mappedCountry);
                break;
            }
        }
    }

    const iti = window.intlTelInput(input, {
        initialCountry: "in",
        separateDialCode: true,
        preferredCountries: ["in", "us", "gb"]
    });


    input.addEventListener("countrychange", function () {
        const countryData = iti.getSelectedCountryData();
        const mappedCountry = countryMap[countryData.iso2];
        if (mappedCountry) setCountryDropdown(mappedCountry);
    });


    countrySelect.addEventListener("change", function () {
        updateStates(this.value);
    });


    const initialCountry = iti.getSelectedCountryData();
    const initialMapped = countryMap[initialCountry.iso2];
    if (initialMapped) setCountryDropdown(initialMapped);


    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });
        tabs.forEach((tab, i) => {
            tab.classList.remove("active", "completed");
            if (i < index) tab.classList.add("completed");
            else if (i === index) tab.classList.add("active");
        });
        currentStep = index;


        const nextBtn = document.getElementById("nextBtn");
        if (currentStep === steps.length - 1) {
            nextBtn.textContent = "Submit";
        } else {
            nextBtn.textContent = "Save and Next";
        }
    }

    window.nextStep = function () {
        const currentStepElement = steps[currentStep];
        const inputs = currentStepElement.querySelectorAll("input, select");
        for (let input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return;
            }
        }
        if (currentStep === steps.length - 1) {
            alert("Form Submitted Successfully!");
            window.location.href = "login.html";
            return;
        }
        showStep(currentStep + 1);
    };

    window.prevStep = function () {
        if (currentStep === 0) {
            window.location.href = "login.html";
        } else {
            showStep(currentStep - 1);
        }
    };

  
    showStep(0);
});