document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetPasswordForm");

    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const toggleButtons = document.querySelectorAll(".toggle-password");

    const cancelBtn = document.getElementById("cancelBtn");



toggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const input = button.parentElement.querySelector("input");
        const icon = button.querySelector("img");

        if (input.type === "password") {

            input.type = "text";

            icon.src = "../images/hide.png";
            icon.alt = "Hide Password";

        } else {

            input.type = "password";

            icon.src = "../images/show.png";
            icon.alt = "Show Password";

        }

    });

});


    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const password = newPassword.value.trim();
        const confirm = confirmPassword.value.trim();

        if (!password || !confirm) {

            shakeCard();

            alert("Please fill in all fields.");

            return;

        }

        if (password !== confirm) {

            shakeCard();

            alert("Passwords do not match.");

            confirmPassword.focus();

            return;

        }

        if (!validatePassword(password)) {

            shakeCard();

            alert(
                "Password must contain at least 8 characters, one uppercase letter, one number and one special character."
            );

            newPassword.focus();

            return;

        }

        localStorage.removeItem("passwordRecoveryUser");

        alert("Password reset successfully.");

        window.location.href = "password-reset-success.html";

    });



    cancelBtn.addEventListener("click", () => {

        window.location.href = "forgot-password.html";

    });



    function validatePassword(password) {

        const hasLength = password.length >= 8;

        const hasUppercase = /[A-Z]/.test(password);

        const hasNumber = /\d/.test(password);

        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return (
            hasLength &&
            hasUppercase &&
            hasNumber &&
            hasSpecial
        );

    }



    function shakeCard() {

        const card = document.querySelector(".forgot-card");

        card.classList.remove("shake");

        void card.offsetWidth;

        card.classList.add("shake");

    }

});