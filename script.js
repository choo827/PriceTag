let dataURL = "https://api.exchangeratesapi.io/latest";

document.addEventListener('DOMContentLoaded', () => {
    const e = document.getElementById("selCur");
    e.addEventListener('change', () => {
        const selectedVal = e.options[e.selectedIndex].value;
        dataURL = 'https://api.exchangeratesapi.io/latest?base=' + selectedVal;
    });
});


chrome.storage.sync.get((data) => {
    document.getElementById('exchange-currency').innerText = data.defaultCurrency;
    dataURL = 'https://api.exchangeratesapi.io/latest?base=' + data.defaultCurrency;
});

document.addEventListener('DOMContentLoaded', () => {
    const exchange = document.getElementById('exchange');
    exchange.addEventListener('click', () => {
        convertCur()
    });
});

function convertCur() {
    let myBase;
    chrome.storage.sync.get((item) => {
        myBase = item.defaultCurrency;
    });

    const price = document.getElementById('price').value;
    fetch(dataURL)
        .then((res) => {
            res.json().then(data => {
                const base = data.rates[myBase];
                const convertPrice = base * price;
                document.getElementById("result")
                    .textContent = convertPrice.toLocaleString()
            })
        }).catch(err => console.log(err));
}

document.addEventListener('DOMContentLoaded', () => {
    const options = document.getElementById('go-to-options');
    options.addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});