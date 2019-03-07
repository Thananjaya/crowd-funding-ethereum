import React, { Component } from 'react';
import Layout from '../../components/layout';
import instance from '../../ethereum/web3/crowdFunding';
import web3 from '../../ethereum/web3/web3';
import { Form, Input, Button, Message} from 'semantic-ui-react';


class NewRequest extends Component {

    constructor(props){
        super(props);
        this.state = {
            description: '',
            value: '',
            recipientAddress: '',
            loading: false,
            message: '',
        }
    }

    static async getInitialProps(props) {
        return { address: props.query.address}
    }

    async submitForm() {
        const crowdFunding = instance(this.props.address);
        this.setState({ loading: true, message: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await crowdFunding.methods.raisingSpendingRequest(
                this.state.description,
                web3.utils.toWei(this.state.value, 'ether'),
                this.state.recipientAddress
            ).send({
                from: accounts[0]
            });
            this.setState({ message: 'Spending Request been raised successfully' });
        } catch(err) {
            this.setState({ message: err.message });
        }

        this.setState({ loading: false });
    }

    displayErrorMessage() {
        return(
            <Message negative>
                <Message.Header>OOPS!!</Message.Header>
                <p>{this.state.message}</p>
            </Message>
        )
    }

    render(){
        return(
            <Layout>
                <h3>Creating a new Request</h3>
                <Form>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            placeholder="Description for spending request"
                            value={ this.state.description }
                            onChange={(event) => this.setState({ description: event.target.value })}
                        />    
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input
                            placeholder="Value in Ether"
                            label="Ether"
                            labelPosition="right"
                            value={ this.state.value }
                            type="number"
                            onChange={(event) => this.setState({ value: event.target.value })}
                        />    
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient Address</label>
                        <Input
                            placeholder="Recipient Address"
                            value={ this.state.recipientAddress }
                            onChange={(event) => this.setState({ recipientAddress: event.target.value })}
                        />    
                    </Form.Field>
                    { this.state.message.length > 0 ? this.displayErrorMessage() : null }
                    <Button
                        type="submit"
                        loading={this.state.loading} 
                        onClick={() => this.submitForm()}
                        primary
                    >
                        Create a new Request
                    </Button>
                </Form>
            </Layout>
        )
    }
}

export default NewRequest;