import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { withAuthorization } from './Session';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PasswordChangeForm from './PasswordChange';
import { compose } from 'recompose';
import { FaBriefcase, FaUserSecret, FaUserTie } from "react-icons/fa";
import CompanyAccount from "./CompanyAccount";
import SavedVacancies from './SavedVacancies';
import UserForm from './CreateUser';

import { connect } from 'react-redux';

    class UserAccount extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: false,
                incognito: null,
                key: '',
                showProfileAdd: false
            };
        }

        componentDidMount() {
            // loading flag
            if (!this.props.user) {
                this.setState({ loading: true });
            }
            let currentComponent = this;
            this.setState({ loading: true });

            this.props.firebase.storage.ref(this.props.authUser.uid).child('ProfileImage.'+this.props.authUser.uid)
            .getDownloadURL().then(url => { this.setState({ url: url}) });
    
                
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
                        currentComponent.setState({ loading: false, key: Object.keys(snapshot.val())[0]  });
                    });
                })
                // Education
                this.props.firebase.education(this.props.authUser.uid)
                .once('value').then(function(snapshot) {
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
                        if (document.getElementById('education')!= null) {
                            document.getElementById('education').appendChild(div);
                        }

                        // console.log(currentComponent.state.educations);
                    });
                })
                // Experience
                this.props.firebase.experience(this.props.authUser.uid)
                .once('value').then(function(snapshot) {
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
                        if (document.getElementById('experience')!= null) {
                            document.getElementById('experience').appendChild(div);
                        }
                        // console.log(currentComponent.state.experiences);
                    });
                })
                // Likes
                var likesRef = this.props.firebase.database().ref.child('likes').ref.child(this.props.authUser.uid);
                likesRef.on('value', snapshot => {
                    if (document.getElementById('likes') != null) {
                        document.getElementById('likes').innerHTML = '';
                    } 
                    snapshot.forEach(snap1 => {
                        currentComponent.setState({
                            likes: snapshot.val(),
                        });
                        var likeDiv = document.createElement('div');
                        likeDiv.setAttribute('class', 'edu');
                        var p = document.createElement('p');
                        p.setAttribute('class', 'name');
                        p.textContent = "Liked by " + snap1.child('email').val() + " on " + snap1.child('date').val();
                        likeDiv.appendChild(p);
    
                        var hr = document.createElement('hr');
                        likeDiv.appendChild(hr);
                        if (document.getElementById('likes')!= null) {
                            if (likeDiv !== '') {
                                document.getElementById('likes').appendChild(likeDiv);
                            } else {
                                // NOT WORKING
                                document.getElementById('likes').innerHTML = "You don't have any likes yet";
                            }
                        }
                    });
            });

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

            // console.log(this.props.user);
            // console.log(this.props.user.incognito);
            // console.log(this.props.user.userId);

            
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

        showAllInfo  = (e) => {
            e.preventDefault();
            if (this.state.showProfileAdd === true) {
                this.setState({showProfileAdd: false});
            } else {
                this.setState({showProfileAdd: true});
            }
            // console.log(this.state.showProfileAdd);
        }
        
        render () {
            // const { loading } = this.state;
            // const { showProfileAdd } = this.state;

            return (
                    <div style={{marginTop: "120px"}}>
                    <h1 style={{marginLeft: "20px"}}>Welcome to your account, {this.props.authUser.email}</h1>
                    
                    { this.props.user != null ? (
                        <div>	                        
                            <div className="container">  
                                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                                <Row>
                                    <Col sm={3}>
                                    <ListGroup>
                                        <ListGroup.Item action href="#link1">
                                        User Account
                                        </ListGroup.Item>
                                        <ListGroup.Item action href="#link2">
                                        Invitations / Likes
                                        </ListGroup.Item>
                                        <ListGroup.Item action href="#link3">
                                        Applications
                                        </ListGroup.Item>
                                        <ListGroup.Item action href="#link4">
                                        Settings
                                        </ListGroup.Item>
                                        <ListGroup.Item action href="#link5">
                                        Saved Vacancies
                                        </ListGroup.Item>
                                    </ListGroup>
                                    </Col>
                                    <Col sm={9} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '5px'}}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="#link1">
                                            <h2 className="centerText" style={{marginBottom: 0}}>{this.props.user.firstName}
                                                <span> {this.props.user.lastName}</span></h2>
                                            <Row>
                                                <Col sm={6}>
                                                <p style={{color: 'rgb(155,155,155)'}}>
                                                    <span>{this.props.user.city}</span>,
                                                    <span> {this.props.user.province}</span>, 
                                                    <span> {this.props.user.country}</span>
                                                </p> <br />
                                                <h4><FaBriefcase /> {this.props.user.title}</h4>
                                                </Col>
                                                <Col sm={6}>
                                                <img
                                                src={this.state.url || require('../img/logo.png')}
                                                alt="Uploaded Profile"
                                                width="100"
                                                />
                                                </Col>
                                            </Row>
                                            <Button onClick={this.showAllInfo} style={{marginLeft: '7px'}} type="button" variant="warning">
                                                Change Profile
                                            </Button>
                                            { this.state.showProfileAdd ? <UserForm></UserForm> : null}
                                            

                                        </Tab.Pane>
                                        <Tab.Pane eventKey="#link2">
                                            <h2>Likes</h2>
                                            <div id="likes"></div>
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
                            <Row style={{marginTop: "50px", marginBottom: "50px"}}>
                                <Col className="container" sm={4} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px'}}>
                                    <h3 className="centerText">Education</h3>
                                    <div className="container" id="education"></div>
                                </Col>
                                <Col className="container" sm={4} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px'}}>
                                    <h3 className="centerText">Experience</h3>
                                    <div className="container" id="experience"></div>
                                </Col>
                                <Col className="container" sm={2} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px'}}>
                                    <h3 className="centerText">Account Visibility <br />
                                    { this.props.user.incognito === 1 ? (	                        
                                        <FaUserSecret />                           
                                    ) : <FaUserTie /> }
                                    </h3>
                                    { this.props.user.incognito === 1 ? (	                        
                                        <p className="container" id="visibility">Incognito</p>                         
                                    ) : <p className="container" id="visibility">Visible</p> }
                                    {/* <p id="visibility"></p> */}
                                    <Form
                                        onSubmit={e => this.handleSubmit(e)}>
                                    {/* <FormControl style={{display: 'hidden'}} value={this.state.incognito} onChange={this.handleChange} type="checkbox" name="incognito" id='chbincognito' /> */}
                                    <Button style={{marginLeft: '7px'}} type="submit" variant="warning">
                                        Change
                                    </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </div>  
                    ) : <CompanyAccount /> }
                </div> 
            )
        }
    }


// Redux stuff
const mapStateToProps = (state, props) => ({
    authUser: state.sessionState.authUser,
    // user: (state.userState.users || {})[props.match.params.id],
    // user: Object.keys(state.userState.users || {}).map(key => ({
    //     ...state.userState.users[key],
    //     uid: key,
    //   })),
    // user: Object.keys(state.userState.users || {}).map(key => ({
    //         ...state.userState.users,
    //     }))
    user: (state.userState.user || {})[Object.keys(state.userState.user  || {})]

});
     
const mapDispatchToProps = dispatch => ({
    onSetUser: (user, key) => dispatch({ type: 'USER_SET', user, key }),
  });


const condition = authUser => !!authUser;

// export default withAuthorization(condition)(UserAccount);
export default compose(connect(mapStateToProps, mapDispatchToProps), withFirebase, withAuthorization(condition))(UserAccount);
