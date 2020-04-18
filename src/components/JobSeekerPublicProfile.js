import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import { compose } from 'recompose';
import app from 'firebase/app';

class JobSeekerPublicProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileUid: window.location.href.substr(window.location.href.length - 28),
            education: null,
            userProfile: {
                firstName: '',
                lastName: '',
                email: '',
                title: '',
                country: '',
                province: '',
                city: '',
                profileImage: ''
            }
        }
    }

    componentDidMount = () => {
        this.getProfileData();
        this.getExperience();
        this.getEducation()
    }

    getProfileData = () => {
        if (!this.props.location.userData) {
            app.database().ref('users').orderByChild('userId').equalTo(this.state.profileUid).once('value', snap1 => {
                snap1.forEach(snap => {
                    if (snap.child('userId').val() === this.state.profileUid) {
                        this.setState({
                            userProfile: {
                                firstName: snap.child('firstName').val(),
                                lastName: snap.child('lastName').val(),
                                email: snap.child('email').val(),
                                title: snap.child('title').val(),
                                country: snap.child('country').val(),
                                province: snap.child('province').val(),
                                city: snap.child('city').val(),
                                profileImage: snap.child('profileImage').val()
                            }
                        })
                    }
                });
            });
        }
    }

    getExperience = () => {
        let id = 0;
        app.database().ref('experience').child(this.state.profileUid).once('value', snap => {
            snap.forEach(snap1 => {
                let div = document.createElement('div');
                div.setAttribute('id', ++id);
                if (document.getElementById('experienceDiv') != null) {
                    document.getElementById('experienceDiv').innerHTML = '';
                    document.getElementById('experienceDiv').appendChild(div);
                }
                ReactDOM.render(<ExperienceComponent experienceData={snap1.val()} />, document.getElementById(id));
            })
        })
    }

    getEducation = () => {
        app.database().ref('educations').child(this.state.profileUid).once('value', snap => {
            snap.forEach(snap1 => {
                this.setState({ education: snap1.child('programName').val() + ', ' + snap1.child('schoolName').val() + ', ' + snap1.child('programType').val() })
            })
        })
    }

    render() {

        let mainDivStyle = {
            marginTop: '5em',
            padding: '2em'
        }

        let generalInfoDivStyle = {
            margin: 'auto',
            width: '60%',
            minHeight: '25em',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2em',
            marginBottom: '2em',
            position: 'relative'
        }

        let experienceDivStyle = {
            margin: 'auto',
            width: '60%',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2em',
        }

        let imageStyle = {
            width: '8em',
            height: '8em',
            borderRadius: '10em'
        }

        let buttonStyle = {
            position: 'absolute',
            bottom: '2em',
            margin: 'auto'
        }

        let userData = this.props.location.userData ? this.props.location.userData : this.state.userProfile;

        return (
            <div style={mainDivStyle}>
                <div style={generalInfoDivStyle}>
                    <div className='text-center'>
                        <img style={imageStyle} src={
                            userData.profileImage ?
                                userData.profileImage :
                                'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                            alt=''></img>
                    </div>
                    <div>
                        <h3>{userData.firstName} {userData.lastName}</h3>
                        <h6>{userData.email}</h6>
                        <h6>{userData.title}</h6>
                        <h6>{this.state.education}</h6>
                        <h6>{userData.city} {userData.province} {userData.country}</h6>
                        <div style={buttonStyle}>
                            <Button onClick={() => alert('Cool')}>Want to hire</Button>
                        </div>
                    </div>

                </div>
                <div style={experienceDivStyle}>
                    <div className='text-center'>
                        <h2>Previous Experience</h2>
                    </div>
                    <div id='experienceDiv'>
                        <div className='text-center'>No experience ... yet</div>
                    </div>
                </div>
            </div>
        )
    }
}

class ExperienceComponent extends Component {
    render() {
        let experience = this.props.experienceData;

        return (

            <div>
                <p>{experience.position}</p>
                <p>{experience.company}</p>
                <p>{experience.location}</p>
                <p>{experience.startDate} - {experience.endDate}</p>
                <hr />
            </div>
        )
    }
}

export default compose(withFirebase)(JobSeekerPublicProfile);

