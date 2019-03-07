import React, { Component } from 'react';
import Layout from '../../components/layout';
import instance from '../../ethereum/web3/crowdFunding';
import { Link } from '../../routes';
import { Button } from 'semantic-ui-react';

class SpendingRequestIndex extends Component {

    static async getInitialProps(props) {
        const crowdFundingDetail = instance(props.query.address)
        const spendingRequests = await crowdFundingDetail.methods.getSpendingRequestCount().call();
        
        return { 
            spendingRequests, 
            address: props.query.address 
        }
    }

    render() {
        return(
            <Layout>
                <Link route={`/cf/${this.props.address}/spending_requests/new`}>
                    <a>
                        <Button floated="right" primary> Create New Request</Button>
                    </a>
                
                </Link>

            </Layout>
        )
    }
}

export default SpendingRequestIndex;