const categories = [
    {
        id: 1,
        name: "Piće"
    },
    {
        id: 2,
        name: "Grickalice"
    },
    {
        id: 3,
        name: "Slatkiši"
    },
    {
        id: 4,
        name: "Ostalo"
    }
];


const products = [
    {
        id: 1,
        categoryId: 1,
        name: "Coca Cola",
        description: "Coca Cola 0.5L",
        price: 150,
        image: "https://placehold.co/600x600?text=Coca+Cola"
    },

    {
        id: 2,
        categoryId: 1,
        name: "Fanta",
        description: "Fanta Orange 0.5L",
        price: 140,
        image: "https://placehold.co/600x600?text=Fanta"
    },

    {
        id: 3,
        categoryId: 2,
        name: "Čips",
        description: "Klasični slani čips",
        price: 180,
        image: "https://placehold.co/600x600?text=Cips"
    },

    {
        id: 4,
        categoryId: 3,
        name: "Čokolada",
        description: "Mlečna čokolada",
        price: 200,
        image: "https://placehold.co/600x600?text=Cokolada"
    },

    {
        id: 5,
        categoryId: 2,
        name: "Smoki",
        description: "Kikiriki flips",
        price: 120,
        image: "https://placehold.co/600x600?text=Smoki"
    },

    {
        id: 6,
        categoryId: 3,
        name: "Bombone",
        description: "Voćne bombone",
        price: 100,
        image: "https://placehold.co/600x600?text=Bombone"
    }
];


let cart = [];

let selectedCategory = null;


/* DOM */

const categoriesContainer =
    document.getElementById("categories");

const productsContainer =
    document.getElementById("products");

const productCount =
    document.getElementById("productCount");

const searchInput =
    document.getElementById("searchInput");

const cartButton =
    document.getElementById("cartButton");

const cartElement =
    document.getElementById("cart");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");


/* CATEGORIES */

function renderCategories() {

    categoriesContainer.innerHTML = "";

    const allButton =
        document.createElement("button");

    allButton.className =
        "category-button active";

    allButton.textContent =
        "Svi proizvodi";

    allButton.addEventListener("click", () => {

        selectedCategory = null;

        document
            .querySelectorAll(".category-button")
            .forEach(button =>
                button.classList.remove("active")
            );

        allButton.classList.add("active");

        renderProducts();
    });

    categoriesContainer.appendChild(allButton);


    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "category-button";

        button.textContent =
            category.name;

        button.addEventListener("click", () => {

            selectedCategory =
                category.id;

            document
                .querySelectorAll(".category-button")
                .forEach(button =>
                    button.classList.remove("active")
                );

            button.classList.add("active");

            renderProducts();
        });

        categoriesContainer.appendChild(button);

    });
}


/* PRODUCTS */

function renderProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    let filteredProducts =
        products.filter(product => {

            const matchesCategory =
                selectedCategory === null ||
                product.categoryId === selectedCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search) ||

                product.description
                    .toLowerCase()
                    .includes(search);


            return matchesCategory &&
                   matchesSearch;
        });


    productsContainer.innerHTML = "";

    productCount.textContent =
        `${filteredProducts.length} proizvoda`;


    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <p>
                Nema pronađenih proizvoda.
            </p>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const category =
            categories.find(
                category =>
                    category.id === product.categoryId
            );


        const card =
            document.createElement("article");

        card.className =
            "product-card";


        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <div class="product-category">
                    ${category ? category.name : ""}
                </div>

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
                        onclick="addToCart(${product.id})"
                    >
                        Dodaj
                    </button>

                </div>

            </div>
        `;


        productsContainer.appendChild(card);

    });
}


/* CART */

function addToCart(productId) {

    const product =
        products.find(
            product =>
                product.id === productId
        );


    if (!product) {
        return;
    }


    const existingItem =
        cart.find(
            item =>
                item.productId === productId
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            productId: productId,
            quantity: 1
        });

    }


    updateCart();

    openCart();
}


function changeQuantity(productId, change) {

    const item =
        cart.find(
            item =>
                item.productId === productId
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    item.productId !== productId
            );

    }


    updateCart();
}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.productId !== productId
        );


    updateCart();
}


function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                Korpa je prazna.
            </div>
        `;

    } else {

        cart.forEach(item => {

            const product =
                products.find(
                    product =>
                        product.id === item.productId
                );


            if (!product) {
                return;
            }


            const element =
                document.createElement("div");

            element.className =
                "cart-item";


            element.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <div class="cart-item-name">
                        ${product.name}
                    </div>

                    <div class="cart-item-price">
                        ${formatPrice(product.price)}
                    </div>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${product.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${product.id}, 1)"
                        >
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeFromCart(${product.id})"
                        >
                            Obriši
                        </button>

                    </div>

                </div>
            `;


            cartItems.appendChild(element);

        });

    }


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) => {

                const product =
                    products.find(
                        product =>
                            product.id === item.productId
                    );

                return total +
                    (product
                        ? product.price * item.quantity
                        : 0);

            },
            0
        );


    cartCount.textContent =
        totalQuantity;

    cartTotal.textContent =
        formatPrice(totalPrice);
}


/* CART OPEN / CLOSE */

function openCart() {

    cartElement.classList.add("open");

}


function closeCartPanel() {

    cartElement.classList.remove("open");

}


cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartPanel
);


/* SEARCH */

searchInput.addEventListener(
    "input",
    renderProducts
);


/* CHECKOUT */

checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Korpa je prazna."
            );

            return;
        }


        alert(
            "Sledeći korak biće forma za poručivanje."
        );

    }
);


/* PRICE */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "sr-RS"
    ).format(price) + " RSD";
}


/* START */

renderCategories();

renderProducts();

updateCart();
