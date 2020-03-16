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


document.addEventListener('mouseup', function (e) {
    const sel = window.getSelection().toString();
    const filtered_sel = sel.trim()
        .match(/([£€$￥¥₩]\s{0,}[0-9,.]*)/g)
        .toString().replace(/(\s*)/g, "");
    if (filtered_sel != '') {
        const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        const relative = document.body.parentNode.getBoundingClientRect();
        bubbleDOM.style.top = (r.bottom - relative.top) + 'px'; //this will place ele below the selection
        bubbleDOM.style.left = e.clientX + 'px';

        let filteredCurrency;
        switch (filtered_sel.charAt(0)) {
            case '£':
                filteredCurrency = 'GBP';
                break;
            case '€':
                filteredCurrency = 'EUR';
                break;
            case '$':
                filteredCurrency = 'USD';
                break;
            case ('￥' || '¥'):
                filteredCurrency = 'JPY';
                break;
            case '₩':
                filteredCurrency = 'KRW';
                break;
        }

        dragCurrency.innerHTML = filteredCurrency;
        dragPrice.innerHTML = filtered_sel.substring(1);

        chrome.storage.sync.get((item) => {
            exCurrency.innerHTML = item.defaultCurrency;
        });
        convertCur(filtered_sel.substring(1).replace(",", ""), filteredCurrency);

        bubbleDOM.style.visibility = 'visible';
        bubbleDOM.style.position = "absolute";
    } else {
        bubbleDOM.style.visibility = 'hidden';
    }
});

document.addEventListener('mousedown', function () {
    bubbleDOM.style.visibility = 'hidden';
});

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