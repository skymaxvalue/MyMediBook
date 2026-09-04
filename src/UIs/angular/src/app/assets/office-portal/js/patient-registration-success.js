document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    const supportLink = document.querySelector(".support-text a");


    loginBtn.addEventListener("click", () => {

        clearRecoveryData();

        window.location.href = "login.html";

    });


    supportLink.addEventListener("click", (e) => {

        e.preventDefault();

        alert("Please contact your system administrator or IT support.");

    });


    function clearRecoveryData(){

        localStorage.removeItem("passwordRecoveryUser");
        localStorage.removeItem("otpFlow");

    }

  

});