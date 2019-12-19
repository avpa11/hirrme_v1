import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from './Firebase';

const ModalLogin = () => {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            <Button variant="warning" className="loginButton" onClick={handleShow}>
              Login / Register
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <SignIn />
                    </div>
                    <Button variant="warning" onClick={handleClose}>
                    Close
                    </Button>
                    <p>Don't have an account? <Link as={Link} to="/register">Register</Link> for free:)</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}

const initState = {
    email: '',
    password: '',
    error: null
};

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...initState};
    }

    handleSubmit = e => {
        e.preventDefault();
        const {email, password } = this.state;

        this.props.firebase.doSignInWithEmailAndPassword(email, password)
        .then(authUser => {
            this.setState({...initState});
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({ error });
        })

    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const invalid = password === '' || email === '';

        return (
            <Form
            onSubmit={this.handleSubmit}
            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
            { error !== null ? (	                        
                <Alert variant="warning">	                            
                    {error.message}	                                
                </Alert>	                           
            ) : null }
            <FormControl value={email} onChange={this.handleChange} type="text" placeholder="Email" name="email" className="mr-sm-2 col-12" id='userSignInEmail' />
            <FormControl value={password} onChange={this.handleChange} type="password" placeholder="Password" name="password" className="mr-sm-2 col-12" id='userSignInPassword' />

            <Button disabled={invalid} type="submit" variant="warning">
                Sign In
                </Button>
        </Form>
        )
    }

}

const SignIn = compose(withRouter, withFirebase)(SignInForm);

export default ModalLogin;

export { SignIn };