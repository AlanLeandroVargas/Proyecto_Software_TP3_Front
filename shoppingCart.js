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
//Render
function createCards(productsAndQuantities)
{   
    productsAndQuantities.forEach(product => {
        let newCard = document.createElement('section');
        newCard.classList.add('product-container');

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
        productBtnContainer.appendChild(productBtn);
        productInformationContainer.appendChild(productBtnContainer);
        let productQuantityPriceContainer = document.createElement('section');
        productQuantityPriceContainer.classList.add('quantity-price-container');
        let productQuantityContainer = document.createElement('section');
        productQuantityContainer.classList.add('quantity-container')
        let increaseBtn = document.createElement('button');
        increaseBtn.classList.add('quantity-button');
        increaseBtn.innerText = "+";
        let quantity = document.createElement('span');
        quantity.innerHTML = 1;
        let decreaseBtn = document.createElement('button');
        decreaseBtn.classList.add('quantity-button');
        decreaseBtn.innerText = "-";
        productQuantityContainer.appendChild(decreaseBtn);        
        productQuantityContainer.appendChild(quantity);
        productQuantityContainer.appendChild(increaseBtn);
        productQuantityPriceContainer.appendChild(productQuantityContainer);
        let price = document.createElement('h3');
        price.innerHTML = "$ " + product.product.price;
        productQuantityPriceContainer.appendChild(price);
        productInformationContainer.appendChild(productQuantityPriceContainer);
        productContentContainer.appendChild(productInformationContainer);
        newCard.appendChild(productContentContainer);
        ProductList.append(newCard);
    });
}
//Functionality
async function fuckem() //WTF is this?
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
    let productsAndQuantities = await FetchProducts(parsedStoredUserShoppingCart);
    createCards(productsAndQuantities);
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
async function ComputeAll()
{    
    let subTotal = ComputeSubTotal(productsAndQuantities);
    console.log(productsAndQuantities);
    console.log(subTotal);
    let totalDiscount = ComputeTotalDiscount(productsAndQuantities);
    console.log("TOTAL DISCOUNT");
    console.log(totalDiscount);
    let total = ComputeTotal(subTotal, totalDiscount, 1.21);
    console.log("TOTAL");
    console.log(total);
}
function ComputeSubTotal(productsAndQuantities)
{    
    total = 0;
    console.log(productsAndQuantities.length);
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
const PRODUCT_LIST = document.querySelector('.product-list-section')
