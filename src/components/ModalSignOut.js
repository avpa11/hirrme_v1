import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { withFirebase } from './Firebase';
import { AuthUserContext } from './Session';
import { IoIosPerson, IoIosPersonAdd, IoIosThumbsUp, IoIosDocument, IoMdSettings } from "react-icons/io";

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
                            <IoIosPerson size={40} />
                            {authUser.email}
                        </Button>

                        <Modal show={this.state.show} onHide={this.changeVisibility} className="modal" id='modalSignOut'>
                            <Modal.Body>
                                <Form
                                    onSubmit={this.handleSubmit}>
                                    <div id='modalSignOutItems'>
                                        <div onClick={this.changeVisibility}>                                             
                                            <Link className='userModalLinks' style={{ 'textDecoration': 'none', 'color': 'black' }} as={Link} to="/useraccount">
                                            <IoIosPersonAdd size={40} /><span>User's profile</span>                                            
                                            </Link>
                                        </div>
                                        <div>
                                            <IoIosThumbsUp size={40} /><span>My invitations</span>
                                            
                                        </div>
                                        <div>
                                            <IoIosDocument size={40} /><span>My applications</span>
                                            
                                        </div>
                                        <div>
                                            <IoMdSettings size={40} /><span>Settings</span>                                            
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