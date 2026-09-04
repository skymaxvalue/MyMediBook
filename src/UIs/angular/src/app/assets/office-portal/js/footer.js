document.addEventListener("DOMContentLoaded", () => {

    const footerContainer =
    document.getElementById("footer-container");

    if (!footerContainer) return;

    fetch("footer.html")
    .then(res => res.text())
    .then(data => {
        footerContainer.innerHTML = data;
    });

});