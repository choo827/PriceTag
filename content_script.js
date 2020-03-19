const bubbleDOM = document.createElement('div');
const dragCurrency = document.createElement('div');
const dragPrice = document.createElement('div');
const exCurrency = document.createElement('div');
const exPrice = document.createElement('div');

bubbleDOM.setAttribute('id', 'selection_bubble');
dragCurrency.setAttribute('id', 'drag-currency');
dragPrice.setAttribute('id', 'drag-price');
exCurrency.setAttribute('id', 'ex-currency');
exPrice.setAttribute('id', 'ex-price');

document.body.appendChild(bubbleDOM);
bubbleDOM.appendChild(dragCurrency);
bubbleDOM.appendChild(dragPrice);
bubbleDOM.appendChild(exCurrency);
bubbleDOM.appendChild(exPrice);


document.addEventListener('mouseup', (event) => {
    const select = window.getSelection().toString();
    const filteredSelect = filtering(select);

    if (filteredSelect != '') {
        const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        const relative = document.body.parentNode.getBoundingClientRect();
        bubbleDOM.style.top = (r.bottom - relative.top) + 'px'; //this will place ele below the selection
        bubbleDOM.style.left = event.clientX + 'px';

        let currency;
        if (filteredSelect.charAt(0).match(/[0-9]/g)) {
            // 1000원
            currency = findCurrency(filteredSelect.substr(filteredSelect.length - 1));
            dragPrice.innerHTML = filteredSelect.slice(0, -1);
            convertCur(filteredSelect.slice(0, -1)
                .replace(/,/g, ""), currency);
        } else {
            // $10000
            currency = findCurrency(filteredSelect.charAt(0));
            dragPrice.innerHTML = filteredSelect.substring(1);
            convertCur(filteredSelect.substring(1)
                .replace(/,/g, ""), currency);
        }
        dragCurrency.innerHTML = currency;

        chrome.storage.sync.get((item) => {
            exCurrency.innerHTML = item.defaultCurrency;
        });

        bubbleDOM.style.visibility = 'visible';
        bubbleDOM.style.position = "absolute";
    } else {
        bubbleDOM.style.visibility = 'hidden';
    }
});

document.addEventListener('mousedown', () => {
    bubbleDOM.style.visibility = 'hidden';
});

const findCurrency = (rawPrice) => {
    switch (rawPrice) {
        case '£':
            return 'GBP';
        case '€':
            return 'EUR';
        case '$':
            return 'USD';
        case '¥':
        case '￥':
            return 'JPY';
        case '₩':
        case '원':
            return 'KRW';
    }
};

const filtering = (text) => {
    text.trim()
        .match(/([£€$￥¥₩]\s*[0-9,.]*)|([0-9,.]*[€원])/g).toString()
        .replace(/(\s*)/g, "");

    return text;
};

const convertCur = (price, currency) => {
    const dataURL = 'https://api.exchangeratesapi.io/latest?base=' + currency;
    let myBase;

    chrome.storage.sync.get((item) => {
        myBase = item.defaultCurrency;
    });

    fetch(dataURL)
        .then((res) => {
            res.json().then(data => {
                const convertPrice = data.rates[myBase] * price;
                exPrice.innerHTML = convertPrice.toLocaleString()
            })
        }).catch(err => console.log(err));
};