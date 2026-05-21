



const inputs = document.querySelectorAll(".otp-input");

inputs.forEach((input, index) => {

    input.addEventListener("input", (e) => {

        let value = e.target.value.replace(/[^0-9]/g, "");

        input.value = value;

        if(value && index < inputs.length - 1){
            inputs[index + 1].focus();
        }

    });

    input.addEventListener("keydown", (e) => {

        if(e.key === "Backspace" && !input.value && index > 0){
            inputs[index - 1].focus();
        }

    });

});



setTimeout(() => {
    inputs[0].focus();
}, 300);



let time = 59;
let interval;

const timerEl = document.getElementById("timer");

function startTimer(){

    clearInterval(interval);

    interval = setInterval(() => {

        let min = Math.floor(time / 60);
        let sec = time % 60;

        if(sec < 10){
            sec = "0" + sec;
        }

        timerEl.innerText = `0${min}:${sec}s`;

        time--;

        if(time < 0){

            clearInterval(interval);

            alert("OTP Expired");

        }

    },1000);

}



function resetTimer(){

    time = 59;

    timerEl.innerText = "00:59s";

    startTimer();

    alert("OTP Resent Successfully");

}



startTimer();



function verifyOtp(){

    let otp = "";

    inputs.forEach(input => {
        otp += input.value;
    });

    if(otp.length !== 4){

        alert("Please enter complete OTP");

        return;
    }

    const appointment =
    JSON.parse(localStorage.getItem("tempAppointment"));

    let list =
    JSON.parse(localStorage.getItem("appointments")) || [];

    list.push(appointment);

    localStorage.setItem(
        "appointments",
        JSON.stringify(list)
    );

    localStorage.removeItem("tempAppointment");

    window.location.href = "success.html";

}


function cancelOtp(){

    localStorage.removeItem("tempAppointment");

    window.location.href = "failed.html";

}
