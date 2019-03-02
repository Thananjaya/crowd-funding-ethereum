import React, { Component } from 'react';
import instance from '../ethereum/web3/factory'; 

class CrowdFundingIndex extends Component {

    static async getInitialProps() {
        const crowdFundings = await instance.methods.getDeployedContractAddresses().call();
        return { crowdFundings }
    }

    render(){
        return(
            <div>
                <h1>Crowd Funding Index</h1>
                <p>Deployed CrowdFunding address are</p>
                {this.props.crowdFundings[0]}
            </div>
        )
    }
}

export default CrowdFundingIndex;