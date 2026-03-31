const input = document.getElementById("userInput");
const button = document.getElementById("sendOtpBtn");

button.addEventListener("click", function () {
    const value = input.value.trim();

    if (value === "") {
        alert("Please enter email or phone number");
        return;
    }

    // simple validation (basic)
    if (!value.includes("@") && isNaN(value)) {
        alert("Enter valid email or phone number");
        return;
    }

    // SUCCESS → go to OTP page
    alert("OTP sent successfully!");
    window.location.href = "otp.html";
});