document.addEventListener('DOMContentLoaded', async () => {
    let params = getQueryParams();
    let saleDetail = await fetchSaleDetail(params['id']);
    renderItems(saleDetail);
    renderBottom(saleDetail);
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
//Retrieving data
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
async function fetchSaleDetail(id)
{
    try
    {
        const response = await fetch(`http://localhost:5166/api/Sale/${id}`);
        if(!response.ok)
            {
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
async function fetchProduct(id)
{    
    try
    {
        const response = await fetch(`http://localhost:5166/api/Product/${id}`);
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
//Rendering
function renderItemsAmount(productAmount)
{
    if(productAmount > 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}
async function renderItems(saleDetail)
{
    counter = 0;
    const SALE_CONTENT = document.querySelector('.sale-detail-content')
    let products = saleDetail.products;
    for(const product of products)
        {
            console.log(product);
            productData = await fetchProduct(product.productId)
            counter += 1;
            let itemRow = document.createElement('section');
            itemRow.classList.add('item-row-content');
            itemRow.innerHTML = `<p>${counter}</p>
                <p>${productData.name}</p>
                <p>$${formatNumber(product.price)}</p>
                <p>${product.discount}%</p>
                <p>${product.quantity}</p>
                <p>$${formatNumber(product.quantity * product.price)}</p>`;
            SALE_CONTENT.appendChild(itemRow);
        }
    // products.forEach(product => {
    //     productData = await fetchProduct(product.id)
    //     counter += 1;
    //     let itemRow = document.createElement('section');
    //     itemRow.classList.add('item-row-content');
    //     itemRow.innerHTML = `<p>${counter}</p>
    //         <p>${product.productId}</p>
    //         <p>$${formatNumber(product.price)}</p>
    //         <p>${product.discount}%</p>
    //         <p>${product.quantity}</p>
    //         <p>$${formatNumber(product.quantity * product.price)}</p>`;
    //     SALE_CONTENT.appendChild(itemRow);
    // });
}
function renderBottom(saleDetail)
{
    const SALE_CONTENT = document.querySelector('.sale-detail-bottom');
    let itemRow = document.createElement('section');
    itemRow.classList.add('item-row-bottom')
    itemRow.innerHTML = `<p>Cantidad Total: ${saleDetail.totalQuantity}</p>
        <p>Subtotal: $${formatNumber(saleDetail.subTotal)}</p>
        <p>Descuento Total: $${formatNumber(saleDetail.totalDiscount)}</p>
        <p>Impuestos: ${Math.round((saleDetail.taxes - 1) * 100)}%</p>
        <p>Total: $${formatNumber(saleDetail.totalPay)}</p>`
    SALE_CONTENT.appendChild(itemRow);
}
//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}