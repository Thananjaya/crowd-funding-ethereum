const Web3 = require('web3');

let web3;

if( typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // process is not running in browser or not having the metamask plugin
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/ffd2deb0df864ae299640e5d442c4eaa"
    );
    web3 = new Web3(provider);
}

export default web3;