document.addEventListener('DOMContentLoaded', async () => 
    {        
        let sales =  await fetchSales();
        console.log(sales);
    })
//Retrieving Data
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
async function FetchProducts(parsedStoredUserShoppingCart) {    
    let productsAndQuantities = [];
    for(const product of parsedStoredUserShoppingCart.products)
        {
            try
            {
                const response = await fetch(`http://localhost:5166/api/Product/${product.productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json(); 
                productsAndQuantities.push({
                    product: data,
                    quantity: product.quantity
                })
            }
            catch
            {
                console.error('Error fetching data:', error);
            }
        }
    return productsAndQuantities;
}
async function fetchSales(from = null, to = null)
{
    try
    {
        const response = await fetch(`http://localhost:5166/api/Sale?from=2024%2F05%2F30&to=2024%2F06%2F30`);
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
function createCards(productsAndQuantities)
{   
    productsAndQuantities.forEach(product => {
        let newCard = document.createElement('section');
        newCard.classList.add('product-container');
        newCard.classList.add('id-' + product.product.id);

        let productContentContainer = document.createElement('section');
        productContentContainer.classList.add('product-content-container')        

        let productImageContainer = document.createElement('section');
        productImageContainer.classList.add('product-image-container');
        let productImage = document.createElement('img');
        productImage.src = product.product.imageUrl;
        productImageContainer.appendChild(productImage);
        productContentContainer.appendChild(productImageContainer);

        let productInformationContainer = document.createElement('section');
        productInformationContainer.classList.add('product-information-container');
        let productNameContainer = document.createElement('section');
        productNameContainer.classList.add('product-name-container');
        let productName = document.createElement('h3');
        productName.innerHTML = product.product.name;
        productNameContainer.appendChild(productName);
        productInformationContainer.appendChild(productNameContainer);
        let productBtnContainer = document.createElement('section');
        productBtnContainer.classList.add('btn-container');
        let productBtn = document.createElement('button');
        productBtn.innerHTML = "Eliminar";
        productBtn.addEventListener('click', () => {
            deleteProduct(product.product.id);
        })
        productBtnContainer.appendChild(productBtn);
        productInformationContainer.appendChild(productBtnContainer);
        let productQuantityPriceContainer = document.createElement('section');
        productQuantityPriceContainer.classList.add('quantity-price-container');
        let productQuantityContainer = document.createElement('section');

        //Quantity Section
        productQuantityContainer.classList.add('quantity-container')

        let increaseBtn = document.createElement('button');
        increaseBtn.classList.add('quantity-button');
        increaseBtn.innerText = "+";        
        increaseBtn.addEventListener('click', () => {
            addProduct(product.product.id)
        });

        let quantity = document.createElement('span');
        quantity.classList.add('quantity-' + product.product.id);
        quantity.innerHTML = product.quantity;
        let decreaseBtn = document.createElement('button');
        decreaseBtn.classList.add('quantity-button');
        decreaseBtn.innerText = "-";
        decreaseBtn.addEventListener('click', () => {
            removeProduct(product.product.id);
        })
        productQuantityContainer.appendChild(decreaseBtn);        
        productQuantityContainer.appendChild(quantity);
        productQuantityContainer.appendChild(increaseBtn);
        productQuantityPriceContainer.appendChild(productQuantityContainer);
        let price = document.createElement('h3');
        price.innerHTML = "$ " + formatNumber(product.product.price);
        productQuantityPriceContainer.appendChild(price);
        productInformationContainer.appendChild(productQuantityPriceContainer);
        productContentContainer.appendChild(productInformationContainer);

        newCard.appendChild(productContentContainer);
        PRODUCT_LIST.append(newCard);
    });
}
async function renderCards() //WTF is this?
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
    console.log(parsedStoredUserShoppingCart);
    let productsAndQuantities = await FetchProducts(parsedStoredUserShoppingCart);
    createCards(productsAndQuantities);
}
async function renderSummary()
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);  
    let productsAndQuantities = await FetchProducts(parsedStoredUserShoppingCart);
    let total = await ComputeAll(productsAndQuantities);    
    PRICE_TOTAL.innerHTML = total;
    let quantity = computeQuantity(productsAndQuantities);
    PRODUCT_QUANTITY.innerHTML = quantity;
}
function updateProductQuantities(productId, add, amount)
{
    if(add)
        {
            let productQuantity = document.querySelector(`.quantity-${productId}`);
            productQuantity.innerHTML = parseInt(productQuantity.innerHTML) + 1;
            updateSummaryQuantities(true, amount);
        }
    else
    {
        let productQuantity = document.querySelector(`.quantity-${productId}`);
        productQuantity.innerHTML = parseInt(productQuantity.innerHTML) - 1;
        updateSummaryQuantities(false, amount);
    }
    
}
function updateSummaryQuantities(add, amount)
{
    let productsQuantities = document.querySelector('.price-product-quantity');
    if(add)
        {
            productsQuantities.innerHTML = parseInt(productsQuantities.innerHTML) + amount;
        }
    else
    {
        productsQuantities.innerHTML = parseInt(productsQuantities.innerHTML) - amount;
    }
}
function deleteProductCard(productId)
{
    let productCard = document.querySelector(`.id-${productId}`);    
    productCard.remove();
    
}
//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
async function BuyShoppingCart()
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);  
    let products = parsedStoredUserShoppingCart.products;
    let productsAndQuantities = await FetchProducts(parsedStoredUserShoppingCart);
    subTotal = ComputeSubTotal(productsAndQuantities);
    totalDiscount = ComputeTotalDiscount(productsAndQuantities);
    totalPayed = ComputeTotal(subTotal, totalDiscount, 1.21);
    console.log(parsedStoredUserShoppingCart);
    realData = 
    {
        products,
        totalPayed
    };
    console.log(realData);
    console.log(await InsertSale(realData));
}
async function InsertSale(data)
{
    const response = await fetch('http://localhost:5166/api/Sale', {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)        
    })
    console.log(JSON.stringify(data));
    return response.json();
}
async function ComputeAll(productsAndQuantities)
{        
    let subTotal = ComputeSubTotal(productsAndQuantities);    
    let totalDiscount = ComputeTotalDiscount(productsAndQuantities);    
    let total = ComputeTotal(subTotal, totalDiscount, 1.21);
    let roundedTotal = formatNumber(total);
    return roundedTotal;
}
function ComputeSubTotal(productsAndQuantities)
{    
    total = 0;    
    productsAndQuantities.forEach(product => {        
        total += product.product.price * product.quantity        
    });
    return total;
}
function ComputeTotalDiscount(productsAndQuantities)
{
    totalDiscount = 0;
    productsAndQuantities.forEach(product => {
        if(product.product.discount > 0)
            {
                percentage = product.product.discount / 100;
                unitDiscount = product.product.price * percentage;
                totalDiscount += product.quantity * unitDiscount;
            }
    })
    return totalDiscount;
}
function ComputeTotal(subTotal, totalDiscount, taxes)
{
    total = (subTotal - totalDiscount) * taxes;
    return total;
}
function computeQuantity(productsAndQuantities)
{
    let quantity = 0;
    productsAndQuantities.forEach(product => {  
        quantity += product.quantity;
    });
    return quantity;
}

function addProduct(productId)
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);
    let product = parsedStoredUserShoppingCart.products.find(p => p.productId == productId);
    if(product)
        {
            product.quantity += 1;
        }
    shoppingCartInfoString = JSON.stringify(parsedStoredUserShoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
    updateProductQuantities(productId, true, 1);
}
function removeProduct(productId)
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);
    let product = parsedStoredUserShoppingCart.products.find(p => p.productId == productId);    
    if(product && product.quantity > 1)
        {
            product.quantity -= 1;
            shoppingCartInfoString = JSON.stringify(parsedStoredUserShoppingCart); 
            document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;
            updateProductQuantities(productId, false, 1);
        }    
}
function deleteProduct(productId)
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);      
    let product = parsedStoredUserShoppingCart.products.find(p => p.productId == productId);
    let indexProduct = parsedStoredUserShoppingCart.products.findIndex(p => p.productId == productId);    
    parsedStoredUserShoppingCart.products.splice(indexProduct, 1);
    shoppingCartInfoString = JSON.stringify(parsedStoredUserShoppingCart); 
    document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;   
    updateSummaryQuantities(false, product.quantity);
    deleteProductCard(productId);
}



const PRODUCT_LIST = document.querySelector('.product-list-section');
const PRICE_TOTAL = document.querySelector('.price-total-value');
const PRODUCT_QUANTITY = document.querySelector('.price-product-quantity');
renderCards();
renderSummary();