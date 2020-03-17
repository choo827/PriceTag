let dataURL;

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
    const condition = /([£€$￥¥₩]\s{0,}[0-9,.]*)/g;
    const filteredSelect = filtering(select, condition);

    if (filteredSelect != '') {
        const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        const relative = document.body.parentNode.getBoundingClientRect();
        bubbleDOM.style.top = (r.bottom - relative.top) + 'px'; //this will place ele below the selection
        bubbleDOM.style.left = event.clientX + 'px';
        const currency = findCurrency(filteredSelect.charAt(0));
        dragCurrency.innerHTML = currency;
        dragPrice.innerHTML = filteredSelect.substring(1);

        chrome.storage.sync.get((item) => {
            exCurrency.innerHTML = item.defaultCurrency;
        });
        convertCur(filteredSelect.substring(1)
            .replace(",", ""), currency);

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
            return 'KRW';
    }
};

const filtering = (text, condition) => {
    text.trim()
        .match(condition).toString()
        .replace(/(\s*)/g, "");

    return text;
};

const convertCur = (price, currency) => {
    let myBase;
    chrome.storage.sync.get((item) => {
        myBase = item.defaultCurrency;
        dataURL = 'https://api.exchangeratesapi.io/latest?base=' + currency;
    });

    fetch(dataURL)
        .then((res) => {
            res.json().then(data => {
                const base = data.rates[myBase];
                const convertPrice = base * price;
                exPrice.innerHTML = convertPrice.toLocaleString()
            })
        }).catch(err => console.log(err));
};

// ([£€$￥¥₩]\s{0,}[0-9,.]*)|([0-9,.]*[€원])