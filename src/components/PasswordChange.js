import React, { Component } from 'react';
import { withFirebase } from './Firebase';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const INIT_STATE = {
    passOne: '',
    passTwo: '',
    error: null,
    success: null
}

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INIT_STATE };
    }

    handleSubmit = e => {
        e.preventDefault();
        const {passOne } = this.state;

        this.props.firebase.doPasswordUpdate(passOne)
        .then(() => {
            this.setState({...INIT_STATE});
            let success = "The password was succesfully updated!";
            this.setState({success});
        })
        .catch(error => {
            this.setState({ error });
        })

    }

    handleChange = event => {
        this.setState({ [event.target.name] : event.target.value });
    };

    render() {
        const { passOne, passTwo, error, success } = this.state;

        const invalid = passOne !== passTwo || passOne === '';


        return (
            <Form
            onSubmit={this.handleSubmit}
            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
            { error !== null ? (	                        
                <Alert variant="danger">	                            
                    {error.message}	                                
                </Alert>	                           
            ) : null }
            { success !== null ? (	                        
                <Alert variant="warning">	                            
                    {success}                                
                </Alert>	                           
            ) : null }
            <FormControl value={passOne} onChange={this.handleChange} type="password" placeholder="New Password" name="passOne" className="col-12" id='userRegistrationPassword' />
            <FormControl value={passTwo} onChange={this.handleChange} type="password" placeholder="Repeat Password" name="passTwo" className="col-12" id='userRegistrationPasswordRepeat' />

            <Button disabled={invalid} type="submit" variant="warning">
                Update
                </Button>
        </Form>
        )
    }
}

export default withFirebase(PasswordChangeForm);