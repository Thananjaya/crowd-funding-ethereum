const Web3 = require('web3');

let web3;

// checking whether the process is running in the browser or server
if( typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ) {
    // process running in the browser and browser has metamask
    web3 = new Web3(window.web3.currentProvider);
} else {
    // process is not running in browser or not having the metamask plugin
    const provider = new Web3.providers.HttpProvider(
        // YOUR INFURA PROVIDER API
    );
    web3 = new Web3(provider);
}

export default web3;