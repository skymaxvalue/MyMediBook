

document.addEventListener("DOMContentLoaded", () => {

    const otpInputs = document.querySelectorAll(".otp-input");
    const otpForm = document.getElementById("otpForm");
    const resendBtn = document.getElementById("resendBtn");
    const countdown = document.getElementById("countdown");
    const cancelBtn = document.getElementById("cancelBtn");

    const OTP = "1234";

    let seconds = 60;
    let timer;

   

    otpInputs[0].focus();

    otpInputs.forEach((input, index) => {

        input.addEventListener("input", (e) => {

            e.target.value = e.target.value.replace(/\D/g, "");

            if (e.target.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

        });

        input.addEventListener("keydown", (e) => {

            if (e.key === "Backspace" &&
                !input.value &&
                index > 0) {

                otpInputs[index - 1].focus();

            }

        });

    });


    otpInputs[0].addEventListener("paste", (e) => {

        e.preventDefault();

        const data = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 4);

        data.split("").forEach((digit, index) => {

            if (otpInputs[index]) {
                otpInputs[index].value = digit;
            }

        });

        if (data.length === 4) {
            otpInputs[3].focus();
        }

    });



    function startTimer() {

        clearInterval(timer);

        seconds = 60;

        resendBtn.disabled = true;
        resendBtn.style.opacity = ".5";

        updateTime();

        timer = setInterval(() => {

            seconds--;

            updateTime();

            if (seconds <= 0) {

                clearInterval(timer);

                resendBtn.disabled = false;
                resendBtn.style.opacity = "1";

                countdown.textContent = "00:00";

            }

        }, 1000);

    }

    function updateTime() {

        const min = String(Math.floor(seconds / 60)).padStart(2, "0");
        const sec = String(seconds % 60).padStart(2, "0");

        countdown.textContent = `${min}:${sec}`;

    }

    startTimer();

 

    resendBtn.addEventListener("click", () => {

        otpInputs.forEach(input => input.value = "");

        otpInputs[0].focus();

        startTimer();

        alert("A new OTP has been sent.");

    });

  

    otpForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const enteredOTP = [...otpInputs]
            .map(input => input.value)
            .join("");

        if (enteredOTP.length < 4) {

            shakeCard();

            alert("Please enter the complete OTP.");

            return;

        }

        if (enteredOTP !== OTP) {

            shakeCard();

            alert("Invalid OTP.");

            otpInputs.forEach(input => input.value = "");

            otpInputs[0].focus();

            return;

        }

        localStorage.removeItem("passwordRecoveryUser");

        window.location.href = "reset-password.html";

    });



    cancelBtn.addEventListener("click", () => {

        window.location.href = "forgot-password.html";

    });


    function shakeCard() {

        const card = document.querySelector(".forgot-card");

        card.classList.remove("shake");

        void card.offsetWidth;

        card.classList.add("shake");

    }

});