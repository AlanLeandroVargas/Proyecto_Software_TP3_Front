//Retrieving data
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
async function searchSales()
{
    let from = document.querySelector('#initialDate').value;
    let to = document.querySelector('#finalDate').value;
    console.log(from);
    console.log(to);
    console.log(await fetchSales(from, to))
}