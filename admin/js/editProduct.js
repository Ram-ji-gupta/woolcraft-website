const params =
new URLSearchParams(
window.location.search
);

const id =
params.get("id");


// LOAD PRODUCT

async function loadProduct(){

try{

const response =
await fetch(
`http://localhost:5000/api/products/${id}`
);

const product =
await response.json();

document.getElementById(
"name"
).value =
product.name;

document.getElementById(
"price"
).value =
product.price;

document.getElementById(
"category"
).value =
product.category;

document.getElementById(
"stock"
).value =
product.stock;

document.getElementById(
"description"
).value =
product.description;

}

catch(error){

console.log(error);

}

}


// UPDATE PRODUCT

async function updateProduct(){

try{

const formData =
new FormData();

formData.append(
"name",
document.getElementById("name").value
);

formData.append(
"price",
document.getElementById("price").value
);

formData.append(
"category",
document.getElementById("category").value
);

formData.append(
"stock",
document.getElementById("stock").value
);

formData.append(
"description",
document.getElementById("description").value
);

const file =
document.getElementById(
"imageFile"
).files[0];

if(file){

formData.append(
"image",
file
);

}

await fetch(

`http://localhost:5000/api/products/${id}`,

{

method:"PUT",

body:formData

}

);

alert(
"Product Updated Successfully"
);

window.location =
"products.html";

}

catch(error){

console.log(error);

}

}


loadProduct();