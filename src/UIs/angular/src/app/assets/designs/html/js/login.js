// FORM
const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        toggle.src = "images/hide.png"; // switch icon
    } else {
        password.type = "password";
        toggle.src = "images/show.png"; // switch back
    }
});
// FORM SUBMIT
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = username.value.trim();
    const pass = password.value.trim();

    if (user === "" || pass === "") {
        alert("Please fill all fields");
        return;
    }

    // SUCCESS LOGIN (no OTP as per flow)
    alert("Login successful!");

    // redirect (you can change later)
    window.location.href = "dashboard.html";
});