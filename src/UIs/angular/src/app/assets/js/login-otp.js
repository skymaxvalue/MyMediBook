document.addEventListener("DOMContentLoaded", () => {

    /*=========================================
        ELEMENTS
    =========================================*/

    const inputs = document.querySelectorAll(".otp-input");
    const timerEl = document.getElementById("timer");
    const resendBtn = document.getElementById("resendBtn");
    const verifyBtn = document.getElementById("verifyBtn");

    /*=========================================
        OTP INPUT LOGIC
    =========================================*/

    inputs.forEach((input, index) => {

        input.addEventListener("input", (e) => {

            input.value = e.target.value.replace(/[^0-9]/g, "");

            if (input.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

        });

        input.addEventListener("keydown", (e) => {

            if (e.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus();
            }

        });

    });

    /*=========================================
        AUTO FOCUS
    =========================================*/

    setTimeout(() => {
        inputs[0].focus();
    }, 300);

    /*=========================================
        TIMER
    =========================================*/

    let time = 59;
    let interval;

    function startTimer() {

        clearInterval(interval);

        time = 59;

        resendBtn.disabled = true;

        interval = setInterval(() => {

            let min = Math.floor(time / 60);
            let sec = time % 60;

            if (sec < 10) {
                sec = "0" + sec;
            }

            timerEl.innerText = `0${min}:${sec}`;

            time--;

            if (time < 0) {

                clearInterval(interval);

                timerEl.innerText = "Expired";

                resendBtn.disabled = false;

            }

        }, 1000);

    }

    startTimer();

    /*=========================================
        RESEND OTP
    =========================================*/

    resendBtn.addEventListener("click", () => {

        alert("OTP Sent Successfully!");

        startTimer();

    });

    /*=========================================
        VERIFY OTP
    =========================================*/

    verifyBtn.addEventListener("click", () => {

        let otp = "";

        inputs.forEach(input => {
            otp += input.value;
        });

        if (otp.length !== 4) {

            alert("Please enter the complete OTP.");

            return;

        }

        if (otp === "1234") {

            localStorage.setItem("isLoggedIn", "true");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid OTP.");

        }

    });

});