import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import { compose } from 'recompose';

class JobSeekerPublicProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            education: null
        }
    }

    componentDidMount = () => {
        this.getExperience();
        this.getEducation();
    }

    getUserAvatar = () => {
        this.props.firebase.storage.ref(this.props.location.userData.profileImage)

    }

    getExperience = () => {
        let id = 0;
        this.props.firebase.experience(this.props.location.userData.userId).once('value', snap => {
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
        this.props.firebase.education(this.props.location.userData.userId).once('value', snap => {
            snap.forEach(snap1 => {
                this.setState({education: snap1.child('programName').val() + ', ' + snap1.child('schoolName').val() + ', ' + snap1.child('programType').val()})
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

        return (

            <div style={mainDivStyle}>
                <div style={generalInfoDivStyle}>
                    <div className='text-center'>
                        <img style={imageStyle} src={
                            this.props.location.userData.profileImage ?
                                this.props.location.userData.profileImage :
                                'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                                alt=''></img>
                    </div>
                    <div>
                        <h3>John Smith</h3>
                        <h6>{this.props.location.userData.title}</h6>
                        <h6>{this.state.education}</h6>
                        <h6>Vancouver, Canada</h6>
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
                <hr/> 
            </div>
        )
    }
}

export default compose(withFirebase)(JobSeekerPublicProfile);