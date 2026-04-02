const nextBtns = document.querySelectorAll(".next");
const backBtns = document.querySelectorAll(".back");
const steps = document.querySelectorAll(".step");
const tabs = document.querySelectorAll(".tab");

let currentStep = 0;

// show step
function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    tabs.forEach(tab => tab.classList.remove("active"));

    steps[index].classList.add("active");
    tabs[index].classList.add("active");
}

// next
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

// back
backBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});