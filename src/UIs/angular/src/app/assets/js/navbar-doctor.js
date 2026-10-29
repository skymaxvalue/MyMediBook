(() => {
    const container = document.getElementById("navbar-container");
    if (!container) return;

    fetch("components/navbar-doctor.html")
        .then(response => {
            if (!response.ok) throw new Error("Unable to load the doctor navbar.");
            return response.text();
        })
        .then(markup => {
            container.innerHTML = markup;
            document.dispatchEvent(new Event("doctorNavbarReady"));
        })
        .catch(error => {
            console.error(error);
        });
})();
