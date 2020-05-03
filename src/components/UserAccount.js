import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { withAuthorization } from './Session';
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

    render() {
        return (
            <React.Fragment>
                <Video />
            <div style={{ marginTop: "120px" }}>
                {this.props.user != null ? (
                    <div>
                        <div className="container">
                            <Tab.Container id="list-group-tabs-example" activeKey={this.props.location.hash} defaultActiveKey="#link1" >
                                <Row>
                                    <Col sm={3}>
                                        <ListGroup>
                                            <ListGroup.Item action href="#link1">
                                                User Account
                                        </ListGroup.Item>
                                            {/* <ListGroup.Item action href="#link3">
                                                Applications
                                            </ListGroup.Item> */}
                                            <ListGroup.Item action href="#link4">
                                                Settings
                                        </ListGroup.Item>
                                            <ListGroup.Item action href="#link5">
                                                Saved Vacancies
                                        </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col sm={9} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '5px' }}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="#link1">
                                                <h2 className="centerText" style={{ marginBottom: 0 }}>{this.props.user.firstName}
                                                    <span> {this.props.user.lastName}</span></h2>
                                                <Row>
                                                    <Col sm={6}>
                                                        <p style={{ color: 'rgb(155,155,155)' }}>
                                                            <span>{this.props.user.city}</span>,
                                                    <span> {this.props.user.province}</span>,
                                                    <span> {this.props.user.country}</span>
                                                        </p> <br />
                                                        <h4><FaBriefcase /> {this.props.user.title}</h4>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <ProfileImage></ProfileImage>
                                                    </Col>
                                                </Row>
                                                {/* Account Visibility Section */}
                                                <Row className="container">
                                                    <Col sm={12}><h5>Account Visibility </h5></Col> 

                                                    <Col sm={12}>
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

                                                {/* Change Profile Section */}
                                                <div className="center">
                                                    <Button onClick={this.showAllInfo}  style={{ marginLeft: '7px', marginBottom: '20px', marginTop: '20px' }} type="button" variant="danger">
                                                        Change Profile
                                                    </Button>
                                                </div>
                                                {this.state.showProfileAdd ? <UserForm></UserForm> : null}


                                            </Tab.Pane>
                                            <Tab.Pane eventKey="#link3">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nemo assumenda cumque, explicabo ex soluta eveniet accusantium corrupti labore! Ea inventore ab ut ullam cupiditate aut voluptates illum vel culpa.
                                        </Tab.Pane>
                                            <Tab.Pane id="settingsTab" eventKey="#link4">
                                                <h2>Password Change</h2>
                                                <PasswordChangeForm />
                                            </Tab.Pane>
                                            <Tab.Pane id="settingsTab" eventKey="#link5">
                                                <h2>Saved Vacancies</h2>
                                                <SavedVacancies></SavedVacancies>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </div>
                        <Row className="container divcenter" style={{ marginTop: "50px", marginBottom: "50px" }}>
                            <Col className="container" sm={5} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px' }}>
                                <h3 className="centerText">Education</h3>
                                <div className="container" id="education"></div>
                                <Button onClick={this.addEducation} style={{ marginLeft: '7px', marginBottom: '20px' }} type="button" variant="warning">
                                    Add Education
                                    </Button>
                                {this.state.addEducation ? <FormEducation></FormEducation> : null}
                            </Col>
                            <Col sm={2}></Col>
                            <Col className="container" sm={5} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px' }}>
                                <h3 className="centerText">Experience</h3>
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

export default compose(connect(mapStateToProps, mapDispatchToProps), withFirebase, withAuthorization(condition))(UserAccount);
