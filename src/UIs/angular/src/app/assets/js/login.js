
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "dashboard.html";
}

const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");

// PASSWORD TOGGLE
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        toggle.src = "images/hide.png";
    } else {
        password.type = "password";
        toggle.src = "images/show.png";
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = username.value.trim();
    const pass = password.value.trim();

    if (user === "" || pass === "") {
        alert("Please fill all fields");
        return;
    }

    if (user === "admin" && pass === "1234") {

        // Save user temporarily
        localStorage.setItem("pendingUser", user);

        // Go to OTP page
        window.location.href = "login-otp.html";

    } else {
        alert("Invalid username or password");
    }
});