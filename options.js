const saveOptions = () => {
    const currency = document.getElementById('currency').value;
    chrome.storage.sync.set({
        defaultCurrency: currency
    }, () => {
        // Update status to let user know options were saved.
        document.getElementById('status').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('status').style.display = 'none';
        }, 1000);
    });
};

chrome.storage.sync.get((data) => {
    document.getElementById("currency").value = data.defaultCurrency;
});

const e = document.getElementById("currency");
e.addEventListener('change', () => {
    saveOptions();
});