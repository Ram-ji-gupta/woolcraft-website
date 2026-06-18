// LOGIN PROTECTION
if (
  window.location.pathname.includes("admin") &&
  !window.location.href.includes("login.html")
) {
  let logged = localStorage.getItem("adminLogged");
  if (!logged) {
    window.location = "login.html";
  }
}

// LOGIN function for login.html
function login() {
  const user = document.getElementById("username")?.value;
  const pass = document.getElementById("password")?.value;
  if (user === "admin" && pass === "123456") {
    localStorage.setItem("adminLogged", "true");
    window.location = "dashboard.html";
  } else {
    alert("Wrong Username or Password");
  }
}

// LOGOUT (called from sidebar)
function logout(){

localStorage.removeItem(
"adminLogged"
);

window.location =
"login.html";

}