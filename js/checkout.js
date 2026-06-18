async function placeOrder(){

let name =
document.querySelector(
'input[type="text"]'
).value;

let phone =
document.querySelector(
'input[type="tel"]'
).value;

let address =
document.querySelector(
"textarea"
).value;


if(

name === "" ||

phone === "" ||

address === ""

){

alert(
"Please fill all fields"
);

return;

}


// CART

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];


if(cart.length === 0){

alert(
"Cart is empty"
);

return;

}


// ORDER OBJECT

const order = {

customer: name,

phone: phone,

address: address,

items: cart

};


try{

await fetch(

"http://localhost:5000/api/orders",

{

method: "POST",

headers: {

"Content-Type":
"application/json"

},

body:
JSON.stringify(order)

}

);


localStorage.removeItem(
"cart"
);

alert(
"Order Placed Successfully"
);

window.location =
"index.html";

}

catch(error){

console.log(error);

alert(
"Order Failed"
);

}

}