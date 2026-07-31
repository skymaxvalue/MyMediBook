document.addEventListener("DOMContentLoaded", () => {



    const pendingUser = localStorage.getItem("pendingUser");

    if (!pendingUser) {

        window.location.href = "login.html";
        return;

    }



    const form = document.getElementById("otpForm");

    const inputs = document.querySelectorAll(".otp-input");

    const timer = document.getElementById("timer");

    const resendBtn = document.getElementById("resendOtp");

    const verifyBtn = document.querySelector(".verify-btn");

    const card = document.querySelector(".otp-card");


    inputs[0].focus();


    inputs.forEach((input, index) => {

        input.addEventListener("input", function () {

            this.value = this.value.replace(/\D/g, "");

            if (this.value !== "") {

                this.classList.add("filled");

                if (index < inputs.length - 1) {

                    inputs[index + 1].focus();

                }

            } else {

                this.classList.remove("filled");

            }

        });

        input.addEventListener("keydown", function (e) {

            if (e.key === "Backspace" && this.value === "") {

                if (index > 0) {

                    inputs[index - 1].focus();

                }

            }

        });

    });



    document.addEventListener("paste", function (e) {

        const paste = e.clipboardData.getData("text").replace(/\D/g, "");

        if (paste.length === 4) {

            inputs.forEach((input, i) => {

                input.value = paste[i];

                input.classList.add("filled");

            });

        }

    });



    let time = 60;

    resendBtn.disabled = true;

    const countdown = setInterval(() => {

        time--;

        const minutes = String(Math.floor(time / 60)).padStart(2, "0");

        const seconds = String(time % 60).padStart(2, "0");

        timer.textContent = `${minutes}:${seconds}`;

        if (time <= 0) {

            clearInterval(countdown);

            timer.textContent = "Expired";

            resendBtn.disabled = false;

        }

    }, 1000);



    resendBtn.addEventListener("click", () => {

        alert("Demo OTP: 1234");

        time = 60;

        resendBtn.disabled = true;

        location.reload();

    });



    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const otp = [...inputs].map(i => i.value).join("");

        if (otp.length < 4) {

            alert("Please enter the complete OTP.");

            inputs[0].focus();

            return;

        }

        verifyBtn.classList.add("loading");

        verifyBtn.disabled = true;

        setTimeout(() => {

            verifyBtn.classList.remove("loading");

            verifyBtn.disabled = false;

            if (otp === "1234") {

                localStorage.setItem("isLoggedIn", "true");

                localStorage.removeItem("pendingUser");

                window.location.href = "dashboard.html";

            } else {

                card.classList.remove("shake");

                void card.offsetWidth;

                card.classList.add("shake");

                alert("Invalid OTP.");

                inputs.forEach(input => {

                    input.value = "";

                    input.classList.remove("filled");

                });

                inputs[0].focus();

            }

        }, 700);

    });

});