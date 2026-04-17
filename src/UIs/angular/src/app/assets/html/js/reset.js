const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", function () {
    const pass1 = newPassword.value.trim();
    const pass2 = confirmPassword.value.trim();

    if (pass1 === "" || pass2 === "") {
        alert("Please fill all fields");
        return;
    }

    if (pass1.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    if (pass1 !== pass2) {
        alert("Passwords do not match");
        return;
    }

    alert("Password reset successful! Please login again.");
    window.location.href = "login.html";
});