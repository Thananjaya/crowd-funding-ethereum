import React, { Component } from 'react';
import Layout from '../../components/layout';
import instance from '../../ethereum/web3/crowdFunding';
import web3 from '../../ethereum/web3/web3';
import { Link } from '../../routes';
import { Button, Table, Message } from 'semantic-ui-react';

class SpendingRequestIndex extends Component {

    state = {
        approveLoading: false,
        finalizeLoading: false,
        message: ''
    }

    static async getInitialProps(props) {
        const crowdFunding = instance(props.query.address)
        const spendingRequestsCount = await crowdFunding.methods.getSpendingRequestCount().call();
        const totalContributorsCount = await crowdFunding.methods.totalContributorsCount().call();

        // getSpendingRequestCount will return an integer as a string, so we have to use parseInt
        const requests = await Promise.all(
            Array(parseInt(spendingRequestsCount)).fill().map((element, index) => {
                return crowdFunding.methods.requests(index).call()
            })
        );
        
        return {
            address: props.query.address,
            requests: requests,
            requestsCount: spendingRequestsCount,
            contributorsCount: totalContributorsCount
        }
    }

    async onApprove(index) {
        const crowdFunding = instance(this.props.address);
        this.setState({ approveLoading: true, message: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await crowdFunding.methods.approvingRequest(index).send({
                from: accounts[0] 
            });
            this.setState({ message: 'Spending Request been approved!!' })
        } catch(err) {
            this.setState({ message: err.message })
        }   
        this.setState({ approveLoading: false });
    }

    async onFinalize(index) {
        const crowdFunding = instance(this.props.address);
        this.setState({ finalizeLoading: true, message: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await crowdFunding.methods.finalizeRequest(index).send({
                from: accounts[0]
            });
            this.setState({ message: 'Spending Request been Finalised!!' })
        } catch(err) {
            this.setState({ message: err.message })
        }
        this.setState({ finalizeLoading: false });
    }

    displayErrorMessage() {
        return(
            <Message negative>
                <p>{this.state.message}</p>
            </Message>
        )
    }

    renderRequestsBody(){
        const { Row, Cell } = Table;
        return this.props.requests.map((request, index) => {
            return(
                <Row key={index} disabled={request.complete}>
                    <Cell>{index}</Cell>
                    <Cell>{request.description}</Cell>
                    <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                    <Cell>{request.recipient}</Cell>
                    <Cell>{request.yesCount}/{this.props.contributorsCount}</Cell>
                    <Cell>
                        {
                            request.complete ? null : (
                                <Button color="green" loading={this.state.approveLoading} onClick={() => this.onApprove(index)} basic> Approve </Button>
                            )
                        }
                    </Cell>
                    <Cell>
                        {
                            request.complete ? null : (
                                <Button color="teal" loading={this.state.finalizeLoading} onClick={() => this.onFinalize(index)} basic> Finalise </Button>
                            )
                        }
                    </Cell>
                </Row>
            )
        })
    }

    render() {
        const { Header, Row, HeaderCell, Body} = Table;
        return(
            <Layout>
                <Link route={`/cf/${this.props.address}/spending_requests/new`}>
                    <a>
                        <Button floated="right" style={{marginBottom: "20px"}} primary> Create New Request</Button>
                    </a>
                </Link>

                {this.state.message.length > 0 ? this.displayErrorMessage() : null}
                
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient Details</HeaderCell>
                            <HeaderCell>Approvers Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        { this.renderRequestsBody() }
                    </Body>
                </Table>
            </Layout>
        )
    }
}

export default SpendingRequestIndex;
