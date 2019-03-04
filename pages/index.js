import React, { Component } from 'react';
import instance from '../ethereum/web3/factory';


class CrowdFundingIndex extends Component {
    static async getInitialProps(){
        const crowdFunding = await instance.methods.getDeployedContractAddresses().call();
        
        return { crowdFunding }
    }

    render(){
        return(
            <p>{this.props.crowdFunding}</p>
        )
    }
}

export default CrowdFundingIndex;