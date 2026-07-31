// Front Office Login JS

const username = document.getElementById("user");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const toggleBtn = document.getElementById("toggle");

// Toggle Password Visibility
toggleBtn.addEventListener("click", () => {

    const icon = toggleBtn.querySelector("img");

    if (password.type === "password") {

        password.type = "text";

        // Replace with eye-off icon if available
        // icon.src = "images/eye-off.png";

    } else {

        password.type = "password";

        // icon.src = "images/eye.png";

    }

});

// Login Validation
function login() {

    const user = username.value.trim();
    const pass = password.value.trim();

    if (user === "") {

        alert("Please enter Employee ID");
        username.focus();
        return;

    }

    if (pass === "") {

        alert("Please enter Password");
        password.focus();
        return;

    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Signing In...";

    // Demo Loading
    setTimeout(() => {

        loginBtn.disabled = false;
        loginBtn.innerHTML = "Sign In";

        // Redirect after successful login
        // window.location.href = "dashboard.html";

        alert("Login Successful!");

    }, 1500);

}

// Login Button
loginBtn.addEventListener("click", login);

// Enter Key Support
document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        login();

    }

});

// Input Focus Effect
document.querySelectorAll(".field input").forEach(input => {

    input.addEventListener("focus", () => {

        input.parentElement.classList.add("active");

    });

    input.addEventListener("blur", () => {

        input.parentElement.classList.remove("active");

    });

});

// Prevent Multiple Clicks
loginBtn.addEventListener("dblclick", (e) => {

    e.preventDefault();

});

// Auto Focus Username
window.addEventListener("load", () => {

    username.focus();

});