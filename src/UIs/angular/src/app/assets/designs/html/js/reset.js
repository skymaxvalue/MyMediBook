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
});