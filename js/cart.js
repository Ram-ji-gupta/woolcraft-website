let cart =
JSON.parse(localStorage.getItem("cart")) || [];


function saveCart(){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function addToCart(id){

    let product =
    products.find(
        p => p.id === id
    );

    if(!product) return;


    let existing =
    cart.find(
        item => item.id === id
    );


    if(existing){

        existing.qty++;

    }

    else{

        cart.push({

            id:product.id,
            name:product.name,
            price:product.price,
            qty:1

        });

    }

    saveCart();

    updateCartCount();

    alert(product.name + " added to cart");

}
// Update Counter
function updateCartCount(){

    let count =
    document.getElementById(
        "cartCount"
    );

    if(!count) return;


    let totalItems = 0;

    cart.forEach(item=>{

        totalItems += item.qty;

    });

    count.innerHTML = totalItems;

}
// Load Cart
function loadCart(){

    let container =
    document.getElementById(
        "cartContainer"
    );

    if(!container) return;


    container.innerHTML = "";

    let total = 0;


    cart.forEach((item,index)=>{

        total += Number(item.price) * Number(item.qty);
        container.innerHTML += `

        <div class="cart-card">

            <h3>${item.name}</h3>

            <p>
                ₹${item.price}
            </p>

            <p>
                Quantity : ${item.qty}
            </p>

            <button
            onclick="increaseQty(${index})">
            +
            </button>

            <button
            onclick="decreaseQty(${index})">
            -
            </button>

            <button
            onclick="removeItem(${index})">
            Remove
            </button>

        </div>

        `;

    });


    document.getElementById(
        "cartTotal"
    ).innerHTML =
    "Total : ₹" + total;

}
// increase Quantity
function increaseQty(index){

    cart[index].qty++;

    saveCart();

    loadCart();

    updateCartCount();

}
// Decresse Quantity
function decreaseQty(index){

    cart[index].qty--;

    if(cart[index].qty <= 0){

        cart.splice(index,1);

    }

    saveCart();

    loadCart();

    updateCartCount();

}
// Remove Item
function removeItem(index){

    cart.splice(index,1);

    saveCart();

    loadCart();

    updateCartCount();

}