import React, { Component } from 'react';
import Layout from '../../components/layout';
import instance from  '../../ethereum/web3/factory';
import crowdFundingInstance from '../../ethereum/web3/crowdFunding';
import web3 from  '../../ethereum/web3/web3';
import { Button, Form, Input, Message} from 'semantic-ui-react';
import { Router } from '../../routes';

class CrowdFundingNew extends Component {

    constructor(props){
        super(props);
        this.state = {
            weiAmount: null,
            errorMessage: '',
            loading: false,
            title: '',
            description: ''
        }
    }

    onSubmit = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, errorMessage: ''});
        try {
            await instance.methods.createCrowdFunding(this.state.weiAmount).send({
                from: accounts[0]    
            });
            const addresses = await instance.methods.getDeployedContractAddresses().call();
            const crowdFunding = crowdFundingInstance(addresses[addresses.length-1])
            await crowdFunding.methods.addTitleAndDescription(this.state.title, this.state.description).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
        } catch(err) {
            this.setState({errorMessage: err.message})
        }
        this.setState({loading: false});
        
    }

    displayErrorMessage() {
        return(
            <Message negative>
                <Message.Header>OOPS!!</Message.Header>
                <p>{this.state.errorMessage}</p>
            </Message>
        )
    }

    render(){
        return(
            <Layout>
                <h3> Represent your project for raising crowd funding </h3>
                <Form>
                <Form.Field>
                        <label>Title</label>
                        <Input
                            placeholder="Project Title" 
                            onChange={(event) => this.setState({ title: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            type="text"
                            placeholder="Project Description" 
                            onChange={(event) => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            type="number"
                            label="Wei" 
                            labelPosition="right" 
                            placeholder="Amount in wei" 
                            onChange={(event) => this.setState({ weiAmount: event.target.value })}
                        />
                    </Form.Field>
                    { this.state.errorMessage.length > 0 ? this.displayErrorMessage() : null}
                    <Button 
                        type="submit"
                        loading={this.state.loading} 
                        onClick={this.onSubmit}
                        primary
                    > 
                        Submit this project 
                    </Button>
                </Form>
            </Layout>
        )
    }
}

export default CrowdFundingNew;