const save_options = () => {
    const currency = document.getElementById('currency').value;
    chrome.storage.sync.set({
        defaultCurrency: currency
    }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout( () => {
            status.textContent = '';
        }, 750);
    });
};
document.getElementById('save').addEventListener('click', save_options);