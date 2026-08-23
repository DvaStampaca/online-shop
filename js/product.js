const API_URL =
    "https://script.google.com/macros/s/AKfycbzU3FNFs2QOdB0CSwmbb9qB1cs0yAqijtRX_AUOq37q3bhnbxF4wMIP2qaXobXULotOtg/exec";


function formatPrice(price) {

    return Number(price).toLocaleString("sr-RS")
        + " RSD";

}


async function loadProduct() {

    const container =
        document.getElementById(
            "product-page"
        );


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        container.innerHTML = `
            <h2>Proizvod nije pronađen.</h2>
        `;

        return;

    }


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


        const product =
            data.products.find(
                item =>
                    String(item.id) ===
                    String(productId)
            );


        if (!product) {

            container.innerHTML = `
                <h2>Proizvod nije pronađen.</h2>
            `;

            return;

        }


        renderProduct(product);


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <h2>
                Nije moguće učitati proizvod.
            </h2>
        `;

    }

}


function renderProduct(product) {

    const container =
        document.getElementById(
            "product-page"
        );


    const images =
        product.images &&
        product.images.length
            ? product.images
            : [product.image];


    container.innerHTML = `

        <a
            href="index.html"
            class="back-link"
        >
            ← Nazad na proizvode
        </a>


        <div class="product-detail">


            <div class="product-gallery">

                <img
                    id="main-product-image"
                    class="main-product-image"
                    src="${images[0]}"
                    alt="${product.name}"
                >


                <div
                    class="product-thumbnails"
                    id="product-thumbnails"
                ></div>

            </div>


            <div class="product-detail-info">

                <div class="product-detail-category">
                    ${product.category}
                </div>


                <h1 class="product-detail-title">
                    ${product.name}
                </h1>


                <div class="product-detail-price">
                    ${formatPrice(product.price)}
                </div>


                <div class="product-detail-description">
                    ${
                        product.detailedDescription ||
                        product.description ||
                        ""
                    }
                </div>


                <button
                    class="detail-add-button"
                    onclick="addProductToCart()"
                >
                    🛒 Dodaj u korpu
                </button>

            </div>

        </div>

    `;


    renderThumbnails(images);


    window.currentProduct =
        product;

}


function renderThumbnails(images) {

    const container =
        document.getElementById(
            "product-thumbnails"
        );


    const mainImage =
        document.getElementById(
            "main-product-image"
        );


    container.innerHTML = "";


    images.forEach(
        (image, index) => {

            const thumbnail =
                document.createElement(
                    "img"
                );


            thumbnail.src = image;

            thumbnail.className =
                "product-thumbnail";


            if (index === 0) {

                thumbnail.classList.add(
                    "active"
                );

            }


            thumbnail.onclick = () => {

                mainImage.src = image;


                document
                    .querySelectorAll(
                        ".product-thumbnail"
                    )
                    .forEach(
                        img =>
                            img.classList.remove(
                                "active"
                            )
                    );


                thumbnail.classList.add(
                    "active"
                );

            };


            container.appendChild(
                thumbnail
            );

        }
    );

}


function addProductToCart() {

    const product =
        window.currentProduct;


    if (!product) return;


    /*
       Za sada vraćamo korisnika na shop.
       Sledeći korak je da korpu čuvamo
       u localStorage-u kako bi bila ista
       na index.html i product.html.
    */

    localStorage.setItem(
        "pendingProduct",
        JSON.stringify(product)
    );


    window.location.href =
        "index.html?add=" +
        encodeURIComponent(
            product.id
        );

}


loadProduct();
