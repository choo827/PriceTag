chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        console.log("This is a first install!");
        const langCode = getLanguage();
        const countryCode = langCode.substr(langCode.length - 2);
        const myCurrency = findCurrency(countryCode);
        chrome.storage.sync.set({
            defaultCurrency: myCurrency
        });

    } else if (details.reason == "update") {
        const thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

const getLanguage = () => {
    return navigator.language;
};


const findCurrency = (code) => {
    switch (code) {
        case 'KR':
            return 'KRW';
        case 'JP':
            return 'JPY';
        case 'GB':
            return 'GBP';
        case 'DE':
        case 'GR':
        case 'FR':
        case 'ES':
        case 'IT':
        case 'NL':
        case 'BE':
        case 'IE':
        case 'LU':
        case 'AT':
        case 'PT':
        case 'FI':
        case 'SI':
        case 'SK':
            return 'EUR';
        default:
            return 'USD';
    }
};