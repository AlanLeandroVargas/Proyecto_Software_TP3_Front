let shoppingCart = 
        {
            products: []
        };

//Retrieving Data
document.addEventListener('DOMContentLoaded', () => 
    {        
        let storedUserShoppingCart = getCookie('shoppingCart');
        if(storedUserShoppingCart != undefined)
            {
                let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
                shoppingCart = parsedStoredUserShoppingCart;
                renderItemsAmount(shoppingCart.products.length);
            }
        else
        {
            
        }      
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
        
        return data;       
    }
    catch
    {
        console.error('Error fetching data:', error);
    }
}
//Render
function renderModal()
{
    const MODAL = document.querySelector('.modal');
    const PRICE_SECTION_HEADER = document.querySelector('.price-section-header');
    const PRODUCT_NAME = document.querySelector('.product-name');
    let productName = PRICE_SECTION_HEADER.firstChild.innerHTML;
    PRODUCT_NAME.innerHTML = productName;
    MODAL.style.display = 'block';
    window.onclick = function(event) {
    if (event.target == MODAL) {
        MODAL.style.display = "none";
        }
    }
}
function renderItemsAmount(productAmount)
{
    if(productAmount != 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}
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
    let productPriceWithoutDiscount = document.createElement('p');
    productPriceWithoutDiscount.innerHTML = "$" + formatNumber(product.price);
    if(product.discount > 0)
        {
            productPriceWithoutDiscount.classList.add('price-without-discount');
            let priceWithDiscountContainer = document.createElement('section');
            priceWithDiscountContainer.classList.add('price-with-discount-container');
            let priceWithDiscount = document.createElement('p');                
            let actualPrice = product.price - (product.price * (product.discount / 100));
            priceWithDiscount.innerHTML = "$" + formatNumber(actualPrice);
            let percentageOff = document.createElement('p');
            percentageOff.classList.add('percentage-off');
            percentageOff.innerHTML = `${product.discount}% OFF`;
            priceWithDiscountContainer.appendChild(priceWithDiscount);
            priceWithDiscountContainer.appendChild(percentageOff);                
            priceSectionContent.appendChild(productPriceWithoutDiscount);
            priceSectionContent.appendChild(priceWithDiscountContainer);

        }
    else
    {
        priceSectionContent.appendChild(productPriceWithoutDiscount);
    }
    
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
    let shoppingCartInfoString = JSON.stringify(shoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
    renderItemsAmount(shoppingCart.products.length);
    renderModal();
}

const ITEM_SECTION = document.querySelector('.product-container');
createProductDetails();

