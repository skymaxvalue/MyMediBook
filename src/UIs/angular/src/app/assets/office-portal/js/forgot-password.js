

document.addEventListener("DOMContentLoaded", () => {



    const form = document.getElementById("forgotPasswordForm");

    const identifier = document.getElementById("identifier");




    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const value = identifier.value.trim();


        if (value === "") {

            alert("Please enter your registered email address or mobile number.");

            identifier.focus();

            return;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const mobilePattern =
            /^[6-9]\d{9}$/;

        if (
            !emailPattern.test(value) &&
            !mobilePattern.test(value)
        ) {

            alert("Please enter a valid email address or 10-digit mobile number.");

            identifier.focus();

            return;

        }



        localStorage.setItem(
            "passwordRecoveryUser",
            value
        );

        localStorage.setItem(
            "otpFlow",
            "forgot-password"
        );




        window.location.href =
            "forgot-password-otp.html";

    });




    identifier.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            form.requestSubmit();

        }

    });



    identifier.addEventListener("focus", () => {

        identifier.parentElement.classList.add("active");

    });

    identifier.addEventListener("blur", () => {

        identifier.parentElement.classList.remove("active");

    });



    function shakeForm() {

        const card = document.querySelector(".forgot-card");

        card.classList.remove("shake");

        void card.offsetWidth;

        card.classList.add("shake");

    }

});