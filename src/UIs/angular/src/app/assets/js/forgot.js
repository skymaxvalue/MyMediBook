console.log("Forgot JS Loaded");

const input = document.getElementById("userInput");
const button = document.getElementById("sendOtpBtn");

button.addEventListener("click", function () {
    const value = input.value.trim();

    if (value === "") {
        alert("Please enter email or phone number");
        return;
    }

    alert("OTP sent successfully!");
    window.location.href = "otp.html";
});