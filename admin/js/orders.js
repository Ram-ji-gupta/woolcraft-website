// ==========================
// LOAD ORDERS
// ==========================

async function loadOrders() {

try {

const response =
await fetch(
"http://localhost:5000/api/orders"
);

const orders =
await response.json();

const container =
document.getElementById(
"ordersList"
);

if (!container) return;

container.innerHTML = "";

orders.forEach(order => {

const status =
order.status || "Pending";

container.innerHTML += `

<div class="order-card">

<h3>
${order.customer}
</h3>

<p>
📞 ${order.phone}
</p>

<p>
📍 ${order.address}
</p>

<p>
💰 ₹${order.total}
</p>

<div class="status-row">

<span>
Current Status
</span>

<span class="status-badge ${status.toLowerCase()}">
${status}
</span>

</div>

<div class="status-buttons">

<button
class="pending-btn"
onclick="updateStatus(${order.id},'Pending')">

Pending

</button>

<button
class="processing-btn"
onclick="updateStatus(${order.id},'Processing')">

Processing

</button>

<button
class="shipped-btn"
onclick="updateStatus(${order.id},'Shipped')">

Shipped

</button>

<button
class="delivered-btn"
onclick="updateStatus(${order.id},'Delivered')">

Delivered

</button>

</div>

</div>

`;

});

}

catch(error){

console.log(error);

}

}


// ==========================
// UPDATE STATUS
// ==========================

async function updateStatus(id,status){

try{

await fetch(

`http://localhost:5000/api/orders/${id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

status

})

}

);

loadOrders();

}

catch(error){

console.log(error);

}

}


// ==========================
// INITIALIZE
// ==========================

loadOrders();