import React, { Component } from 'react';
import { Link , withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { withFirebase } from './Firebase';
// import { AuthUserContext } from './Session';
import { IoIosPerson, IoIosPersonAdd, IoIosThumbsUp, IoIosDocument, IoMdSettings, IoMdClipboard } from "react-icons/io";
import { NavHashLink } from 'react-router-hash-link';

import { connect } from 'react-redux';

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
            this.props.onSetUser(null, 'user');
            this.props.onSetUserType(null, 'userType');
            this.props.onSetLikedUsers(null);
            this.props.onSetSavedVacancies(null);
            this.props.onSetAppliedVacancies(null);

        })
        .catch(error => {
            this.setState({ error });
        })
    }
    
    changeVisibility = () => {
        this.state.show === true ? this.setState({ show: false }) : this.setState({ show: true })
    }

    render() {
        // Waldi, please check the userType
        let userType = this.props.userType;
        // console.log(this.props.userType);
        return (

                <div>
                    <Button variant="light" className="logoutButton" onClick={this.changeVisibility}>
                        <IoIosPerson size={40} />
                        {this.props.authUser.email}
                    </Button>

                    <Modal show={this.state.show} onHide={this.changeVisibility} className="modal" id='modalSignOut'>
                        <Modal.Body>
                            <Form
                                onSubmit={this.handleSubmit}>
                                <div id='modalSignOutItems'>
                                    <div onClick={this.changeVisibility}>                                             
                                        <NavHashLink className='userModalLinks' style={{ 'textDecoration': 'none', 'color': 'black' }} as={Link} to="/useraccount#link1">
                                        <IoIosPersonAdd size={40} /><span>User's profile</span>                                            
                                        </NavHashLink>
                                    </div>
                                    {userType === 'jobSeeker' ? (
                                        <React.Fragment>
                                            <div>
                                                <NavHashLink className='userModalLinks' style={{ 'textDecoration': 'none', 'color': 'black' }} to="/useraccount#link3">
                                                    <IoIosDocument size={40} /><span>My applications</span>     
                                                </NavHashLink>                                       
                                            </div>
                                            <div>
                                                <NavHashLink className='userModalLinks'  style={{ 'textDecoration': 'none', 'color': 'black' }}  to="/useraccount#link4">
                                                    <IoMdSettings size={40} /><span>Settings</span>   
                                                </NavHashLink>                                         
                                            </div>
                                            <div>
                                                <NavHashLink  as={Link} className='userModalLinks' style={{ 'textDecoration': 'none', 'color': 'black' }} to="/useraccount#link5">
                                                    <IoIosThumbsUp size={40} /><span>Saved Vacancies</span>
                                                </NavHashLink>                                            
                                            </div>
                                        </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <div>
                                                    <NavHashLink className='userModalLinks'  style={{ 'textDecoration': 'none', 'color': 'black' }}  to="/useraccount#link2">
                                                        <IoMdClipboard size={40} /><span>New Vacancy</span>   
                                                    </NavHashLink>     
                                                </div>
                                                <div>                                    
                                                    <NavHashLink className='userModalLinks'  style={{ 'textDecoration': 'none', 'color': 'black' }}  to="/useraccount#link4">
                                                        <IoMdSettings size={40} /><span>Settings</span>   
                                                    </NavHashLink>                                         
                                                </div>
                                            </React.Fragment>
                                        )
                                        }
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
        )
    }
}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
    userType: state.userTypeState.userType,
  });

  const mapDispatchToProps = dispatch => ({
    onSetUser: (user, key) => dispatch({ type: 'USER_SET', user, key }),
    onSetSavedVacancies: savedVacancies => dispatch({ type: 'SAVED_VACANCIES_SET', savedVacancies }),
    onSetLikedUsers: likedUsers => dispatch({ type: 'LIKED_USERS_SET', likedUsers }),
    onSetUserType: userType => dispatch({ type: 'USER_TYPE_SET', userType }),
    onSetAppliedVacancies: appliedVacancies => dispatch({ type: 'APPLIED_VACANCIES_SET', appliedVacancies })
  });
  

const SignOut = compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase)(SignOutForm);
export default SignOut;