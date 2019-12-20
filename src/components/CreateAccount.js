import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import FormControl from 'react-bootstrap/FormControl';
import { withAuthorization } from './Session';

class CreateAccount extends Component {

    handleSubmit = e => {
        e.preventDefault();
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render () {
       
        return (
            <div className="rectangle registerect container" style={{ marginTop: "120px" }}>
                <div className="container">
                    <h1>Tell us who you are</h1>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                       
                        <FormControl value="" onChange={this.handleChange} type="radio" name="jobseeker" className="mr-sm-2 col-12 col-xs-12" id='rdbjobseeker' />
                        <label htmlFor="rdbjobseeker">Job Seeker</label>
                        <FormControl value="" onChange={this.handleChange} type="radio" name="employer" className="mr-sm-2 col-12 col-xs-12" id='rdbemployer' />
                        <label htmlFor="rdbemployer">Employer</label>

                        <Row>
                            <Button type="submit" variant="warning" className="container center">
                                Continue
                            </Button>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreateAccount);
