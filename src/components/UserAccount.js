import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { AuthUserContext, withAuthorization } from './Session';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PasswordChangeForm from './PasswordChange';
import { compose } from 'recompose';
import { FaBriefcase } from "react-icons/fa";
import { FaUserSecret, FaUserTie } from "react-icons/fa";
class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          user: [],
          educations: [],
          experiences: [],
          incognito: null,
          key: ''
        };
      }
    
    // getCompanyName = (uid) => {
    //     this.props.firebase.company(uid).on('value', snap => {
    //         snap.forEach(childSnap => {
    //             var companyName = childSnap.child('companyName').val();
    //         })
    //     })
    // }

    componentDidMount() {
        let currentComponent = this;
        this.setState({ loading: true });
        this.props.firebase.auth.onAuthStateChanged(authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
            // this.props.firebase.user(this.state.authUser.uid).on('value', snapshot => {
            //     this.setState({
            //         user: snapshot.val(),
            //         loading: false,
            //     });
            // })  

            var jobSeekersRef = this.props.firebase.database().ref.child('users').orderByChild('userId')
            .equalTo(this.state.authUser.uid)
            jobSeekersRef.on('value', snapshot => {
                snapshot.forEach(snap1 => {
                    currentComponent.setState({
                        user: snap1.val(),
                        loading: false,
                    });
                    if (snapshot.val() !== null) {
                        Object.keys(snapshot.val() ).forEach(key => {
                          // The ID is the key
                        //   console.log(key);
                          currentComponent.setState({
                            key: key,
                        });
                        });
                    }
                    // console.log(currentComponent.state.user.incognito);
                    // console.log(currentComponent.state.user);
                    // console.log(snapshot.val());
                });
            })

            this.props.firebase.database().ref.child('educations').ref.child(this.state.authUser.uid)
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

            this.props.firebase.database().ref.child('experience').ref.child(this.state.authUser.uid)
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

        });

      }   

      handleSubmit = (e) => {
        e.preventDefault();
        var incognito = this.state.incognito;
        if (this.state.user.incognito === 1) {
            incognito = null;
        } else if (this.state.user.incognito === 0) {
            incognito = null;
        } else {
            incognito = 1;
        }

        this.props.firebase.database().ref.child('users').ref.child(this.state.key).update({
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

    render () {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                <div style={{marginTop: "120px"}}>
                <h1 style={{marginLeft: "20px"}}>Welcome to your account, {authUser.email}</h1>
                <div className="container">
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                        <Col sm={3}>
                        <ListGroup>
                            <ListGroup.Item action href="#link1">
                            User Account
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link2">
                            Invitations
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link3">
                            Applications
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link4">
                            Settings
                            </ListGroup.Item>
                        </ListGroup>
                        </Col>
                        <Col sm={9} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '5px'}}>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link1">
                                <h2 className="centerText" style={{marginBottom: 0}}>{this.state.user.firstName}
                                <span> {this.state.user.lastName}</span></h2>
                                <p style={{color: 'rgb(155,155,155)'}}>
                                    <span>{this.state.user.city}</span>,
                                    <span> {this.state.user.province}</span>, 
                                    <span> {this.state.user.country}</span>
                                </p> <br />
                                <h4><FaBriefcase /> {this.state.user.title}</h4>

                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat harum odit pariatur inventore dolore dicta soluta maxime veritatis voluptates, exercitationem, vel consequatur incidunt dignissimos repudiandae in sint alias officiis ipsum!
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link3">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nemo assumenda cumque, explicabo ex soluta eveniet accusantium corrupti labore! Ea inventore ab ut ullam cupiditate aut voluptates illum vel culpa.
                            </Tab.Pane>
                            <Tab.Pane id="settingsTab" eventKey="#link4">
                                <h2>Password Change</h2>
                                <PasswordChangeForm />
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                </div>
                    <Row style={{marginTop: "50px", marginBottom: "50px"}}>
                        <Col className="container" sm={4} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px'}}>
                            <h3 className="centerText">Education</h3>
                            <div id="education"></div>
                        </Col>
                        <Col className="container" sm={4} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px'}}>
                            <h3 className="centerText">Experience</h3>
                            <div id="experience"></div>
                        </Col>
                        <Col className="container" sm={2} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px'}}>
                            <h3>Account Visibility <br />
                            { this.state.user.incognito === 1 ? (	                        
                                <FaUserSecret />                           
                            ) : <FaUserTie /> }
                            </h3>
                            { this.state.user.incognito === 1 ? (	                        
                                <p id="visibility">Incognito</p>                         
                            ) : <p id="visibility">Visible</p> }
                            {/* <p id="visibility"></p> */}
                            <Form
                                onSubmit={e => this.handleSubmit(e)}>
                            {/* <FormControl style={{display: 'hidden'}} value={this.state.incognito} onChange={this.handleChange} type="checkbox" name="incognito" id='chbincognito' /> */}
                            <Button type="submit" variant="warning">
                                Change
                            </Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            )}
            </AuthUserContext.Consumer>
        )
    }
}

const condition = authUser => !!authUser;

// export default withAuthorization(condition)(UserAccount);
export default compose(withFirebase, withAuthorization(condition))(UserAccount);
