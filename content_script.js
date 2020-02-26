const bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('id', 'selection_bubble');
document.body.appendChild(bubbleDOM);

document.addEventListener('mouseup', function (e) {
    const sel = window.getSelection().toString();
    const filtered_sel = sel.trim().match(/[0-9,.]+/g);
    if (filtered_sel != '') {
        console.log(filtered_sel.toString());
        const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        const relative = document.body.parentNode.getBoundingClientRect();
        bubbleDOM.style.top = (r.bottom - relative.top) + 'px';//this will place ele below the selection
        bubbleDOM.style.left = e.clientX + 'px';
        bubbleDOM.innerHTML = filtered_sel;
        bubbleDOM.style.visibility = 'visible';
        bubbleDOM.style.position = "absolute";
    } else {
        bubbleDOM.style.visibility = 'hidden';
    }
});

document.addEventListener('mousedown', function () {
    bubbleDOM.style.visibility = 'hidden';
});