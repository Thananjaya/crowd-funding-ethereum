import React, { Component } from 'react';
import instance from '../ethereum/web3/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/layout';

class CrowdFundingIndex extends Component {
    static async getInitialProps(){
        const crowdFunding = await instance.methods.getDeployedContractAddresses().call();
        
        return { crowdFunding }
    }

    renderCrowdFundList(){
        const crowdFunding = this.props.crowdFunding.map((data) => {
            return {
                header: data,
                description: <a> View this card</a>,
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
                    <Button 
                        content="Create Crowd Funding"
                        floated="right"
                        icon="add" 
                        primary
                    />
                    {this.renderCrowdFundList()}
                </div>
            </Layout>
        )
    }
}

export default CrowdFundingIndex;