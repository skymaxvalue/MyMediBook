const inputs=document.querySelectorAll(".otp-box input");
inputs.forEach((input,i)=>{
input.addEventListener("input",()=>{
if(input.value&&i<3)inputs[i+1].focus();
});
});

let time=59;
const timer=document.getElementById("timer");

setInterval(()=>{
if(time>0){
time--;
timer.innerText="00:"+time+"s";
}
},1000);

document.querySelector(".btn-primary").onclick=()=>{
alert("OTP Verified");
window.location.href="reset.html";
};