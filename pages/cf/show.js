import React, { Component } from 'react';
import Layout from '../../components/layout';
import instance from '../../ethereum/web3/crowdFunding';
import web3 from '../../ethereum/web3/web3';
import { Card, Form, Message, Input, Button, Grid } from 'semantic-ui-react'
import { Router } from '../../routes';

class CrowdFundingDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
            loading: false,
            value: ''
        }
    }

    static async getInitialProps(props) {
        const crowdFundingDetail = instance(props.query.address)
        const summary = await crowdFundingDetail.methods.getSummary().call();
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: web3.utils.fromWei(summary[1], 'ether'),
            totalSpendingRequests: summary[2],
            contributorsCount: summary[3],
            contractOwner: summary[4]
        }
    }

    async onSubmit() {
        const crowdFunding = instance(this.props.address);
        this.setState({ loading: true, message: '' });
        
        try {
            const accounts = await web3.eth.getAccounts();
            await crowdFunding.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/cf/${this.props.address}`)
        } catch (err) {
            this.setState({ message: err.message })
        }

        this.setState({ loading: false})

    }

    displayErrorMessage() {
        return(
            <Message negative>
                <Message.Header>OOPS!!</Message.Header>
                <p>{this.state.message}</p>
            </Message>
        )
    }

    renderCards() {
        const {
            minimumContribution,
            balance,
            totalSpendingRequests,
            contributorsCount,
            contractOwner
        } = this. props;

        const items = [
            {
              header: contractOwner,
              description: 'Owner of this project and can create spending requests.',
              meta: 'Address of this manager',
              style: { overflowWrap: 'break-word'}
            },
            {
              header: minimumContribution,
              description: 'Minimum contribution for this project, assigned by the project owner',
              meta: 'Minimum Contribution',
            },
            {
              header: contributorsCount,
              description: 'Total number of contributors',
              meta: 'Total Contributors',
            },
            {
                header: totalSpendingRequests,
                description: 'Total number of spending requests',
                meta: 'Spending Requests',
            },
            {
                header: balance,
                description: 'Balance left in this project',
                meta: 'Balance in terms of Ether',
            },
        ]

        return <Card.Group items={items} />
    }

    render(){
        return(
            <Layout>
                <Grid>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Form>
                            <Form.Field>
                                <label>Contribution Amount</label>
                                <Input 
                                    label="Ether"
                                    value={this.state.value}
                                    onChange={(event) => this.setState({value: event.target.value})}
                                    labelPosition="right"
                                    type="number"
                                    placeholder="Amount in Ether" 
                                />
                            </Form.Field>
                            { this.state.message.length > 0 ? this.displayErrorMessage() : null}
                            <Button 
                                type="submit"
                                loading={this.state.loading} 
                                onClick={() => this.onSubmit()}
                                primary
                            > 
                                Contribute! 
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default CrowdFundingDetails;