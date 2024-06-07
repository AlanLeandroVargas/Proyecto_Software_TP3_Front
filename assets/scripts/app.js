let shoppingCart = 
        {
            products: []
        };
let shoppingCartInfoString; 
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
    })

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
    
async function retrieveProducts(search = '%00', category = '%00')
{
    try
    {        
        const response = await fetch
            (`http://localhost:5166/api/Product?name=${search}&category=${category}&offset=${currentOffset}&limit=12`);
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
function renderItemsAmount(productAmount)
{
    if(productAmount > 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}
function createCards(products)
{    
    products.forEach(product => {
        let newCard = document.createElement('article');
        newCard.classList.add("item-card");
        newCard.addEventListener('click', () => {openDetailProductPage(product.id)});
        let cardImageContainer = document.createElement('section');
        cardImageContainer.classList.add("image-container");
        let cardImage = document.createElement('img');
        cardImage.src = product.imageUrl;
        cardImageContainer.appendChild(cardImage);
        newCard.appendChild(cardImageContainer);

        let contentResultContainer = document.createElement('section');
        contentResultContainer.classList.add("content-result-container");

        let productNameContainer = document.createElement('section');
        productNameContainer.classList.add("name-container");
        let productName = document.createElement('h5');
        let productNameString = product.name;        
        if(productNameString.length > 42)
            {                
                productNameString = productNameString.slice(0, 42);
                productNameString = productNameString + '...';                
            }
        productName.innerHTML = productNameString;
        productNameContainer.appendChild(productName);
        contentResultContainer.appendChild(productNameContainer);

        let priceAndCartContainer = document.createElement('section');
        priceAndCartContainer.classList.add("price-and-cart-container");
        
        let priceContainer = document.createElement('section');
        priceContainer.classList.add("price-container");
        let priceWithoutDiscount = document.createElement('p');
        
        priceWithoutDiscount.innerHTML = "$" + formatNumber(product.price);
        if(product.discount > 0)
            {
                priceWithoutDiscount.classList.add('price-without-discount');
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
                priceContainer.appendChild(priceWithoutDiscount);
                priceContainer.appendChild(priceWithDiscountContainer);

            }
        else
        {
            priceContainer.appendChild(priceWithoutDiscount);
        }
        
        priceAndCartContainer.appendChild(priceContainer);
        contentResultContainer.appendChild(priceAndCartContainer);

        newCard.appendChild(contentResultContainer);
        ITEM_SECTION.append(newCard);
    });    

    let pagePreviousToggle = document.createElement('button');
    pagePreviousToggle.addEventListener('click', previousPage);
    pagePreviousToggle.classList.add('page-toggle');
    pagePreviousToggle.innerHTML = "Anterior";
    ITEM_SECTION.appendChild(pagePreviousToggle);    
    let pageNextToggle = document.createElement('button');
    pageNextToggle.addEventListener('click', nextPage);
    pageNextToggle.classList.add('page-toggle');
    pageNextToggle.innerHTML = "Siguiente";
    ITEM_SECTION.appendChild(pageNextToggle);    
}
//Rendering - Paginado
function nextPage()
{    
    currentOffset += 12; 
    ITEM_SECTION.innerHTML = '';    
    createItemSection();
}
function previousPage()
{
    currentOffset -= 12; 
    ITEM_SECTION.innerHTML = '';    
    createItemSection();
}
//Rendering - CardCreation
async function createItemSection(search = '%00', category = '%00')
{
    let products = await retrieveProducts(search, category);
    createCards(products);
}
function disposeCards()
{
    ITEM_SECTION.innerHTML = ""
}
//Redirectioning
function openDetailProductPage(value)
{    
    window.open('./DetailProduct.html?value=' + encodeURIComponent(value), '_self');
}
// Functionality 
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
function toggleCategory(number)
{
    let circle = document.querySelector(`.filter-${number}`);    
    circle.classList.toggle('active');
    for (let index = 1; index < 11; index++) {
        if(index != number)
            {
                let currentCircle = document.querySelector(`.filter-${index}`);
                if(currentCircle.classList.contains('active')){currentCircle.classList.toggle('active');}
            }                
    }
}
//Category Filter
function filterByCategory(category, number)
{    
    let categoryFilter = document.getElementById(`${category.toLowerCase()}`); 
    if(categoryFilter.classList.contains('active'))
        {
            categoryFilter.classList.toggle('active');
            disposeCards();
            createItemSection();
        }
    else
    {
        categoryFilter.classList.toggle('active');
        disposeCards();
        createItemSection('%00', category);
    }
    console.log(categoryFilter);
    toggleCategory(number);    
}
//Search
const searchBar = document.querySelector('#searchBar');
searchBar.addEventListener('input', (e) =>
    {        
        let activeCategory = document.querySelector('.active');        
        if(activeCategory != null){activeCategory.classList.toggle('active')};  
        disposeCards();
        createItemSection(e.target.value)
    });

const ITEM_SECTION = document.querySelector('.item-section-content');
let apiData;
let currentOffset = 0; 
createItemSection();









