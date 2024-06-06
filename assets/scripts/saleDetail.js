document.addEventListener('DOMContentLoaded', async () => {
    let params = getQueryParams();
    let saleDetail = await fetchSaleDetail(params['id']);
    renderItems(saleDetail);
    renderBottom(saleDetail);
})
//Retrieving data
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
//Rendering
function renderItems(saleDetail)
{
    counter = 0;
    const SALE_CONTENT = document.querySelector('.sale-detail-content')
    let products = saleDetail.products;
    products.forEach(product => {
        counter += 1;
        let itemRow = document.createElement('section');
        itemRow.classList.add('item-row-content');
        itemRow.innerHTML = `<p>${counter}</p><p>${product.productId}</p><p>${product.price}</p><p>${product.discount}</p><p>${product.quantity}</p><p>${product.quantity * product.price}</p>`;
        SALE_CONTENT.appendChild(itemRow);
    });
}
function renderBottom(saleDetail)
{
    const SALE_CONTENT = document.querySelector('.sale-detail-bottom');
    let itemRow = document.createElement('section');
    itemRow.classList.add('item-row-bottom')
    itemRow.innerHTML = `<p>Cantidad Total: ${saleDetail.totalQuantity}</p><p>Subtotal: ${saleDetail.subTotal}</p><p>Descuento Total: ${saleDetail.totalDiscount}</p><p>Impuestos: ${saleDetail.taxes}</p><p>Total: ${saleDetail.totalPay}</p>`
    SALE_CONTENT.appendChild(itemRow);
}
//Functionality