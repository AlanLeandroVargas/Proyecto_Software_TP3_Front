// Read a cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
// let storedUserShoppingCart = getCookie('shoppingCart');
// let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart);
// console.log(parsedStoredUserShoppingCart);

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
// ComputeAll();

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
                const data = await response.json(); // Wait for the response to be parsed as JSON
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


