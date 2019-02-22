const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-cli');
const web3 = new Web3(ganache.provider());

const compiledCrowdFunding = require('../ethereum/build/CrowdFunding.json');
const compiledFactory = require('../ethereum/build/Factory.json');

let crowdFunding;
let factory;
let CrowdFundingAddress;
let accounts;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory= await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode,
            arguments: [100]
        })
        .send({
            from: accounts[0],
            gas: 1000000
        });
    
    [crowdFundingAddress] = await factory.methods.getDeployedContractAddresses().call();
    crowdFunding = await new web3.eth.Contract(JSON.parse(compiledCrowdFunding.interface), crowdFundingAddress) 

});

describe('Crowd Funding', () => {
    it('deploys both factory and crowdFunding', () => {
        assert.ok(factory.options.address);
        assert.ok(crowdFunding.options.address);
    });
})

