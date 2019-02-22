const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-cli');
const web3 = new Web3(ganache.provider());

const compiledCrowdFunding = require('../ethereum/build/CrowdFunding.json');
const compiledFactory = require('../ethereum/build/Factory.json');

let crowdFunding;
let factory;
let crowdFundingAddress;
let accounts;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory= await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode,
        })
        .send({
            from: accounts[0],
            gas: 1000000
        });

    await factory.methods.createCrowdFunding('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [crowdFundingAddress] = await factory.methods.getDeployedContractAddresses().call();
    crowdFunding = await new web3.eth.Contract(JSON.parse(compiledCrowdFunding.interface), crowdFundingAddress) 

});

describe('Crowd-funding and factory testing', () => {
    it('deploys both factory and crowdFunding', () => {
        assert.ok(factory.options.address);
        assert.ok(crowdFunding.options.address);
    });

    it('crowd funding requester is marked as owner', async () => {
        const owner = await crowdFunding.methods.owner().call();
        assert.equal(accounts[0], owner);
    });

    it('allows people to contrubute money and marks them as contributors', async () => {
        await crowdFunding.methods.contribute().send({
            from: accounts[1],
            value: '500'
        });
        const isContributor = await crowdFunding.methods.contributors(accounts[1]).call();
        assert(isContributor);
    });

    it('checking for minimum contribution', async () => {
        try {
            await crowdFunding.methods.contribute().send({
                from: accounts[1],
                value: '5'
            })
        } catch (err) {
            assert(err)
        }
    });

    it('allows owner to raise a spending request', async () => {
        const description= 'to purchase super computer';
        await crowdFunding.methods.contribute().send({
            from: accounts[1],
            value: '500'
        });
        await crowdFunding.methods.raisingSpendingRequest(
            description,
            '100',
            accounts[2]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await crowdFunding.methods.requests(0).call();
        assert.equal(request.description, description);
    });

    it('processes requests', async () => {
        await crowdFunding.methods.contribute().send({
          from: accounts[1],
          value: web3.utils.toWei('10', 'ether')
        });
    
        await crowdFunding.methods.raisingSpendingRequest(
            'to buy super computers', 
            web3.utils.toWei('5', 'ether'), 
            accounts[2]
            ).send({ 
                from: accounts[0], 
                gas: '1000000' 
            });
    
        await crowdFunding.methods.approvingRequest(0).send({
          from: accounts[1],
          gas: '1000000'
        });
    
        await crowdFunding.methods.finalizeRequest(0).send({
          from: accounts[0],
          gas: '1000000'
        });
    
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
    
        assert(balance > 80)
    });
})

