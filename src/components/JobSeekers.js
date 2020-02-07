import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import { IoMdPerson } from "react-icons/io";
import Button from 'react-bootstrap/Button';

class JobSeekers extends Component {

    componentDidMount() {
        this.displayJobSeekers('firstName')
    }

    displayJobSeekers(order) {

        var id = 0;

        var jobSeekersRef = this.props.firebase.database().ref.child('users').orderByChild(order);
        jobSeekersRef.on('value', snap => {
            document.getElementById('jobSeekersList').innerHTML = '';
            snap.forEach(snap1 => {

                id++;

                var div = document.createElement('div');
                div.setAttribute('id', id);
                div.setAttribute('class', 'jobSeeker');
                document.getElementById('jobSeekersList').appendChild(div);

                ReactDOM.render(<JobSeekerObject
                    firstName={snap1.child('firstName').val()}
                    lastName={snap1.child('lastName').val()}
                    title={snap1.child('title').val()}
                    email={snap1.child('email').val()}
                    city={snap1.child('city').val()}
                    province={snap1.child('province').val()}
                    country={snap1.child('country').val()}
                />,
                document.getElementById(id));
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

class JobSeekerObject extends Component {
    render() {
        return (
            <div style={{ display: 'table' }}>
                <div style={{ float: 'left', margin: '0 2em 0 1em' }}>
                    <IoMdPerson size={180} />
                </div>
                <div style={{ float: 'left', maxWidth: '25em', minWidth: '25em', margin: '0 2em', textAlign: 'left' }}>
                    <h4>{this.props.firstName} {this.props.lastName}</h4>
                    <h5>{this.props.title}</h5>
                    <h5>{this.props.email}</h5>
                    <h6>{this.props.city}, {this.props.province}, {this.props.country}</h6>
                </div>
                <div style={{ float: 'left', margin: '0 2em' }}>
                    <Button variant="primary">View Profile</Button> <span />
                    <Button variant="primary">Send Email</Button> <span />
                    <Button variant="primary">Invite</Button> <span />
                    <Button variant="danger">Like</Button>
                </div>
            </div>
        )
    }
}

export default withFirebase(JobSeekers);