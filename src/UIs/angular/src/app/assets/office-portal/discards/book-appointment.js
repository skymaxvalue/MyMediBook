// Existing navigation logic
function goToAvailability() {
    window.location.href = "availability.html";
}

// Search filter
function filterDoctors() {

    const keyword = document
        .getElementById("searchDoctor")
        .value
        .toLowerCase()
        .trim();

    const cards = document.querySelectorAll(".doctor-card");

    cards.forEach(card => {

        const name = card.dataset.name.toLowerCase();
        const dept = card.dataset.dept.toLowerCase();

        if (
            name.includes(keyword) ||
            dept.includes(keyword)
        ) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }

    });

}

// Live search while typing
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchDoctor");

    input.addEventListener("keyup", filterDoctors);

});