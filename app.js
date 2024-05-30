const ItemSection = document.querySelector('.ItemSection');
console.log(ItemSection);
let apiData;
let currentOffset = 0;
let shoppingCart = 
    {
        products: []
    };

CreateItemSection();
let shoppingCartInfoString = JSON.stringify(shoppingCart); 
document.cookie = `shoppingCart=${encodeURIComponent(shoppingCartInfoString)}; path=/; max-age=3600`;

function RetrieveProducts()
{
    return fetch(`http://localhost:5166/api/Product?offset=${currentOffset}&limit=12`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
        })
    .then(data => {
        apiData = data;        
        })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        });
}
function CreateItemSection()
{
    RetrieveProducts().then(() => {
        // Ensure fetchData() has completed before using apiData
        console.log('apiData after fetching:', apiData);
        // Use apiData here
        CreateCards(apiData);
        });
}

function CreateCards(products)
{
    products.forEach(product => {
        let newCard = document.createElement('article');
        newCard.classList.add("ItemCard");
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
        let productName = document.createElement('h4');
        productName.innerHTML = product.name;
        productNameContainer.appendChild(productName);
        contentResultContainer.appendChild(productNameContainer);

        let priceContainer = document.createElement('section');
        priceContainer.classList.add("PriceContainer");
        let price = document.createElement('p');
        price.innerHTML = "$" + product.price;
        priceContainer.appendChild(price);
        contentResultContainer.appendChild(priceContainer);

        let shoppingCartIconContainer = document.createElement('section');
        shoppingCartIconContainer.classList.add("ShoppingCartIconContainer");
        let icon = document.createElement('i');
        icon.classList.add("fa-solid");
        icon.classList.add("fa-cart-shopping");
        icon.classList.add("fa-xl");
        icon.addEventListener('click', () => {
            AddProduct(product.id);            
        });
        shoppingCartIconContainer.appendChild(icon);
        contentResultContainer.appendChild(shoppingCartIconContainer);

        newCard.appendChild(contentResultContainer);
        ItemSection.append(newCard);
    });
    let pageNextToggle = document.createElement('button');
    pageNextToggle.addEventListener('click', NextPage);
    pageNextToggle.classList.add('PageToggle');
    pageNextToggle.innerHTML = "Next";
    ItemSection.appendChild(pageNextToggle);

    let pagePreviousToggle = document.createElement('button');
    pagePreviousToggle.addEventListener('click', PreviousPage);
    pagePreviousToggle.classList.add('PageToggle');
    pagePreviousToggle.innerHTML = "Previous";
    ItemSection.appendChild(pagePreviousToggle);
}

function NextPage()
{    
    currentOffset += 12; 
    ItemSection.innerHTML = '';    
    CreateItemSection();
}
function PreviousPage()
{
    currentOffset -= 12; 
    ItemSection.innerHTML = '';    
    CreateItemSection();
}
function AddProduct(productId)
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