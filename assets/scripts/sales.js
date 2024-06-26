document.addEventListener('DOMContentLoaded', () => 
    {        
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
async function fetchSales(from = null, to = null)
{
    try
    {
        const response = await fetch(`http://localhost:5166/api/Sale?from=${from}&to=${to}`);
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
function renderItemsAmount(productAmount)
{
    if(productAmount > 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}
function renderSaleCards(sales)
{
    sales.forEach(sale => {        
        const SALE_LIST = document.querySelector('.sale-list-container');
        let saleContainer = document.createElement('section');
        saleContainer.classList.add('sale-container')

        let saleTotalContainer = document.createElement('section');
        saleTotalContainer.classList.add('sale-total-container');
        saleTotalContainer.innerHTML = "<h4>Total Pagado:</h4>";
        let totalPayed = document.createElement('h4');
        totalPayed.innerHTML = "$ " + formatNumber(sale.totalPay);
        saleTotalContainer.appendChild(totalPayed);
        saleContainer.appendChild(saleTotalContainer);

        let saleProductQuantityContainer = document.createElement('section');
        saleProductQuantityContainer.classList.add('sale-product-quantity-container')
        saleProductQuantityContainer.innerHTML = "<h4>Cantidad total de productos:</h4>";
        let totalQuantity = document.createElement('h4');
        totalQuantity.innerHTML = sale.totalQuantity;
        saleProductQuantityContainer.appendChild(totalQuantity);
        saleContainer.appendChild(saleProductQuantityContainer);

        let saleDateContainer = document.createElement('section');
        saleDateContainer.classList.add('sale-date-container');
        saleDateContainer.innerHTML = "<h4>Fecha:</h4>";
        let date = document.createElement('h4');
        date.innerHTML = sale.date.slice(0, 10);
        saleDateContainer.appendChild(date);
        saleContainer.appendChild(saleDateContainer);  
        
        let detailButtonContainer = document.createElement('section');
        detailButtonContainer.classList.add('details-button-container');
        let detailButton = document.createElement('button');
        detailButton.innerHTML = "<h4>Ver mas</h4>";
        detailButton.addEventListener('click', () => {
            searchSaleDetail(sale.id)
        })
        detailButtonContainer.appendChild(detailButton);
        saleContainer.appendChild(detailButtonContainer);
        
        SALE_LIST.appendChild(saleContainer);        
    });
}

//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
async function searchSaleDetail(id)
{    
    window.open('./saleDetail.html?id=' + encodeURIComponent(id), '_self');
}
async function searchSales()
{
    toggleSearchBox();
    let from = document.querySelector('#initialDate').value;
    let to = document.querySelector('#finalDate').value;    
    let sales = await fetchSales(from, to);
    renderSaleCards(sales);
}

function toggleSearchBox()
{
    let searchBox = document.querySelector('.search-box');
    searchBox.classList.toggle('search-box-active');
    toggleSaleListSection();
}
function toggleSaleListSection()
{
    let saleListSection = document.querySelector('.sale-list-container');
    saleListSection.classList.toggle('sale-list-container-active');
}