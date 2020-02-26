import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from './Firebase';

const initState = {
    email: '',
    password: '',
    error: null,
    show: false
};

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...initState };
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, password } = this.state;

        this.props.firebase.doSignInWithEmailAndPassword(email, password)
            .then(authUser => {
                this.setState({ ...initState });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ error });
            })

    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    changeVisibility = () => {
        this.state.show === true ? this.setState({ show: false }) : this.setState({ show: true })
    }

    render() {
        const { email, password, error } = this.state;

        const invalid = password === '' || email === '';

        return (
            <div>
                <Button variant="warning" className="loginButton" onClick={this.changeVisibility}>
                    Login / Register
                </Button>

                <Modal show={this.state.show} onHide={this.changeVisibility} className="modal" id='modalSignIn'>
                    <Modal.Body>
                        <div className="container">
                            <div id='authForm'>
                                <Form
                                    onSubmit={this.handleSubmit}>
                                    {error !== null ? (
                                        <Alert variant="warning">
                                            {error.message}
                                        </Alert>
                                    ) : null}
                                    <FormControl value={email} onChange={this.handleChange} type="text" placeholder="Email" name="email" className="mr-sm-2 col-12 authInputs" id='userSignInEmail' />
                                    <FormControl value={password} onChange={this.handleChange} type="password" placeholder="Password" name="password" className="mr-sm-2 col-12 authInputs" id='userSignInPassword' />

                                    <Button disabled={invalid} type="submit" variant="warning" className='authInputs'>
                                        Login
                                    </Button>
                                    <p onClick={this.changeVisibility}>Don't have an account? <Link as={Link} to="/register">Register</Link> for free:)</p>
                                </Form>

                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

const SignIn = compose(withRouter, withFirebase)(SignInForm);

export default SignIn;