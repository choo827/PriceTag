let dataURL = "https://api.exchangeratesapi.io/latest?base=EUR";

document.addEventListener('DOMContentLoaded', () => {
    const selCurrency = document.getElementById("selCur");
    const price = document.getElementById('price');
    const exchange = document.getElementById('exchange');

    selCurrency.addEventListener('change', () => {
        const selValue = selCurrency.options[selCurrency.selectedIndex].value;
        dataURL = 'https://api.exchangeratesapi.io/latest?base=' + selValue;
    });

    // 환전 버튼 눌러 결과
    exchange.addEventListener('click', () => {
        if (price.value.length != 0) {
            showResult('exchange-wrapper');
            convertCur(price);
            console.log("price" + price.value);
            clickExAnim(exchange, 250);
        }
    });

    // 엔터키 눌러 결과
    price.onkeypress = (event) => {
        if (price.value.length != 0) {
            if (event.keyCode == 13) {
                showResult('exchange-wrapper');
                convertCur(price);
                clickExAnim(exchange, 250);
            } else {
                return true;
            }
        }
    };

    // 옵션창
    const options = document.getElementById('go-to-options');
    options.addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});

chrome.storage.sync.get((data) => {
    const exCurrency = document.getElementById('exchange-currency');
    exCurrency.innerText = data.defaultCurrency;
});

const showResult = (element) => {
    document.getElementById(element).style.display = 'flex';
    document.getElementById(element).classList.add('animated');
};

const clickExAnim = (element, time) => {
    element.style.boxShadow = 'inset -6px -6px 16px 0 rgba(255, 255, 255, .5), inset 6px 6px 16px 0 rgba(209, 205, 199, .5)';
    setTimeout(() => {
        element.style.boxShadow = " 6px 6px 16px 0 rgba(209, 205, 199, .5),-6px -6px 16px 0 rgba(255, 255, 255, .5)";
    }, time);
};

const convertCur = (price) => {
    const result = document.getElementById("result");
    let myBase;
    chrome.storage.sync.get((item) => {
        myBase = item.defaultCurrency;
    });
    fetch(dataURL)
        .then((res) => {
            res.json().then(data => {
                const convertPrice = data.rates[myBase] * price.value;
                result.textContent = convertPrice.toLocaleString()
            })
        }).catch(err => console.log(err));
};