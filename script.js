let dataURL = "https://api.exchangeratesapi.io/latest";

document.addEventListener('DOMContentLoaded', () => {
    const e = document.getElementById("selCur");
    e.addEventListener('change', () => {
        const selectedVal = e.options[e.selectedIndex].value;
        dataURL = 'https://api.exchangeratesapi.io/latest?base=' + selectedVal;
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const exchange = document.getElementById('exchange');
    exchange.addEventListener('click', () => {
        convertCur()
    });
});

function convertCur() {
    const price = document.getElementById('price').value;
    fetch(dataURL)
        .then((res) => {
            res.json().then(data => {
                const base = data.rates["KRW"];
                const convertPrice = base * price;
                document.getElementById("result")
                    .textContent = convertPrice.toLocaleString()
            })
        }).catch(err => console.log(err));
}