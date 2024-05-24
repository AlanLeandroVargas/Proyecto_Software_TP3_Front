const ItemSection = document.querySelector('.ItemSection');
console.log(ItemSection);
let apiData;

function RetrieveProducts()
{
    return fetch('http://localhost:5166/api/Product?offset=0&limit=12')
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
RetrieveProducts().then(() => {
    // Ensure fetchData() has completed before using apiData
    console.log('apiData after fetching:', apiData);
    // Use apiData here
    CreateCards(apiData);
    });

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
        shoppingCartIconContainer.appendChild(icon);
        contentResultContainer.appendChild(shoppingCartIconContainer);

        newCard.appendChild(contentResultContainer);
        ItemSection.append(newCard);
    });
}