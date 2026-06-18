function loadFeaturedProducts(){

    let container =
    document.getElementById(
        "featuredProducts"
    );

    if(!container) return;


    let featured =
    products.slice(0,3);


    container.innerHTML = "";


    featured.forEach(product=>{

        container.innerHTML += `

        <div class="product-card">

            <img
            src="${product.image}"
            alt="${product.name}">

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

loadFeaturedProducts();