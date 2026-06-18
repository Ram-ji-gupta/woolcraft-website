// ==========================
// DASHBOARD
// ==========================

async function dashboard(){

try{

const [

prodRes,
orderRes,
custRes

]

=

await Promise.all([

fetch(
"http://localhost:5000/api/products"
),

fetch(
"http://localhost:5000/api/orders"
),

fetch(
"http://localhost:5000/api/customers"
)

]);


const products =
await prodRes.json();

const orders =
await orderRes.json();

const customers =
await custRes.json();


// TOTAL PRODUCTS

document.getElementById(
"totalProducts"
).textContent =
products.length;


// TOTAL ORDERS

document.getElementById(
"totalOrders"
).textContent =
orders.length;


// TOTAL CUSTOMERS

document.getElementById(
"totalCustomers"
).textContent =
customers.length;


// TOTAL REVENUE

let revenue = 0;

orders.forEach(order=>{

revenue +=
Number(order.total);

});

document.getElementById(
"revenue"
).textContent =
"₹" + revenue;



// ==========================
// RECENT ORDERS
// ==========================

const recentDiv =
document.getElementById(
"recentOrders"
);

if(recentDiv){

recentDiv.innerHTML = "";

orders
.slice(0,5)
.forEach(order=>{

const status =
order.status || "Pending";

recentDiv.innerHTML += `

<div class="card">

<h3>

${order.customer}

</h3>

<p>

💰 ₹${order.total}

</p>

<p>

📞 ${order.phone}

</p>

<p>

📍 ${order.address}

</p>

<p>

Status :

<span class="status-badge ${status.toLowerCase()}">

${status}

</span>

</p>

</div>

`;

});

}

}

catch(error){

console.log(error);

}

}


// ==========================
// INITIALIZE
// ==========================

dashboard();