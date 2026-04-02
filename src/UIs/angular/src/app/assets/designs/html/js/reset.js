<<<<<<< HEAD
document.getElementById("resetForm").addEventListener("submit",(e)=>{
e.preventDefault();

let p1=document.getElementById("newPass").value;
let p2=document.getElementById("confirmPass").value;

if(p1!==p2){
alert("Passwords do not match");
return;
}

alert("Password Reset Successful");
window.location.href="login.html";
=======
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

// redirect after user clicks OK
window.location.href = "login.html";
>>>>>>> 6eb368c (updated assets)
});