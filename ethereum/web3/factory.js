import web3 from './web3';
const compiledFactory = require('../build/Factory.json');

const instance = new web3.eth.Contract(
    JSON.parse(compiledFactory.interface),
    "0xE0e663cC30E46D55eE5402C44B6c2377d1c6401d"
)

export default instance;