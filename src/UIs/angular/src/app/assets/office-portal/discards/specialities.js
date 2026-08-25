function goToAvailability() {
    window.location.href = "availability.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("doctorSearch");
    const searchBtn = document.getElementById("searchDoctorBtn");
    const resultsWrapper = document.getElementById("specialityResults");

    if (!searchInput || !resultsWrapper) return;

    function filterDoctors() {
        const query = searchInput.value.trim().toLowerCase();
        const categories = resultsWrapper.querySelectorAll(".category");

        categories.forEach(function (category) {
            let visibleCount = 0;
            let node = category.nextElementSibling;

            while (node && !node.classList.contains("category")) {
                if (node.classList.contains("doctor-card")) {
                    const text = node.innerText.toLowerCase();
                    const isMatch = query === "" || text.includes(query);
                    node.style.display = isMatch ? "" : "none";
                    if (isMatch) visibleCount++;
                }
                node = node.nextElementSibling;
            }

            category.style.display = visibleCount > 0 ? "" : "none";
        });
    }

    searchInput.addEventListener("input", filterDoctors);

    if (searchBtn) {
        searchBtn.addEventListener("click", function (e) {
            e.preventDefault();
            filterDoctors();
        });
    }

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            filterDoctors();
        }
    });
});
