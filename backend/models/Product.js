async function loadShopProducts(){

try{

const response =
await fetch(
"http://localhost:5000/api/products"
);

const products =
await response.json();

const container =
document.getElementById(
"shopProducts"
);

if(!container) return;

container.innerHTML = "";

products.forEach(product=>{

container.innerHTML += `

<div class="product-card">

<img src="${product.image}">

<h3>${product.name}</h3>

<p>₹${product.price}</p>

<button
onclick="addToCart(
${product.id}
)">
Add To Cart
</button>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

loadShopProducts();