function getQueryParams() {
    let params = {};
    window.location.search.substring(1).split("&").forEach(function(part) {
        let item = part.split("=");
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
    });
    return params;
}


const ItemSection = document.querySelector('.product-container');
console.log(ItemSection);
createProductDetails();
async function createProductDetails()
{
    let product = await fetchProduct();
    let ImageContainer = document.createElement('section');
    ImageContainer.classList.add('image-container');
    let productImage = document.createElement('img');
    productImage.src = product.imageUrl;
    ImageContainer.appendChild(productImage);
    ItemSection.append(ImageContainer);

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
    ItemSection.append(productDetailContainer)
    
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
    productPrice.innerHTML = "$" + product.price;
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
    // let cartBtnText = document.createElement('h3');
    // // cartBtnText.innerHTML = "Agregar al carrito";
    // // cartBtn.appendChild(cartBtnText);
    cartBtnContainer.appendChild(cartBtn);
    priceSectionBottom.appendChild(cartBtnContainer);
    priceSectionContainer.appendChild(priceSectionBottom);

    ItemSection.append(priceSectionContainer);

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
        const data = await response.json(); // Wait for the response to be parsed as JSON
        console.log(data);
        return data;       
    }
    catch
    {
        console.error('Error fetching data:', error);
    }
}