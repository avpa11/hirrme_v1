import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { withAuthorization } from './Session';
import { withRouter } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { compose } from 'recompose';
import { FaBriefcase, FaUserSecret, FaUserTie } from "react-icons/fa";
import CompanyAccount from "./CompanyAccount";
import SavedVacancies from './SavedVacancies';
import PasswordChangeForm from '../reusable/PasswordChange';
import UserForm from '../reusable/CreateUser';
import FormEducation from '../reusable/FormEducation';
import FormExperience from '../reusable/FormExperience';
import ProfileImage from '../reusable/ProfileImage';
import Video from '../components/Video2';

import { connect } from 'react-redux';

class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            incognito: null,
            key: '',
            showProfileAdd: false,
            addEducation: false,
            // openTabLocation: this.props.location.hash
        };
    }

    componentDidMount() {
        // loading flag
        if (!this.props.user) {
            this.setState({ loading: true });
        }
        let currentComponent = this;

        this.setState({ loading: true });

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
                currentComponent.setState({ loading: false, key: Object.keys(snapshot.val())[0] });
            });
        })
        // Education
        var educationRef = this.props.firebase.education(this.props.authUser.uid)
        educationRef.on('value', snapshot => {

            if (document.getElementById('education') != null) {
                document.getElementById('education').innerHTML = '';
            }

            snapshot.forEach(snap1 => {
                currentComponent.setState({
                    educations: snapshot.val(),
                });
                var div = document.createElement('div');
                div.setAttribute('class', 'edu');
                var p = document.createElement('p');
                p.setAttribute('class', 'mainp');
                p.textContent = snap1.child('programName').val();
                var spanDate = document.createElement('span');
                spanDate.setAttribute('class', 'span_date');
                spanDate.textContent = snap1.child('startDate').val() + " - " + snap1.child('endDate').val();
                p.appendChild(spanDate);
                div.appendChild(p);
                var p2 = document.createElement('p');
                p2.setAttribute('class', 'name');
                p2.textContent = snap1.child('schoolName').val() + ", " + snap1.child('location').val();
                div.appendChild(p2);
                if (document.getElementById('education') != null) {
                    document.getElementById('education').appendChild(div);
                }
            })
        })

        // Experience
        var experienceRef = this.props.firebase.experience(this.props.authUser.uid);
        experienceRef.on('value', snapshot => {

            if (document.getElementById('experience') != null) {
                document.getElementById('experience').innerHTML = '';
            }

            snapshot.forEach(snap1 => {
                currentComponent.setState({
                    experiences: snap1.val(),
                });
                var div = document.createElement('div');
                div.setAttribute('class', 'edu');
                var p = document.createElement('p');
                p.setAttribute('class', 'mainp');
                p.textContent = snap1.child('position').val();
                var spanDate = document.createElement('span');
                spanDate.setAttribute('class', 'span_date');
                spanDate.textContent = snap1.child('startDate').val() + " - " + snap1.child('endDate').val();
                p.appendChild(spanDate);
                div.appendChild(p);
                var p2 = document.createElement('p');
                p2.setAttribute('class', 'name');
                p2.textContent = snap1.child('company').val() + ", " + snap1.child('location').val();
                div.appendChild(p2);
                if (document.getElementById('experience') != null) {
                    document.getElementById('experience').appendChild(div);
                }
            });
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var incognito = this.state.incognito;
        if (this.props.user.incognito === 1) {
            incognito = null;
        } else if (this.props.user.incognito === 0) {
            incognito = null;
        } else {
            incognito = 1;
        }

        this.props.firebase.users().ref.child(this.state.key).update({
            incognito: incognito,
        })
            .catch(error => console.log(error));
    }

    componentWillUnmount() {
        this.props.firebase.database().off();
        this.props.firebase.database().ref.child('users').off();
        this.props.firebase.database().ref.child('experience').off();
        this.props.firebase.database().ref.child('educations').off();
    }

    showAllInfo = (e) => {
        e.preventDefault();
        if (this.state.showProfileAdd === true) {
            this.setState({ showProfileAdd: false });
        } else {
            this.setState({ showProfileAdd: true });
        }
    }

    addEducation = (e) => {
        e.preventDefault();
        if (this.state.addEducation === true) {
            this.setState({ addEducation: false });
        } else {
            this.setState({ addEducation: true });
        }
    }

    addExperience = (e) => {
        e.preventDefault();
        if (this.state.addExperience === true) {
            this.setState({ addExperience: false });
        } else {
            this.setState({ addExperience: true });
        }
    }

    goToProfile = () => {
        this.props.history.push({
            pathname: `profile/${this.props.authUser.uid}`,
            // userData: this.props.userData
        })
        // console.log(this.props);
    }

    render() {
        return (
            <React.Fragment>
                <Video />
            <div style={{ marginTop: "120px" }}>
                {this.props.user != null ? (
                    <div>
                        <div className="container">
                            <Tab.Container id="list-group-tabs-example" activeKey={this.props.location.hash} defaultActiveKey="#link1">
                                <Row>
                                    <Col sm={3}>
                                        <ListGroup style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25) !important' }}>
                                            <ListGroup.Item action href="#link1">
                                                User Account
                                        </ListGroup.Item>
                                            <ListGroup.Item action href="#link3">
                                                Edit Profile
                                            </ListGroup.Item>
                                            <ListGroup.Item action href="#link4">
                                                Settings
                                        </ListGroup.Item>
                                            <ListGroup.Item action href="#link5">
                                                Saved Vacancies
                                        </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col sm={9} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '5px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="#link1">
                                                <Row>
                                                    <Col sm={4} style={{borderRight: '1px solid #686868', marginTop: '1em', marginBottom: '1em'}}>
                                                    <div className="center">
                                                        { (this.props.user!== null && this.props.user!== undefined) ?
                                                            (<img
                                                            src={this.state.url ||  this.props.user.profileImage || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                                                            alt="Uploaded Profile"
                                                            width="100"
                                                            />) : (
                                                                <img
                                                                src={this.state.url || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                                                                alt="Uploaded Profile"
                                                                width="100"
                                                                />
                                                                )}
                                                        </div>
                                                        <h4 className="center" style={{ marginBottom: 0, marginTop: '20px', color: '#686868' }}>{this.props.user.firstName}
                                                        <span> {this.props.user.lastName}</span></h4>
                                                        <p className="center" style={{ color: '#686868' }}>
                                                            <span>{this.props.user.city}</span>,
                                                            <span> {this.props.user.province}</span>,
                                                            <span> {this.props.user.country}</span>
                                                        </p> <br />
                                                    </Col>
                                                    <Col sm={8} style={{marginTop: '1em'}}>
                                                        <h4>{this.props.user.title} <span class="jobTypeSpan" style={{float: 'right'}}>#full-time</span></h4>
                                                        
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                                        <Button style={{marginBottom: '20px', float: 'right', background: '#FFAC11'}} onClick={this.goToProfile} variant="warning">View public profile</Button>

                                                    </Col>
                                                </Row>


                                            </Tab.Pane>
                                            <Tab.Pane eventKey="#link3">
                                                <Row  style={{marginTop: '20px'}}>
                                                    <Col sm={6}>
                                                        <UserForm></UserForm>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <ProfileImage></ProfileImage>
                                                    </Col>
                                                </Row>
                                                <Row className="container"  style={{marginBottom: '20px'}}>
                                                    <Col sm={6}></Col> 

                                                    <Col sm={6} className = "center">
                                                        <h5>Account Visibility </h5>
                                                        {this.props.user.incognito === 1 ? (
                                                            <React.Fragment><p style={{display: 'inline'}} className="container"><FaUserSecret /> Incognito</p></React.Fragment>
                                                            ) : <React.Fragment><p style={{display: 'inline'}} className="container"><FaUserTie /> Visible</p></React.Fragment>}
                                                        <Form style={{display: 'inline'}} onSubmit={e => this.handleSubmit(e)}>
                                                            <Button style={{ marginLeft: '7px', borderRadius: '20px' }} type="submit" variant="warning">
                                                                Change
                                                            </Button>
                                                        </Form>
                                                    </Col>             
                                                </Row>
                                            </Tab.Pane>
                                            <Tab.Pane id="settingsTab" eventKey="#link4">
                                                <h2>Password Change</h2>
                                                <PasswordChangeForm />
                                            </Tab.Pane>
                                            <Tab.Pane id="settingsTab" eventKey="#link5">
                                                {/* <h2>Saved Vacancies</h2> */}
                                                <SavedVacancies></SavedVacancies>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </div>
                        <Row className="container divcenter" style={{ marginTop: "50px", marginBottom: "50px" }}>
                            <Col className="container" sm={12} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                <h3 className="center">Previous Education</h3>
                                <div className="container" id="education"></div>
                                <Button onClick={this.addEducation} style={{ marginLeft: '7px', marginBottom: '20px' }} type="button" variant="warning">
                                    Add Education
                                    </Button>
                                {this.state.addEducation ? <FormEducation></FormEducation> : null}
                            </Col>
                        </Row>
                        <Row className="container divcenter" style={{ marginTop: "50px", marginBottom: "50px" }}>
                            <Col className="container" sm={12} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                <h3 className="center">Previous Experience</h3>
                                <div className="container" id="experience"></div>
                                <Button onClick={this.addExperience} style={{ marginLeft: '7px', marginBottom: '20px' }} type="button" variant="warning">
                                    Add Experience
                                    </Button>
                                {this.state.addExperience ? <FormExperience></FormExperience> : null}
                            </Col>
                        </Row>
                    </div>
                ) : <CompanyAccount />}
            </div>
</React.Fragment>
        )
    }
}


// Redux stuff
const mapStateToProps = (state, props) => ({
    authUser: state.sessionState.authUser,
    user: (state.userState.user || {})[Object.keys(state.userState.user || {})],
    userKey: Object.keys(state.userState.user || {})[0]

});

const mapDispatchToProps = dispatch => ({
    onSetUser: (user, key) => dispatch({ type: 'USER_SET', user, key }),
});


const condition = authUser => !!authUser;

export default compose(connect(mapStateToProps, mapDispatchToProps), withFirebase, withRouter, withAuthorization(condition))(UserAccount);
