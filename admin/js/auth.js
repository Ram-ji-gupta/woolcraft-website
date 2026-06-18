// LOGIN PROTECTION

if(
window.location.pathname.includes("admin") &&
!window.location.href.includes("login.html")
){

let logged =
localStorage.getItem(
"adminLogged"
);

if(!logged){

window.location =
"login.html";

}

}



// LOGIN

async function login(){

const user =
document.getElementById(
"username"
)?.value;

const pass =
document.getElementById(
"password"
)?.value;


try{

const response =
await fetch(
"http://localhost:5000/api/settings"
);

const settings =
await response.json();


if(

user === settings.admin_username &&

pass === settings.admin_password

){

localStorage.setItem(
"adminLogged",
"true"
);

window.location =
"dashboard.html";

}

else{

alert(
"Wrong Username or Password"
);

}

}

catch(error){

console.log(error);

alert(
"Cannot connect to server"
);

}

}



// LOGOUT

function logout(){

localStorage.removeItem(
"adminLogged"
);

window.location =
"login.html";

}