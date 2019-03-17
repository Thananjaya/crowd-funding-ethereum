import web3 from './web3';
const compiledFactory = require('../build/Factory.json');

const instance = new web3.eth.Contract(
    JSON.parse(compiledFactory.interface),
    "0xdb79A731FC4a99BA67A257340231b93647AA61A6"
)

export default instance;