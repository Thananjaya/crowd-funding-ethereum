import web3 from './web3';
const compiledFactory = require('../build/Factory.json');

const instance = new web3.eth.Contract(
    JSON.parse(compiledFactory.interface),
    "0x2284fbc41B74937f6Ab89A305e1d2f481947a418"
)

export default instance;