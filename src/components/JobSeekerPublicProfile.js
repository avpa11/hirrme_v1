import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import { compose } from 'recompose';
import app from 'firebase/app';
import Video from '../components/Video2';

let greyText = {
    color: '#7B7B7B'
}

let mainDivStyle = {
    margin: 'auto',
    marginTop: '10em',
    width: '90%',
    padding: '2em'
}

let generalInfoDivStyle = {
    margin: 'auto',
    width: '60%',
    minHeight: '35em',
    backgroundColor: 'white',
    borderRadius: '10px',
    marginBottom: '2em',
    position: 'relative'
}

let generalInfoTextDivStyle = {
    padding: '5%',
    paddingTop: '13em'
}

let generalInfoWithIcons = {
    paddingBottom: '1%',
    fontSize: '120%'
}

let generalInfoWithIconsContainer = {
    paddingTop: '2%',
}

let experienceDivStyle = {
    margin: 'auto',
    width: '60%',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2em',
    marginBottom: '2em'
}

let educationDivStyle = {
    margin: 'auto',
    width: '60%',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2em',
}

let profilePictureStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '10em'
}

let imageStyle = {
    width: '10em',
    height: '10em',
    borderRadius: '10em',
    zIndex: '1',
    position: 'absolute',
    top: '10%',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
}

let wantToHireDivStyle = {
    width: '100%',
    position: 'absolute',
    bottom: '8%',
    textAlign: 'center',
    color: 'white'
}

let bannerStyle = {
    width: '100%',
    height: '30%',
    position: 'absolute'
}

let iconStyle = {
    width: '1em',
    marginRight: '1em'
}

let wantToHireButtonStyle = {
    background: 'linear-gradient(90deg, #F3565E 0%, #F97F3A 55.85%, #FFAC11 100.21%)',
    border: '0px',
    color: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    width: '10em'
}

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
        document.getElementById('experienceDiv').innerHTML = '';
        let id = 0;
        app.database().ref('experience').child(this.state.profileUid).on('value', snap => {

            snap.forEach(snap1 => {
                let div = document.createElement('div');
                div.setAttribute('id', 'experience' + ++id);
                if (document.getElementById('experienceDiv') != null) {

                    document.getElementById('experienceDiv').appendChild(div);
                }
                ReactDOM.render(<ExperienceComponent experienceData={snap1.val()} />, document.getElementById('experience' + id));
            })
        })
    }

    getEducation = () => {
        document.getElementById('educationDiv').innerHTML = '';
        let id = 0;
        app.database().ref('educations').child(this.state.profileUid).on('value', snap => {

            snap.forEach(snap1 => {
                this.setState({ education: snap1.child('programName').val() + ', ' + snap1.child('schoolName').val() + ', ' + snap1.child('programType').val() });
                let div = document.createElement('div');
                div.setAttribute('id', 'education' + ++id);
                if (document.getElementById('educationDiv') != null) {
                    document.getElementById('educationDiv').appendChild(div);
                }
                ReactDOM.render(<EducationComponent educationData={snap1.val()} />, document.getElementById('education' + id));
            })
        })
    }

    render() {

        let userData = this.props.location.userData ? this.props.location.userData : this.state.userProfile;

        return (
            <React.Fragment>
                <Video />
                <div style={mainDivStyle}>
                    <div style={generalInfoDivStyle}>
                        <img src={require('../img/publicProfileBanner.png')} alt='publicProfileBanner.png' style={bannerStyle}></img>
                        <div style={profilePictureStyle}>
                            <img style={imageStyle} src={
                                userData.profileImage ?
                                    userData.profileImage :
                                    'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                                alt=''></img>
                        </div>
                        <div style={generalInfoTextDivStyle}>
                            <h3>{userData.firstName} {userData.lastName}</h3>
                            <h6 style={greyText}>{userData.city ? userData.city + ', ' : ''}{userData.province}{userData.country ? ', ' + userData.country : ''}</h6>
                            <div style={generalInfoWithIconsContainer}>
                                <div style={generalInfoWithIcons}>
                                    <img src={require('../img/work.png')} style={iconStyle} alt='work.png' />{userData.title}
                                </div>
                                <div style={generalInfoWithIcons}>
                                    <img src={require('../img/school.png')} style={iconStyle} alt='school.png' />{this.state.education}
                                </div>
                                <div style={generalInfoWithIcons}>
                                    <img src={require('../img/clock.png')} style={iconStyle} alt='clock.png' />Full Time
                            </div>
                            </div>

                        </div>
                        <div style={wantToHireDivStyle}>
                            <Button style={wantToHireButtonStyle} onClick={() => alert('Cool')}>Want to hire</Button>
                        </div>
                    </div>

                    <div style={experienceDivStyle}>
                        <div style={{ marginBottom: '2em' }} className='text-center'>
                            <h2>Previous Experience</h2>
                        </div>
                        <div id='experienceDiv'>
                            <div className='text-center'>No experience ... yet</div>
                        </div>
                    </div>

                    <div style={educationDivStyle}>
                        <div style={{ marginBottom: '2em' }} className='text-center'>
                            <h2>Previous Education</h2>
                        </div>
                        <div id='educationDiv'>
                            <div className='text-center'>No education ... yet</div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

let imageContainerStyle = {
    float: 'left',
    width: '8em'
}

let textContainerStyle = {
    textAlign: 'left',
    display: 'flex'
}

let itemImageStyle = {
    width: '6em',
    height: '6em'
}

let itemsMarginsStyle = {
    marginTop: '2em',
    marginBottom: '2em'
}

function ExperienceComponent(props) {

    let experience = props.experienceData;

    return (

        <div style={itemsMarginsStyle}>
            <div style={imageContainerStyle}>
                <img style={itemImageStyle} src={require('../img/question.png')} alt='question.png' />
            </div>
            <div style={textContainerStyle}>

                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1em' }}>
                        <h4>{experience.position}</h4>
                        <h6>{experience.company}</h6>
                        <h6 style={greyText}>{experience.startDate}{experience.endDate ? ' - ' + experience.endDate : ''}</h6>
                        <h6 style={greyText}>{experience.location}</h6>
                    </div>

                    <p>{experience.description ? experience.description  : ''}</p>

                </div>
            </div>
            <hr />
        </div>
    )
}

function EducationComponent(props) {

    let education = props.educationData;

    return (

        <div style={itemsMarginsStyle}>
            <div style={imageContainerStyle}>
                <img style={itemImageStyle} src={require('../img/question.png')} alt='question.png' />
            </div>
            <div style={textContainerStyle}>

                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1em' }}>
                        <h4>{education.programName}{education.programType ? ', ' + education.programType : ''}</h4>
                        <h6>{education.schoolName}</h6>
                        <h6 style={greyText}>{education.startDate}{education.endDate ? ' - ' + education.endDate : ''}</h6>
                        <h6 style={greyText}>{education.location}</h6>
                    </div>

                    <p>{education.description ? education.description  : ''}</p>

                </div>
            </div>
            <hr />
        </div>
    )
}

export default compose(withFirebase)(JobSeekerPublicProfile);

