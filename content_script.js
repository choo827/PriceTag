let myCurency;
chrome.storage.sync.get((item) => {
    myCurency = item.defaultCurrency;
});

document.addEventListener('mouseup', (event) => {
    const select = window.getSelection().toString();
    const condition = /(^[£€$￥¥₩￦]\s*[0-9,.]*$)|(^[0-9,.]*[€원]$)/;

    if (select != ('' || undefined)) {
        console.log(select.toString());
        const filteredSelect = filtering(select, condition);

        const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        const relative = document.body.parentNode.getBoundingClientRect();
        const x = event.clientX + 'px';

        let currency, dp;
        if (filteredSelect.charAt(0).match(/[0-9]/g)) {
            // 1000원
            currency = findCurrency(filteredSelect.substr(filteredSelect.length - 1));
            dp = filteredSelect.slice(0, -1);
            convertCur(filteredSelect.slice(0, -1)
                .replace(/,/g, ""), currency)
                .then(data => {
                    createBubble(currency, dp, myCurency, data.toLocaleString(), currency);
                    positionBubble(r, relative, x);
                });
        } else {
            // $10000
            currency = findCurrency(filteredSelect.charAt(0));
            dp = filteredSelect.substring(1);
            convertCur(filteredSelect.substring(1)
                .replace(/,/g, ""), currency)
                .then(data => {
                    createBubble(currency, dp, myCurency, data.toLocaleString(), currency);
                    positionBubble(r, relative, x);
                });
        }
    } else {
        removeBubble();
    }
});

document.addEventListener('mousedown', () => {
    removeBubble();
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
        case '￦':
        case '원':
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
    const dataURL = 'https://api.exchangeratesapi.io/latest?base=' + currency;
    return fetch(dataURL).then((res) => {
        return res.json().then(data => {
            return data.rates[myCurency] * price;
        });
    }).catch(err => console.log(err));
};

const createBubble = (_dc, _dp, _ec, _ep,) => {
    const bubbleDOM = document.createElement('div');
    const dragCurrency = document.createElement('div');
    const dragPrice = document.createElement('div');
    const exCurrency = document.createElement('div');
    const exPrice = document.createElement('div');

    bubbleDOM.setAttribute('id', 'selection-bubble');
    dragCurrency.setAttribute('id', 'drag-currency');
    dragPrice.setAttribute('id', 'drag-price');
    exCurrency.setAttribute('id', 'ex-currency');
    exPrice.setAttribute('id', 'ex-price');

    document.body.appendChild(bubbleDOM);
    bubbleDOM.appendChild(dragCurrency);
    bubbleDOM.appendChild(dragPrice);
    bubbleDOM.appendChild(exCurrency);
    bubbleDOM.appendChild(exPrice);

    dragCurrency.innerHTML = _dc;
    dragPrice.innerHTML = _dp;
    exCurrency.innerHTML = _ec;
    exPrice.innerHTML = _ep;
};

const removeBubble = () => {
    const bubble = document.getElementById('selection-bubble');
    if (bubble) {
        bubble.remove();
    }
};

const positionBubble = (_r, _relative, _x) => {
    const bubble = document.getElementById('selection-bubble');
    bubble.style.top = (_r.bottom - _relative.top) + 'px'; //this will place ele below the selection
    bubble.style.left = _x;
};