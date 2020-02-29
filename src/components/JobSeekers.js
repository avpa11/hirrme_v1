import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import { IoMdPerson } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

// ¯\_(ツ)_/¯
import { connect } from 'react-redux';
import { compose } from 'recompose';

class JobSeekers extends Component {
    constructor(props) {
        super(props);
        this.state = {
          authUser: null,
          searchPosition: '',
        //   loading indicator for Firebase listener on Redux update ¯\_(ツ)_/¯
          loading: false,
        };
      }

    componentDidMount() {
        // ¯\_(ツ)_/¯
        if (!this.props.users.length) {
            this.setState({ loading: true });
        }

        this.displayJobSeekers('firstName')
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
      }

    handleSubmit = (e) => {
        e.preventDefault();
        var id = 0;

        // FIREBASE SEARCH IS TOO BASIC ONLY FOR ONE "WHERE" CLAUSE AND CASE-SENSITIVE
        // var jseekerByTitle = this.props.firebase.database().ref.child('users').orderByChild('title')
        // .startAt(this.state.searchPosition).endAt(this.state.searchPosition+"\uf8ff");

        var jseekerByTitle = this.props.firebase.database().ref.child('users').orderByChild('incognito')
        .equalTo(null);


        jseekerByTitle.on('value', snap => {
            if (document.getElementById('jobSeekersList')!=null) {
                document.getElementById('jobSeekersList').innerHTML = '';
            }
            snap.forEach(snap1 => {
                id++;

                if (snap1.child('title').val().toLowerCase().indexOf(this.state.searchPosition) >= 0 ||
                snap1.child('firstName').val().toLowerCase().indexOf(this.state.searchPosition) >= 0 || 
                snap1.child('lastName').val().toLowerCase().indexOf(this.state.searchPosition) >= 0) {
                var div = document.createElement('div');
                div.setAttribute('id', id);
                div.setAttribute('class', 'jobSeeker');
                if (document.getElementById('jobSeekersList') != null) {
                    document.getElementById('jobSeekersList').appendChild(div);

                        ReactDOM.render(<JobSeekerObject
                            firstName={snap1.child('firstName').val()}
                            lastName={snap1.child('lastName').val()}
                            title={snap1.child('title').val()}
                            email={snap1.child('email').val()}
                            city={snap1.child('city').val()}
                            province={snap1.child('province').val()}
                            country={snap1.child('country').val()}
                            authUser={this.state.authUser != null ? this.state.authUser.uid : null}
                            authEmail={this.state.authUser != null ? this.state.authUser.email : null}
                            firebase={this.props.firebase}
                            userId={snap1.child('userId').val()}
                        />,
                        document.getElementById(id));

                // console.log(authUser);
                // console.log(this.state.authUser.uid);
                }
            }
            });
        })


    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    
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
            // store the users in redux after fetching them ¯\_(ツ)_/¯
            this.props.onSetUsers(snap.val());
            // ¯\_(ツ)_/¯
            this.setState({ loading: false });

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

                        ReactDOM.render(<JobSeekerObject
                            firstName={snap1.child('firstName').val()}
                            lastName={snap1.child('lastName').val()}
                            title={snap1.child('title').val()}
                            email={snap1.child('email').val()}
                            city={snap1.child('city').val()}
                            province={snap1.child('province').val()}
                            country={snap1.child('country').val()}
                            authUser={this.state.authUser != null ? this.state.authUser.uid : null}
                            authEmail={this.state.authUser != null ? this.state.authUser.email : null}
                            firebase={this.props.firebase}
                            userId={snap1.child('userId').val()}
                        />,
                        document.getElementById(id));
                    }
            });
        })
    }

    render() {
        const { searchPosition } = this.state;

        // can now grab the users from redux here instead of firebase in ComponentDidMount ... maybe ¯\_(ツ)_/¯
        const { users } = this.props;
        const { loading } = this.state;
        // console.log(users);

        return (
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Job Seekers</h4>
                {loading && <div>Loading ...</div>}
                <Form onSubmit={e => this.handleSubmit(e)} inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                <div className="input-group-prepend" style={{backgroundColor: 'none',borderColor: "#FFC107"}}>
                    <span className="input-group-text">
                        <FaSearch />
                    </span>
                    <FormControl value={searchPosition} onChange={this.handleChange} name="searchPosition" type="text" placeholder="Name, Keyword or Title" className="mr-sm-2" style={{borderColor: "#FFC107" }} />
                </div>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <FaSearchLocation />                   
                    </span>
                    <FormControl disabled={true} type="text" placeholder="BC, Canada" className="mr-sm-2" style={{borderColor: "#FFC107" }} />
                </div>
                    <Button variant="warning"
                         type="submit">
                        Search
                    </Button>
                </Form>
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

// ¯\_(ツ)_/¯
const mapStateToProps = state => ({
    users: Object.keys(state.usersState.users || {}).map(key => ({
      ...state.usersState.users[key],
      uid: key,
    })),
});

const mapDispatchToProps = dispatch => ({
    onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

export default compose(withFirebase,connect(
    mapStateToProps,
    mapDispatchToProps,
  ))(JobSeekers);