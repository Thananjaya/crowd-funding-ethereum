import React, { Component } from 'react';
import Layout from '../../components/layout';
import { Button, Form} from 'semantic-ui-react';

class CrowdFundingNew extends Component {

    render(){
        return(
            <Layout>
                <h3> Represent your project for raising crowd funding </h3>
                <Form>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <input placeholder="Amount in wei" />
                    </Form.Field>
                    <Button type="submit" primary> Submit this project </Button>
                </Form>
            </Layout>
        )
    }
}

export default CrowdFundingNew;