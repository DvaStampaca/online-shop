const API_URL =
    "https://script.google.com/macros/s/AKfycbzU3FNFs2QOdB0CSwmbb9qB1cs0yAqijtRX_AUOq37q3bhnbxF4wMIP2qaXobXULotOtg/exec";


let products = [];

let cart = [];


/* =========================
   FORMAT CENE
========================= */

function formatPrice(price) {

    return Number(price).toLocaleString("sr-RS") + " RSD";

}


/* =========================
   UČITAVANJE PROIZVODA
========================= */

async function loadProducts() {

    const container =
        document.getElementById("products");

    container.innerHTML =
        "<p>Učitavanje proizvoda...</p>";


    try {

        const response =
            await fetch(
                API_URL + "?action=products"
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error || "Greška"
            );

        }


        products =
            data.products || [];


        renderCategories();

        renderProducts();

        updateCart();


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <p>
                Nije moguće učitati proizvode.
            </p>

        `;

    }

}


/* =========================
   KATEGORIJE
========================= */

function getCategories() {

    return [
        "Sve",
        ...new Set(
            products.map(
                product => product.category
            )
        )
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


        button.textContent =
            category;


        button.onclick = () => {

            document
                .querySelectorAll(
                    ".category-button"
                )
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


    let filteredProducts =
        products;


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


    if (filteredProducts.length === 0) {

        container.innerHTML = `

            <p>
                Trenutno nema proizvoda.
            </p>

        `;

        return;

    }


    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "product";


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
   KORPA
========================= */

function addToCart(productId) {

    const product =
        products.find(
            product =>
                String(product.id) === String(productId)
        );


    if (!product) return;


    const existing =
        cart.find(
            item =>
                String(item.id) === String(productId)
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


function changeQuantity(productId, amount) {

    const item =
        cart.find(
            item =>
                String(item.id) === String(productId)
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    String(item.id) !==
                    String(productId)
            );

    }


    updateCart();

}


function getCartTotal() {

    return cart.reduce(

        (total, item) =>

            total +
            Number(item.price) *
            item.quantity,

        0

    );

}


function getCartCount() {

    return cart.reduce(

        (total, item) =>
            total + item.quantity,

        0

    );

}


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


        row.className =
            "cart-item";


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
   MODALI
========================= */

function openCart() {

    document
        .getElementById("cart-modal")
        .classList.add("show");

}


function closeCart() {

    document
        .getElementById("cart-modal")
        .classList.remove("show");

}


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


function closeSuccess() {

    document
        .getElementById("success-modal")
        .classList.remove("show");

}


/* =========================
   SLANJE PORUDŽBINE
========================= */

document
    .getElementById("order-form")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Korpa je prazna."
                );

                return;

            }


            const order = {

                customer: {

                    name:
                        document
                            .getElementById(
                                "customer-name"
                            )
                            .value,

                    phone:
                        document
                            .getElementById(
                                "customer-phone"
                            )
                            .value,

                    address:
                        document
                            .getElementById(
                                "customer-address"
                            )
                            .value,

                    city:
                        document
                            .getElementById(
                                "customer-city"
                            )
                            .value,

                    note:
                        document
                            .getElementById(
                                "customer-note"
                            )
                            .value

                },


                products:
                    cart.map(item => ({

                        id: item.id,

                        name: item.name,

                        quantity:
                            item.quantity,

                        price:
                            item.price

                    })),


                total:
                    getCartTotal()

            };


            /*
             * Šaljemo kao form-urlencoded.
             * Tako izbegavamo CORS preflight.
             */

            const form =
                document.createElement("form");


            form.method = "POST";

            form.action = API_URL;

            form.target = "order-frame";

            form.style.display = "none";


            const input =
                document.createElement("input");


            input.type = "hidden";

            input.name = "data";

            input.value =
                JSON.stringify(order);


            form.appendChild(input);


            document.body.appendChild(form);


            form.submit();


            form.remove();


            closeCheckout();


            document
                .getElementById(
                    "success-modal"
                )
                .classList.add("show");


            cart = [];


            updateCart();


            this.reset();

        }
    );


/* =========================
   INVISIBLE FRAME
========================= */

const orderFrame =
    document.createElement("iframe");


orderFrame.name =
    "order-frame";


orderFrame.style.display =
    "none";


document.body.appendChild(
    orderFrame
);


/* =========================
   START
========================= */

loadProducts();
