import React, { Component } from 'react';
import instance from '../ethereum/web3/factory';
import Layout from '../components/layout';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';

class CrowdFundingIndex extends Component {
    static async getInitialProps(){
        const crowdFundingList = await instance.methods.getDeployedContractAddresses().call();
        
        return { crowdFundingList }
    }

    renderCrowdFundList(){
        const crowdFunding = this.props.crowdFundingList.map((data) => {
            return {
                header: data,
                description: (
                    <Link route={`cf/${data}`}>
                        <a>View</a>
                    </Link>
                ),
                fluid: true
            };
        });
        return <Card.Group items={crowdFunding} />;
    }

    render(){
        return(
            <Layout>
                <div>
                    <h3> List of Crowd Funding Projects </h3>
                    <Link route="/cf/new">
                        <a>
                            <Button 
                                content="Create Crowd Funding"
                                floated="right"
                                icon="add" 
                                primary
                            />
                        </a>
                    </Link>
                    {this.renderCrowdFundList()}
                </div>
            </Layout>
        )
    }
}

export default CrowdFundingIndex;