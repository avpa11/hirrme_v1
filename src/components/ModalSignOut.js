import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { withFirebase } from './Firebase';
import { AuthUserContext } from './Session';

const initState = {
    email: '',
    password: '',
    error: null,
    show: false
};

class SignOutForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...initState}
    }
    
    handleSubmit = e => {
        e.preventDefault();
        
        this.props.firebase.doSignOut()
        .then(authUser => {
            this.setState({ ...initState });
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({ error });
        })
    }
    
    changeVisibility = () => {
        this.state.show === true ? this.setState({ show: false }) : this.setState({ show: true })
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <Button variant="light" className="logoutButton" onClick={this.changeVisibility}>
                            {authUser.email}
                            <img src='https://img.icons8.com/plasticine/2x/user.png' alt='' style={{ width: '2em' }}></img>
                        </Button>

                        <Modal show={this.state.show} onHide={this.changeVisibility} className="modal" id='modalSignOut'>
                            <Modal.Body>
                                <Form
                                    onSubmit={this.handleSubmit}>
                                    <div id='modalSignOutItems'>
                                        <div onClick={this.changeVisibility}>                                             
                                            <Link className='userModalLinks' style={{ 'textDecoration': 'none', 'color': 'black' }} as={Link} to="/useraccount">
                                            <img src='https://img.icons8.com/ios/50/000000/user.png' alt='' />User's profile
                                            </Link>
                                        </div>
                                        <div>
                                            <img src='https://img.icons8.com/material-outlined/24/000000/thumb-up.png' alt='' />
                                            My invitations
                                        </div>
                                        <div>
                                            <img src='https://img.icons8.com/wired/64/000000/word.png' alt='' />
                                            My applications
                                        </div>
                                        <div>
                                            <img src='https://img.icons8.com/ios/50/000000/settings.png' alt='' />
                                            Settings
                                        </div>
                                    </div>

                                    <div id='buttonLogoutPlaceholder'>
                                        <Button type="submit" variant="light" id="buttonLogout">
                                            Logout
                                        </Button>
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </div>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

const SignOut = compose(withRouter, withFirebase)(SignOutForm);
export default SignOut;