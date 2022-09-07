export function shorten0xAddress (address) {
    return address.substr(0,6)+'...'+address.substr(-4);
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