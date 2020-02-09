import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import { IoMdPerson } from "react-icons/io";
import Button from 'react-bootstrap/Button';

class JobSeekers extends Component {
    constructor(props) {
        super(props);
        this.state = {
          authUser: null,
        };
      }

    componentDidMount() {
        this.displayJobSeekers('firstName')
    }

    
    displayJobSeekers(order) {
        this.props.firebase.auth.onAuthStateChanged(authUser => {
            authUser
              ? this.setState({ authUser })
              : this.setState({ authUser: null });
        })

        var id = 0;

        var jobSeekersRef = this.props.firebase.database().ref.child('users').orderByChild('incognito')
        .equalTo(null);
        jobSeekersRef.on('value', snap => {
            if (document.getElementById('jobSeekersList')!=null) {
                document.getElementById('jobSeekersList').innerHTML = '';
            }
            snap.forEach(snap1 => {

                id++;

                var div = document.createElement('div');
                div.setAttribute('id', id);
                div.setAttribute('class', 'jobSeeker');
                if (document.getElementById('jobSeekersList') != null) {
                    document.getElementById('jobSeekersList').appendChild(div);

                    if (this.state.authUser!=null) {

                        ReactDOM.render(<JobSeekerObject
                            firstName={snap1.child('firstName').val()}
                            lastName={snap1.child('lastName').val()}
                            title={snap1.child('title').val()}
                            email={snap1.child('email').val()}
                            city={snap1.child('city').val()}
                            province={snap1.child('province').val()}
                            country={snap1.child('country').val()}
                            authUser={this.state.authUser.uid}
                            authEmail={this.state.authUser.email}
                            firebase={this.props.firebase}
                            userId={snap1.child('userId').val()}
                        />,
                        document.getElementById(id));
                    } else {
                        ReactDOM.render(<JobSeekerObject
                            firstName={snap1.child('firstName').val()}
                            lastName={snap1.child('lastName').val()}
                            title={snap1.child('title').val()}
                            email={snap1.child('email').val()}
                            city={snap1.child('city').val()}
                            province={snap1.child('province').val()}
                            country={snap1.child('country').val()}
                            authUser={null}
                            authEmail={null}
                            firebase={this.props.firebase}
                            userId={snap1.child('userId').val()}
                        />,
                        document.getElementById(id));
                    }

                // console.log(authUser);
                // console.log(this.state.authUser.uid);
                }
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
    handleLike = (e, userId, authUser, firebase, email) => {
        e.preventDefault();
        if (authUser != null) {
            firebase.like(userId).push({
                accountId: authUser,
                email: email,
                date: (new Date()).toISOString().split('T')[0],
            })
            .then(window.alert("Thank you for the like"))
            .catch(error => console.log(error));
        } else {
            window.alert("You need to log in to leave a like")
        }
    }
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
                    <Button onClick={e => this.handleLike(e, this.props.userId, this.props.authUser, this.props.firebase, this.props.authEmail)} variant="danger">Like</Button>
                </div>
            </div>
        )
    }
}
export default withFirebase(JobSeekers);