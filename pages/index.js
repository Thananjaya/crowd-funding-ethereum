import React, { Component } from 'react';
import instance from '../ethereum/web3/factory'; 

class CrowdFundingIndex extends Component {

    constructor(props){
        super(props);
        this.state = {
            deployedCrowdFundings: [],
        }
    }

    async componentWillMount(){
        this.state.deployedCrowdFundings.push(await instance.methods.getDeployedContractAddresses().call());
    }

    render(){
        return(
            <div>
                <h1>Crowd Funding Index</h1>
            </div>
        )
    }
}

export default CrowdFundingIndex;