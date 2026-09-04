document.addEventListener("DOMContentLoaded", function () {

    const otpForm = document.getElementById("otpForm");
    const otpInputs = document.querySelectorAll(".otp-input");
    const countdown = document.getElementById("countdown");
    const resendBtn = document.getElementById("resendBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let timeLeft = 60;
    let timer;



    otpInputs.forEach((input, index) => {

        input.addEventListener("input", function () {

            /* Allow numbers only */
            this.value = this.value.replace(/\D/g, "");

            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

        });

        input.addEventListener("keydown", function (event) {

            if (
                event.key === "Backspace" &&
                this.value === "" &&
                index > 0
            ) {
                otpInputs[index - 1].focus();
            }

        });

        input.addEventListener("paste", function (event) {

            event.preventDefault();

            const pasted =
                event.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 4);

            pasted.split("").forEach((digit, i) => {

                if (otpInputs[i]) {
                    otpInputs[i].value = digit;
                }

            });

            if (pasted.length > 0) {
                otpInputs[
                    Math.min(pasted.length, otpInputs.length) - 1
                ].focus();
            }

        });

    });



function startTimer() {
    clearInterval(timer);

    timeLeft = 60;

    resendBtn.disabled = true;
    resendBtn.textContent = "Resend";

    updateTimer();

    timer = setInterval(function () {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.textContent = "Resend";
        }
    }, 1000);
}


    function updateTimer() {

        const minutes =
            String(Math.floor(timeLeft / 60)).padStart(2, "0");

        const seconds =
            String(timeLeft % 60).padStart(2, "0");

        countdown.textContent =
            `${minutes}:${seconds}`;

    }



    resendBtn.addEventListener("click", function () {

        if (timeLeft > 0) {
            return;
        }

        otpInputs.forEach(input => {
            input.value = "";
        });

        otpInputs[0].focus();

        startTimer();

    });



    // Pressing Enter inside any otp-input naturally triggers this same
    // "submit" event (there's a type="submit" button in the form), so
    // Enter and clicking Verify always run the exact same logic below —
    // no separate keydown handler is needed for that requirement.
    otpForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const otp =
            Array.from(otpInputs)
                .map(input => input.value)
                .join("");


        if (otp.length !== 4) {

            alert("Please enter the 4-digit OTP.");

            otpInputs[0].focus();

            return;
        }


        if (otp !== "1234") {

            alert("Invalid OTP. Please try again.");

            otpInputs.forEach(input => {
                input.value = "";
            });

            otpInputs[0].focus();

            return;
        }


        clearInterval(timer);

        localStorage.setItem(
            "bookingOtpVerified",
            "true"
        );

        window.location.href =
            "booking-success.html";

    });



    cancelBtn.addEventListener("click", function () {

        clearInterval(timer);

        window.location.href =
            "booking-failed.html";

    });



    resendBtn.disabled = true;

    startTimer();

    otpInputs[0].focus();

});
