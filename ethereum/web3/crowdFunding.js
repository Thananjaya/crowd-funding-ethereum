import web3 from './web3';
const compiledCrowdFunding = require('../build/CrowdFunding.json');

export default (address) => {
    const instance = new web3.eth.Contract(
        JSON.parse(compiledCrowdFunding.interface),
        address
    );

    return instance;
}
