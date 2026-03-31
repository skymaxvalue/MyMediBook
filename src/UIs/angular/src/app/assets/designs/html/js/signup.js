let step=1;

function nextStep(){
document.getElementById("step"+step).classList.remove("active");
step++;
document.getElementById("step"+step).classList.add("active");
}

function prevStep(){
document.getElementById("step"+step).classList.remove("active");
step--;
document.getElementById("step"+step).classList.add("active");
}

function submitForm(){
alert("Signup Complete");
window.location.href="login.html";
}