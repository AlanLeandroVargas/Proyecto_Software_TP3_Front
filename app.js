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
    
async function retrieveProducts(search = '%00', category = '%00')
{
    try
    {        
        const response = await fetch
            (`http://localhost:5166/api/Product?name=${search}&category=${category}&offset=${currentOffset}&limit=12`);
        if (!response.ok) {            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }                
        const data = await response.json(); // Wait for the response to be parsed as JSON    
        console.log(response);
        console.log('Payload'); 
        console.log(data);   
        return data;
    }
    catch
    {
        console.error('Error fetching data:', error);
    }    
}
//Render
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
        productName.innerHTML = product.name;
        productNameContainer.appendChild(productName);
        contentResultContainer.appendChild(productNameContainer);

        let priceAndCartContainer = document.createElement('section');
        priceAndCartContainer.classList.add("price-and-cart-container");
        
        let priceContainer = document.createElement('section');
        priceContainer.classList.add("price-container");
        let price = document.createElement('p');
        price.innerHTML = "$" + product.price;
        priceContainer.appendChild(price);
        priceAndCartContainer.appendChild(priceContainer);

        let shoppingCartButton = document.createElement('button');
        shoppingCartButton.classList.add("shopping-cart-icon-container");
        shoppingCartButton.addEventListener('click', (e) => {
            addProduct(product.id); 
            e.stopPropagation();                       
        })
        let icon = document.createElement('i');
        icon.classList.add("fa-solid");
        icon.classList.add("fa-cart-shopping");
        icon.classList.add("fa-xl");        
        shoppingCartButton.appendChild(icon);
        priceAndCartContainer.appendChild(shoppingCartButton);

        contentResultContainer.appendChild(priceAndCartContainer);

        newCard.appendChild(contentResultContainer);
        ITEM_SECTION.append(newCard);
    });
    let pageNextToggle = document.createElement('button');
    pageNextToggle.addEventListener('click', nextPage);
    pageNextToggle.classList.add('page-toggle');
    pageNextToggle.innerHTML = "Next";
    ITEM_SECTION.appendChild(pageNextToggle);

    let pagePreviousToggle = document.createElement('button');
    pagePreviousToggle.addEventListener('click', previousPage);
    pagePreviousToggle.classList.add('page-toggle');
    pagePreviousToggle.innerHTML = "Previous";
    ITEM_SECTION.appendChild(pagePreviousToggle);
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

const ITEM_SECTION = document.querySelector('.item-section');
console.log(ITEM_SECTION);
let apiData;
let currentOffset = 0; 
createItemSection();

//document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;

//Search
const searchBar = document.querySelector('#searchBar');
searchBar.addEventListener('input', (e) =>
    {        
        disposeCards();
        createItemSection(e.target.value)
    });

//Category Filter
function filterByCategory(category)
{
    console.log('Here');
    disposeCards();
    createItemSection('%00', category);
}



