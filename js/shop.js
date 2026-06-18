function loadShopProducts(){

    let container =
    document.getElementById(
        "shopProducts"
    );

    if(!container) return;


    container.innerHTML = "";


    products.forEach(product=>{

        container.innerHTML += `

        <div class="product-card">

            <img src="${product.image}">

            <h3>
                ${product.name}
            </h3>

            <p>
                ₹${product.price}
            </p>

            <button
            onclick="addToCart(${product.id})">

            Add To Cart

            </button>

        </div>

        `;

    });

}