export function shorten0xAddress (address, lastChars = -4) {
    return address.substr(0,6)+'...'+address.substr(lastChars);
}

export function detectCurrentProvider () {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.warn(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
};