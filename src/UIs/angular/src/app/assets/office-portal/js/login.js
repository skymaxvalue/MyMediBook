

document.addEventListener("DOMContentLoaded", () => {





    const form = document.getElementById("loginForm");

    const username = document.getElementById("username");

    const password = document.getElementById("password");

    const remember = document.getElementById("remember");

    const togglePassword = document.getElementById("togglePassword");

    const toggleIcon = togglePassword.querySelector("img");



    const savedUser = localStorage.getItem("rememberedUsername");

    if (savedUser) {

        username.value = savedUser;

        remember.checked = true;

    }



    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            toggleIcon.src = "../images/hide.png";

            toggleIcon.alt = "Hide Password";

        }

        else {

            password.type = "password";

            toggleIcon.src = "../images/show.png";

            toggleIcon.alt = "Show Password";

        }

    });



    form.addEventListener("submit", function (e) {

        e.preventDefault();



        const user = username.value.trim();

        const pass = password.value.trim();



        if (user === "") {

            alert("Please enter Employee ID.");

            username.focus();

            return;

        }

        if (pass === "") {

            alert("Please enter Password.");

            password.focus();

            return;

        }



        if (remember.checked) {

            localStorage.setItem("rememberedUsername", user);

        }

        else {

            localStorage.removeItem("rememberedUsername");

        }


if (user === "1024" && pass === "1234") {

    localStorage.setItem("pendingUser", user);

 
    window.location.href = "otp-verification.html";

}
else {

    shakeForm();

    alert("Invalid Employee ID or Password.");

}

    });



    [username, password].forEach(field => {

        field.addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                form.requestSubmit();

            }

        });

    });



    function shakeForm() {

        const card = document.querySelector(".login-card");

        card.classList.remove("shake");

        void card.offsetWidth;

        card.classList.add("shake");

    }

});