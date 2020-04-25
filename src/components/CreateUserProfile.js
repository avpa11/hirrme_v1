import React, { Component }  from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

import UserProfileForm from '../reusable/CreateUser';
import ProfileImage from '../reusable/ProfileImage';

const initState = {
    img: null,
    progress: 0,
    key: null,
    profileImage: null
};


class CreateUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState};
    }

    componentDidMount() {
        if (this.props.userType !== null) {
            this.props.history.push('/');
        }
        let currentComponent = this;
        var jobSeekersRef = this.props.firebase.users().orderByChild('userId')
        .equalTo(this.props.authUser.uid)
        jobSeekersRef.on('value', snapshot => {
            snapshot.forEach(snap1 => {
                // Redux
                this.props.onSetUser(
                    snap1.val(),
                    // user object key
                    Object.keys(snapshot.val())[0],
                );
                currentComponent.setState({ key: Object.keys(snapshot.val())[0]  });
            });
        })
    }

    componentWillUnmount() {
        this.props.firebase.database().off();
        this.props.firebase.database().ref.child('users').off();
    }

    redirect = e => {
        this.props.history.push('/education');
    }

    render () {
        return (
                <div className="registerCard container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h2 className="center">Almost done!</h2>
                        <Row>
                            <Col sm={6}>
                            {/* { (this.props.user === null || this.props.user === undefined) ? (
                                <UserProfileForm></UserProfileForm>
                            ) : null} */}

                                <UserProfileForm></UserProfileForm>
                            </Col>
                            <Col sm={6} className="center" style={{marginTop: '40px'}}>
                                <ProfileImage></ProfileImage>
                            </Col>
                        </Row>
                        {(this.props.user!== null && this.props.user!== undefined) ? 
                            <div className="center" style={{marginTop: '15px', paddingBottom: '50px'}}>
                                <Button type="button"  className="loginButton" variant="warning" onClick={this.redirect}>Continue</Button>
                            </div> 
                            :
                            null
                        }
                    </div>
                </div>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
    user: (state.userState.user || {})[Object.keys(state.userState.user  || {})],
    userKey: Object.keys(state.userState.user  || {})[0]
  });

  const mapDispatchToProps = dispatch => ({
      onSetProfileFiles: profileFiles => dispatch({ type: 'FILES_SET', profileFiles }),
      onSetUser: (user, key) => dispatch({ type: 'USER_SET', user, key }),

  })

// condtion to check for user authorization
const condition = authUser => !!authUser;

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase, withAuthorization(condition))(CreateUserForm);