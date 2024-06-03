//Retrieving Data
async function retrieveProducts()
{
    try
    {        
        const response = await fetch(`http://localhost:5166/api/Product?offset=${currentOffset}&limit=12`);
        if (!response.ok) {
            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }        
        const data = await response.json(); // Wait for the response to be parsed as JSON        
        return data;
    }
    catch
    {
        console.error('Error fetching data:', error);
    }    
}

async function fetchProductsWithFiltering(search)
{        
    try
    {        
        const response = await fetch(`http://localhost:5166/api/Product?name=${search}&offset=${currentOffset}&limit=12`);
        if (!response.ok) {
            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }        
        const data = await response.json(); // Wait for the response to be parsed as JSON
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
        newCard.classList.add("ItemCard");
        newCard.addEventListener('click', () => {openDetailProductPage(product.id)});
        let cardImageContainer = document.createElement('section');
        cardImageContainer.classList.add("ImageContainer");
        let cardImage = document.createElement('img');
        cardImage.src = product.imageUrl;
        cardImageContainer.appendChild(cardImage);
        newCard.appendChild(cardImageContainer);

        let contentResultContainer = document.createElement('section');
        contentResultContainer.classList.add("ContentResultContainer");

        let productNameContainer = document.createElement('section');
        productNameContainer.classList.add("NameContainer");
        let productName = document.createElement('h5');
        productName.innerHTML = product.name;
        productNameContainer.appendChild(productName);
        contentResultContainer.appendChild(productNameContainer);

        let priceAndCartContainer = document.createElement('section');
        priceAndCartContainer.classList.add("PriceAndCartContainer");
        
        let priceContainer = document.createElement('section');
        priceContainer.classList.add("PriceContainer");
        let price = document.createElement('p');
        price.innerHTML = "$" + product.price;
        priceContainer.appendChild(price);
        priceAndCartContainer.appendChild(priceContainer);

        let shoppingCartButton = document.createElement('button');
        shoppingCartButton.classList.add("ShoppingCartIconContainer");
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
    pageNextToggle.classList.add('PageToggle');
    pageNextToggle.innerHTML = "Next";
    ITEM_SECTION.appendChild(pageNextToggle);

    let pagePreviousToggle = document.createElement('button');
    pagePreviousToggle.addEventListener('click', previousPage);
    pagePreviousToggle.classList.add('PageToggle');
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
async function createItemSection()
{
    let products = await retrieveProducts()        
    createCards(products);
}
async function CreateSearchedItemSection(search)
{
    let products = await fetchProductsWithFiltering(search);
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

const ITEM_SECTION = document.querySelector('.ItemSection');
console.log(ITEM_SECTION);
let apiData;
let currentOffset = 0;
let shoppingCart = 
    {
        products: []
    };

createItemSection();
let shoppingCartInfoString = JSON.stringify(shoppingCart); 
document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;

const searchBar = document.querySelector('#searchBar');
searchBar.addEventListener('input', (e) =>
    {        
        disposeCards();
        CreateSearchedItemSection(e.target.value)
    });



