import React, { Component } from 'react';
import { withFirebase } from './Firebase';

class JobSeekers extends Component {

    componentDidMount() {

        // Just for sample, needs to be changed in future

        var jobSeekersRef = this.props.firebase.database().ref.child('users');
        jobSeekersRef.on('value', snap => {
            document.getElementById('jobSeekersList').innerHTML = "";
            snap.forEach(snap1 => {
                
                console.log(snap1.val());
            
                var div = document.createElement('div');
                div.setAttribute('class', 'jobSeeker');
                var p = document.createElement('p');                
                p.textContent = snap1.child('email').val() + " from " + snap1.child('city').val();
                div.appendChild(p);         
                document.getElementById('jobSeekersList').appendChild(div);
            });
        })        
    }

    render() {
        return (            
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Job Seekers</h4>
                <p id='jobSeekersList'></p>
            </div>
        )
    }
}

export default withFirebase(JobSeekers);