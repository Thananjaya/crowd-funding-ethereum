import React, { Component } from 'react';
import Layout from '../../components/layout';
import instance from '../../ethereum/web3/crowdFunding';

class CrowdFundingDetails extends Component {


    static async getInitialProps(props) {
        const crowdFundingDetail = instance(props.query.address)
        const summary = await crowdFundingDetail.methods.getSummary().call()
        return { summary }
    }

    render(){
        return(
            <Layout>
                <h3>Show this project</h3>
                <h4>{this.props.summary['0']}</h4>
            </Layout>
        )
    }
}

export default CrowdFundingDetails;