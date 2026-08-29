const API_URL =
    "https://script.google.com/macros/s/AKfycbzU3FNFs2QOdB0CSwmbb9qB1cs0yAqijtRX_AUOq37q3bhnbxF4wMIP2qaXobXULotOtg/exec";


/* =========================
   PODEŠAVANJA KEŠA
========================= */

const CACHE_KEY = "online_shop_products";

const CACHE_TIME_KEY = "online_shop_products_time";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minuta


/* =========================
   GLOBALNI PODACI
========================= */

let products = [];

let cart = [];


/* =========================
   FORMAT CENE
========================= */

function formatPrice(price) {

    return Number(price).toLocaleString("sr-RS") + " RSD";

}


/* =========================
   KEŠ - ČITANJE
========================= */

function getCachedProducts() {

    try {

        const cached =
            localStorage.getItem(
                CACHE_KEY
            );

        if (!cached) {

            return null;

        }


        return JSON.parse(cached);


    } catch (error) {

        console.error(
            "Greška pri čitanju keša:",
            error
        );

        return null;

    }

}


/* =========================
   KEŠ - ČUVANJE
========================= */

function saveProductsToCache(productsData) {

    try {

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(productsData)
        );


        localStorage.setItem(
            CACHE_TIME_KEY,
            Date.now().toString()
        );


    } catch (error) {

        console.error(
            "Greška pri čuvanju keša:",
            error
        );

    }

}


/* =========================
   PROVERA STAROSTI KEŠA
========================= */

function isCacheFresh() {

    try {

        const cacheTime =
            Number(
                localStorage.getItem(
                    CACHE_TIME_KEY
                )
            );


        if (!cacheTime) {

            return false;

        }


        return (
            Date.now() - cacheTime <
            CACHE_DURATION
        );


    } catch (error) {

        return false;

    }

}


/* =========================
   UČITAVANJE SA GOOGLE-A
========================= */

async function fetchProductsFromServer() {

    const response =
        await fetch(
            API_URL +
            "?action=products"
        );


    if (!response.ok) {

        throw new Error(
            "Server nije dostupan."
        );

    }


    const data =
        await response.json();


    if (!data.success) {

        throw new Error(
            data.error ||
            "Greška pri učitavanju proizvoda."
        );

    }


    return data.products || [];

}


/* =========================
   PRIKAZ PROIZVODA
========================= */

function setProducts(productsData) {

    products =
        productsData || [];


    renderCategories();

    renderProducts();

    updateCart();

}


/* =========================
   UČITAVANJE PROIZVODA
========================= */

async function loadProducts() {

    const container =
        document.getElementById(
            "products"
        );


    /*
     * 1. Pokušavamo da prikažemo
     * proizvode iz lokalnog keša.
     */

    const cachedProducts =
        getCachedProducts();


    if (
        cachedProducts &&
        cachedProducts.length
    ) {

        setProducts(
            cachedProducts
        );

    } else if (container) {

        container.innerHTML =
            "<p>Učitavanje proizvoda...</p>";

    }


    /*
     * 2. Ako je keš svež,
     * ne moramo odmah da šaljemo
     * novi zahtev Google-u.
     */

    if (
        cachedProducts &&
        isCacheFresh()
    ) {

        /*
         * Ipak ćemo u pozadini
         * proveriti podatke.
         */

        refreshProductsInBackground();

        return;

    }


    /*
     * 3. Ako nema keša ili je star,
     * učitavamo sveže podatke.
     */

    try {

        const freshProducts =
            await fetchProductsFromServer();


        saveProductsToCache(
            freshProducts
        );


        setProducts(
            freshProducts
        );


    } catch (error) {

        console.error(error);


        /*
         * Ako imamo stari keš,
         * njega ostavljamo prikazanim.
         */

        if (
            cachedProducts &&
            cachedProducts.length
        ) {

            setProducts(
                cachedProducts
            );

        } else if (container) {

            container.innerHTML = `

                <p>
                    Nije moguće učitati proizvode.
                </p>

            `;

        }

    }

}


/* =========================
   POZADINSKO OSVEŽAVANJE
========================= */

async function refreshProductsInBackground() {

    try {

        const freshProducts =
            await fetchProductsFromServer();


        saveProductsToCache(
            freshProducts
        );


        /*
         * Ako su podaci promenjeni,
         * odmah osvežavamo prikaz.
         */

        setProducts(
            freshProducts
        );


    } catch (error) {

        console.warn(
            "Pozadinsko osvežavanje nije uspelo:",
            error
        );

    }

}


/* =========================
   KATEGORIJE
========================= */

const CATEGORY_CACHE_KEY =
    "online_shop_categories";

const CATEGORY_CACHE_TIME_KEY =
    "online_shop_categories_time";


function getCachedCategories() {

    try {

        const cached =
            localStorage.getItem(
                CATEGORY_CACHE_KEY
            );

        if (!cached) {

            return null;

        }

        return JSON.parse(cached);

    } catch (error) {

        console.error(
            "Greška pri čitanju kategorija iz keša:",
            error
        );

        return null;

    }

}


function saveCategoriesToCache(
    categoriesData
) {

    try {

        localStorage.setItem(
            CATEGORY_CACHE_KEY,
            JSON.stringify(
                categoriesData
            )
        );

        localStorage.setItem(
            CATEGORY_CACHE_TIME_KEY,
            Date.now().toString()
        );

    } catch (error) {

        console.error(
            "Greška pri čuvanju kategorija:",
            error
        );

    }

}


function isCategoryCacheFresh() {

    try {

        const cacheTime =
            Number(
                localStorage.getItem(
                    CATEGORY_CACHE_TIME_KEY
                )
            );

        if (!cacheTime) {

            return false;

        }

        return (
            Date.now() - cacheTime <
            CACHE_DURATION
        );

    } catch (error) {

        return false;

    }

}


async function fetchCategoriesFromServer() {

    const response =
        await fetch(
            API_URL +
            "?action=categories"
        );

    if (!response.ok) {

        throw new Error(
            "Server nije dostupan."
        );

    }

    const data =
        await response.json();

    if (!data.success) {

        throw new Error(
            data.error ||
            "Greška pri učitavanju kategorija."
        );

    }

    return data.categories || [];

}


let categories = [];


function setCategories(
    categoriesData
) {

    categories =
        categoriesData || [];

    renderCategories();

}


async function loadCategories() {

    const cachedCategories =
        getCachedCategories();


    /*
     * Ako imamo keš,
     * prikaži kategorije ODMAH.
     */

    if (
        cachedCategories &&
        cachedCategories.length
    ) {

        setCategories(
            cachedCategories
        );

    }


    /*
     * Ako je keš svež,
     * osveži podatke u pozadini.
     */

    if (
        cachedCategories &&
        isCategoryCacheFresh()
    ) {

        refreshCategoriesInBackground();

        return;

    }


    /*
     * Ako nema keša ili je star,
     * uzmi sveže kategorije.
     */

    try {

        const freshCategories =
            await fetchCategoriesFromServer();

        saveCategoriesToCache(
            freshCategories
        );

        setCategories(
            freshCategories
        );

    } catch (error) {

        console.error(
            "Greška pri učitavanju kategorija:",
            error
        );

        /*
         * Ako imamo stari keš,
         * njega ostavljamo.
         */

        if (
            cachedCategories &&
            cachedCategories.length
        ) {

            setCategories(
                cachedCategories
            );

        }

    }

}


async function refreshCategoriesInBackground() {

    try {

        const freshCategories =
            await fetchCategoriesFromServer();

        saveCategoriesToCache(
            freshCategories
        );

        setCategories(
            freshCategories
        );

    } catch (error) {

        console.warn(
            "Pozadinsko osvežavanje kategorija nije uspelo:",
            error
        );

    }

}


function renderCategories() {

    const container =
        document.getElementById(
            "categories"
        );

    if (!container) {

        return;

    }

    container.innerHTML = "";


    /*
     * Uvek imamo kategoriju "Sve".
     */

    const allButton =
        document.createElement(
            "button"
        );

    allButton.className =
        "category-button active";

    allButton.textContent =
        "Sve";


    allButton.onclick = () => {

        document
            .querySelectorAll(
                ".category-button"
            )
            .forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );

        allButton.classList.add(
            "active"
        );

        renderProducts("Sve");

    };


    container.appendChild(
        allButton
    );


    /*
     * Kategorije dolaze direktno
     * iz Categories Google Sheeta.
     */

    categories.forEach(
        category => {

            /*
             * Apps Script vraća objekat:
             *
             * {
             *   id,
             *   name,
             *   active
             * }
             */

            const categoryName =
                typeof category === "string"
                    ? category
                    : category.name;


            if (!categoryName) {

                return;

            }


            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "category-button";

            button.textContent =
                categoryName;


            button.onclick = () => {

                document
                    .querySelectorAll(
                        ".category-button"
                    )
                    .forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                renderProducts(
                    categoryName
                );

            };


            container.appendChild(
                button
            );

        }
    );

}
/* =========================
   PROIZVODI
========================= */

function renderProducts(
    category = "Sve"
) {

    const container =
        document.getElementById(
            "products"
        );


    if (!container) {

        return;

    }


    let filteredProducts =
        products;


    if (
        category !== "Sve"
    ) {

        filteredProducts =
            products.filter(
                product =>
                    product.category ===
                    category
            );

    }


    container.innerHTML = "";


    const productCount =
        document.getElementById(
            "product-count"
        );


    if (productCount) {

        productCount.textContent =
            `${filteredProducts.length} proizvoda`;

    }


    if (
        filteredProducts.length === 0
    ) {

        container.innerHTML = `

            <p>
                Trenutno nema proizvoda.
            </p>

        `;

        return;

    }


    filteredProducts.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product";


            card.style.cursor =
                "pointer";


            /*
             * Klik na karticu otvara
             * stranicu proizvoda.
             */

            card.onclick =
                function(event) {

                    if (
                        event.target.closest(
                            ".add-button"
                        )
                    ) {

                        return;

                    }


                    window.location.href =
                        "product.html?id=" +
                        encodeURIComponent(
                            product.id
                        );

                };


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
                            ${formatPrice(
                                product.price
                            )}
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


            container.appendChild(
                card
            );

        }
    );

}


/* =========================
   KORPA
========================= */

function addToCart(productId) {

    const product =
        products.find(
            product =>
                String(product.id) ===
                String(productId)
        );


    if (!product) {

        return;

    }


    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
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


function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!item) {

        return;

    }


    item.quantity += amount;


    if (
        item.quantity <= 0
    ) {

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

        (
            total,
            item
        ) =>

            total +
            Number(item.price) *
            item.quantity,

        0

    );

}


function getCartCount() {

    return cart.reduce(

        (
            total,
            item
        ) =>

            total +
            item.quantity,

        0

    );

}


function updateCart() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );


    if (cartCount) {

        cartCount.textContent =
            getCartCount();

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(
                getCartTotal()
            );

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(
                getCartTotal()
            );

    }


    renderCart();

}


/* =========================
   PRIKAZ KORPE
========================= */

function renderCart() {

    const container =
        document.getElementById(
            "cart-items"
        );


    if (!container) {

        return;

    }


    if (
        cart.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-cart">

                Korpa je prazna.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    cart.forEach(
        item => {

            const row =
                document.createElement(
                    "div"
                );


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
                        ${formatPrice(
                            item.price
                        )}
                    </p>

                </div>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            -1
                        )"
                    >

                        −

                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        onclick="changeQuantity(
                            ${item.id},
                            1
                        )"
                    >

                        +

                    </button>

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =========================
   MODALI
========================= */

function openCart() {

    const modal =
        document.getElementById(
            "cart-modal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeCart() {

    const modal =
        document.getElementById(
            "cart-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


function openCheckout() {

    if (
        cart.length === 0
    ) {

        alert(
            "Korpa je prazna."
        );

        return;

    }


    closeCart();


    const modal =
        document.getElementById(
            "checkout-modal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeCheckout() {

    const modal =
        document.getElementById(
            "checkout-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


function closeSuccess() {

    const modal =
        document.getElementById(
            "success-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================
   PORUDŽBINA
========================= */

const orderForm =
    document.getElementById(
        "order-form"
    );


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (
                cart.length === 0
            ) {

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
                    cart.map(
                        item => ({

                            id:
                                item.id,

                            name:
                                item.name,

                            quantity:
                                item.quantity,

                            price:
                                item.price

                        })
                    ),


                total:
                    getCartTotal()

            };


            const form =
                document.createElement(
                    "form"
                );


            form.method =
                "POST";


            form.action =
                API_URL;


            form.target =
                "order-frame";


            form.style.display =
                "none";


            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "hidden";


            input.name =
                "data";


            input.value =
                JSON.stringify(
                    order
                );


            form.appendChild(
                input
            );


            document.body.appendChild(
                form
            );


            form.submit();


            form.remove();


            closeCheckout();


            const successModal =
                document.getElementById(
                    "success-modal"
                );


            if (successModal) {

                successModal.classList.add(
                    "show"
                );

            }


            cart = [];


            updateCart();


            this.reset();

        }
    );

}


/* =========================
   INVISIBLE FRAME
========================= */

const orderFrame =
    document.createElement(
        "iframe"
    );


orderFrame.name =
    "order-frame";


orderFrame.style.display =
    "none";


document.body.appendChild(
    orderFrame
);


/* =========================
   DODAVANJE PROIZVODA
   SA PRODUCT.HTML
========================= */

function addPendingProductToCart() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("add");


    if (!productId) {

        return;

    }


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        return;

    }


    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
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


    window.history.replaceState(
        {},
        document.title,
        "index.html"
    );


    localStorage.removeItem(
        "pendingProduct"
    );

}


/* =========================
   START
========================= */

Promise.all([
    loadProducts(),
    loadCategories()
]).then(() => {

    addPendingProductToCart();

});
