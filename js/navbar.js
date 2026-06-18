function toggleMobileMenu(){

    document
    .getElementById(
    "navbar"
    )
    .classList
    .toggle("active");

}


document.addEventListener(

"DOMContentLoaded",

()=>{

const page =
window.location.pathname
.split("/")
.pop();


document
.querySelectorAll(
"nav a"
)

.forEach(link=>{

if(

link.getAttribute(
"href"

) === page

){

link.classList.add(
"active"
);

}

});


document
.querySelectorAll(
"#navbar a"
)

.forEach(link=>{

link.addEventListener(

"click",

()=>{

document
.getElementById(
"navbar"
)

.classList.remove(
"active"
);

});

});

});