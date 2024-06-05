let shoppingCart = 
        {
            products: []
        };
let shoppingCartInfoString; 

//Retrieving Data
document.addEventListener('DOMContentLoaded', () => 
    {        
        let storedUserShoppingCart = getCookie('shoppingCart');
        let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
        shoppingCart = parsedStoredUserShoppingCart;
        console.log(shoppingCart);
    })

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}    
function getQueryParams() {
    let params = {};
    window.location.search.substring(1).split("&").forEach(function(part) {
        let item = part.split("=");
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
    });
    return params;
}
async function fetchProduct()
{
    let params = getQueryParams();
    let value = params["value"];
    try
    {
        const response = await fetch(`http://localhost:5166/api/Product/${value}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); 
        console.log(data);
        return data;       
    }
    catch
    {
        console.error('Error fetching data:', error);
    }
}
//Render
async function createProductDetails()
{
    let product = await fetchProduct();
    let ImageContainer = document.createElement('section');
    ImageContainer.classList.add('image-container');
    let productImage = document.createElement('img');
    productImage.src = product.imageUrl;
    ImageContainer.appendChild(productImage);
    ITEM_SECTION.append(ImageContainer);

    let productDetailContainer = document.createElement('section');
    productDetailContainer.classList.add('product-detail-container');
    let productDetailContainerHeader = document.createElement('section');
    productDetailContainerHeader.classList.add('product-detail-container-header');
    let detailHeader = document.createElement('h2');
    detailHeader.innerHTML = "Descripcion";
    productDetailContainerHeader.appendChild(detailHeader);
    productDetailContainer.appendChild(productDetailContainerHeader);
    let productDetailContainerContent = document.createElement('section');
    productDetailContainerContent.classList.add('product-detail-container-content');
    let detail = document.createElement('h4')
    detail.innerHTML = product.description;
    productDetailContainerContent.appendChild(detail);
    productDetailContainer.appendChild(productDetailContainerContent);
    ITEM_SECTION.append(productDetailContainer)
    
    let priceSectionContainer = document.createElement('section');
    priceSectionContainer.classList.add('price-section-container');

    // Price Header
    let priceSectionHeader = document.createElement('section');
    priceSectionHeader.classList.add('price-section-header')
    let productName = document.createElement('h4');
    productName.innerHTML = product.name;
    priceSectionHeader.appendChild(productName);
    priceSectionContainer.appendChild(priceSectionHeader);

    //Price Content
    let priceSectionContent = document.createElement('section');
    priceSectionContent.classList.add('price-section-content');
    let productPrice = document.createElement('h3');
    productPrice.innerHTML = "$" + formatNumber(product.price);
    priceSectionContent.appendChild(productPrice);
    priceSectionContainer.appendChild(priceSectionContent);

    //Price Bottom
    let priceSectionBottom = document.createElement('section');
    priceSectionBottom.classList.add('price-section-bottom');
    let cartBtnContainer = document.createElement('section');
    cartBtnContainer.classList.add('cart-btn-container');
    let cartBtn = document.createElement('button');
    cartBtn.classList.add('cart-btn');
    cartBtn.innerText = "Agregar al carrito"
    cartBtn.addEventListener('click', () => {
        addProduct(product.id); 
    })
    // let cartBtnText = document.createElement('h3');
    // // cartBtnText.innerHTML = "Agregar al carrito";
    // // cartBtn.appendChild(cartBtnText);
    cartBtnContainer.appendChild(cartBtn);
    priceSectionBottom.appendChild(cartBtnContainer);
    priceSectionContainer.appendChild(priceSectionBottom);

    ITEM_SECTION.append(priceSectionContainer);
}
//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
function addProduct(productId)
{
    let product = shoppingCart.products.find(p => p.productId == productId);
    if(product)
        {
            product.quantity += 1;
        }
    else
    {
        shoppingCart.products.push({
            productId: productId,
            quantity: 1
        });
    }    
    shoppingCartInfoString = JSON.stringify(shoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
}

const ITEM_SECTION = document.querySelector('.product-container');
console.log(ITEM_SECTION);
createProductDetails();

