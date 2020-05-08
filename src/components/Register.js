import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const Register = () => (
    <div>
        <SignUp />
    </div> 
)


const initState = {
    email: '',
    password: '',
    passwordrepeat: '',
    error: null
};


class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState}
    }

    handleSubmit = e => {
        e.preventDefault();
        const {email, password } = this.state;

        this.props.firebase.doCreateUserWithEmailAndPassword(email, password)
        .then(authUser => {
            this.setState({...initState});
            this.props.history.push('/createaccount');
        })
        .catch(error => {
            this.setState({ error });
        })

    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render () {
        const {
            email, password, passwordrepeat, error
        } = this.state;

        const invalid = 
            password !== passwordrepeat || password === '' || email === '';
        return (
            <div className="rectangle registerect container" style={{ marginTop: "120px", width: '100%', height: '100%' }}>
                <div className="container">
                    <h1>Help us get you work/ers</h1>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                        { error !== null ? (	                        
                            <Alert variant="warning">	                            
                                {error.message}	                                
                            </Alert>	                           
                        ) : null }
                        <FormControl value={email} onChange={this.handleChange} type="text" placeholder="Email" name="email" className="mr-sm-2 col-sm-6 col-xs-12" id='userRegistrationEmail' />
                        <FormControl value={password} onChange={this.handleChange} type="password" placeholder="Password" name="password" className="mr-sm-2 col-sm-6 col-xs-12" id='userRegistrationPassword' />
                        <FormControl value={passwordrepeat} onChange={this.handleChange} type="password" placeholder="Repeat Password" name="passwordrepeat" className="mr-sm-2 col-sm-6 col-xs-12" id='userRegistrationPasswordRepeat' />

                        <Button disabled={invalid} type="submit" variant="warning">
                            Register
                            </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

const SignUp = compose(withRouter, withFirebase)(SignUpForm);

export default Register;

export { SignUp };