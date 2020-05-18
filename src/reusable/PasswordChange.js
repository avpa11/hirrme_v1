import React, { Component } from 'react';
import { withFirebase } from '../components/Firebase';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const INIT_STATE = {
    passOne: '',
    passTwo: '',
    passwordrepeat: '',
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
        const { passOne, passTwo, error, passwordrepeat, success } = this.state;

        // const invalid = passOne !== passTwo || passOne === '' || passOne !== passwordrepeat;
        const invalid = passTwo === '' || passOne === '' || passTwo !== passwordrepeat;


        return (
            <Form
            onSubmit={this.handleSubmit}
            style={{ justifyContent: 'center', marginTop: "20px", marginBottom: "20px" }}>
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
            <div className="container col-sm-9 col-xs-12">
                <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Old password</Form.Label>
                <FormControl value={passTwo} onChange={this.handleChange} type="password" style={{paddingTop: '0'}} placeholder="" name="passTwo" id='userRegistrationPasswordTwo' />
                <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0'}}>Repeat password</Form.Label>
                <FormControl value={passwordrepeat} onChange={this.handleChange} type="password" style={{paddingTop: '0'}} placeholder="" name="passwordrepeat" id='userRegistrationPasswordRepeat' />
                <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0'}}>New password</Form.Label>
                <FormControl value={passOne} onChange={this.handleChange} type="password" style={{paddingTop: '0'}} placeholder="" name="passOne" id='userRegistrationPassword' />
            </div>
            <div className="center container" style={{marginTop: '20px', marginBottom: '40px'}}>
            <Button disabled={invalid} type="submit" variant="warning">
                Update
            </Button>
            </div>
        </Form>
        )
    }
}

export default withFirebase(PasswordChangeForm);