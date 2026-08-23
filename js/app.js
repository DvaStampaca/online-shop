/* =========================
   PROIZVODI
========================= */

const products = [

    {
        id: 1,
        name: "Coca Cola",
        category: "Piće",
        description: "Coca Cola 0.5L",
        price: 150,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 2,
        name: "Fanta",
        category: "Piće",
        description: "Fanta Orange 0.5L",
        price: 140,
        image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 3,
        name: "Čips",
        category: "Grickalice",
        description: "Klasični slani čips",
        price: 180,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 4,
        name: "Čokolada",
        category: "Slatkiši",
        description: "Mlečna čokolada",
        price: 200,
        image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 5,
        name: "Voda",
        category: "Piće",
        description: "Prirodna mineralna voda 0.5L",
        price: 80,
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 6,
        name: "Kikiriki",
        category: "Grickalice",
        description: "Pečeni slani kikiriki",
        price: 160,
        image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=800&q=80"
    }

];


/* =========================
   KORPA
========================= */

let cart = [];


/* =========================
   FORMAT CENE
========================= */

function formatPrice(price) {

    return price.toLocaleString("sr-RS") + " RSD";

}


/* =========================
   KATEGORIJE
========================= */

function getCategories() {

    const categories = products.map(
        product => product.category
    );

    return [
        "Sve",
        ...new Set(categories)
    ];

}


function renderCategories() {

    const container =
        document.getElementById("categories");

    container.innerHTML = "";

    getCategories().forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "category-button";

        if (category === "Sve") {
            button.classList.add("active");
        }

        button.textContent = category;

        button.onclick = () => {

            document
                .querySelectorAll(".category-button")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            renderProducts(category);

        };

        container.appendChild(button);

    });

}


/* =========================
   PROIZVODI
========================= */

function renderProducts(category = "Sve") {

    const container =
        document.getElementById("products");

    let filteredProducts = products;

    if (category !== "Sve") {

        filteredProducts =
            products.filter(
                product =>
                    product.category === category
            );

    }

    container.innerHTML = "";

    document.getElementById("product-count")
        .textContent =
        `${filteredProducts.length} proizvoda`;


    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product";


        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})">

                        Dodaj

                    </button>

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================
   DODAVANJE U KORPU
========================= */

function addToCart(productId) {

    const product =
        products.find(
            product => product.id === productId
        );

    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    updateCart();

}


/* =========================
   PROMENA KOLIČINE
========================= */

function changeQuantity(productId, amount) {

    const item =
        cart.find(
            item => item.id === productId
        );

    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    updateCart();

}


/* =========================
   UKUPNA CENA
========================= */

function getCartTotal() {

    return cart.reduce(

        (total, item) =>

            total +
            item.price * item.quantity,

        0

    );

}


/* =========================
   BROJ PROIZVODA
========================= */

function getCartCount() {

    return cart.reduce(

        (total, item) =>

            total + item.quantity,

        0

    );

}


/* =========================
   PRIKAZ KORPE
========================= */

function updateCart() {

    document.getElementById("cart-count")
        .textContent =
        getCartCount();


    document.getElementById("cart-total")
        .textContent =
        formatPrice(getCartTotal());


    document.getElementById("checkout-total")
        .textContent =
        formatPrice(getCartTotal());


    renderCart();

}


/* =========================
   RENDER KORPE
========================= */

function renderCart() {

    const container =
        document.getElementById("cart-items");


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                Korpa je prazna.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    cart.forEach(item => {

        const row =
            document.createElement("div");

        row.className = "cart-item";


        row.innerHTML = `

            <img
                class="cart-item-image"
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${formatPrice(item.price)}
                </p>

            </div>


            <div class="quantity">

                <button
                    onclick="changeQuantity(${item.id}, -1)">

                    −

                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    onclick="changeQuantity(${item.id}, 1)">

                    +

                </button>

            </div>

        `;


        container.appendChild(row);

    });

}


/* =========================
   OTVORI KORPU
========================= */

function openCart() {

    document
        .getElementById("cart-modal")
        .classList.add("show");

}


/* =========================
   ZATVORI KORPU
========================= */

function closeCart() {

    document
        .getElementById("cart-modal")
        .classList.remove("show");

}


/* =========================
   CHECKOUT
========================= */

function openCheckout() {

    if (cart.length === 0) {

        alert("Korpa je prazna.");

        return;

    }


    closeCart();


    document
        .getElementById("checkout-modal")
        .classList.add("show");

}


function closeCheckout() {

    document
        .getElementById("checkout-modal")
        .classList.remove("show");

}


/* =========================
   PORUDŽBINA
========================= */

document
    .getElementById("order-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const order = {

            customer: {

                name:
                    document
                        .getElementById("customer-name")
                        .value,

                phone:
                    document
                        .getElementById("customer-phone")
                        .value,

                address:
                    document
                        .getElementById("customer-address")
                        .value,

                city:
                    document
                        .getElementById("customer-city")
                        .value,

                note:
                    document
                        .getElementById("customer-note")
                        .value

            },


            products: cart.map(item => ({

                id: item.id,

                name: item.name,

                quantity: item.quantity,

                price: item.price

            })),


            total: getCartTotal(),

            createdAt:
                new Date().toISOString()

        };


        console.log(
            "NOVA PORUDŽBINA:",
            order
        );


        /*
            GOOGLE SHEETS ĆEMO POVEZATI OVDE.
        */


        closeCheckout();


        document
            .getElementById("success-modal")
            .classList.add("show");


        cart = [];


        updateCart();


        this.reset();

    });


/* =========================
   SUCCESS
========================= */

function closeSuccess() {

    document
        .getElementById("success-modal")
        .classList.remove("show");

}


/* =========================
   POKRETANJE
========================= */

renderCategories();

renderProducts();

updateCart();
