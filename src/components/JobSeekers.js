import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
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
            searchParameter: '',
            //   loading indicator for Firebase listener on Redux update ¯\_(ツ)_/¯
            loading: false,
        };
    }

    componentDidMount() {
        // ¯\_(ツ)_/¯
        if (!this.props.users.length) {
            this.setState({ loading: true });
        }

        this.fetchJobSeekersData()
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    displayJobSeekersWithSearchParameter = searchParameterArg => {
        var id = 0;

        let likedUsersData = this.props.likedUsers;
        let usersData = this.props.users;
        let userType = this.props.userType;

        let searchParameter = searchParameterArg.toLowerCase();

        document.getElementById('jobSeekersList').innerHTML = '';

        usersData.forEach(userData => {

            if (userData.email.toLowerCase().indexOf(searchParameter) >= 0 ||
                userData.firstName.toLowerCase().indexOf(searchParameter) >= 0 ||
                userData.lastName.toLowerCase().indexOf(searchParameter) >= 0 ||
                userData.title.toLowerCase().indexOf(searchParameter) >= 0 ||
                userData.city.toLowerCase().indexOf(searchParameter) >= 0) {

                id++;

                var div = document.createElement('div');
                div.setAttribute('id', id);
                div.setAttribute('class', 'jobSeeker');
                if (document.getElementById('jobSeekersList') != null) {
                    document.getElementById('jobSeekersList').appendChild(div);

                    ReactDOM.render(<JobSeekerObject
                        userData={userData}
                        likedUsersData={likedUsersData}
                        userType={userType}
                        authUser={this.props.authUser}
                        firebase={this.props.firebase}
                        pathHistory={this.props.history}
                    />, document.getElementById(id));
                }
            }
        })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });

        this.displayJobSeekersWithSearchParameter(e.target.value);

    };

    fetchJobSeekersData() {

        if (this.props.authUser && this.props.likedUsers.length === 0) {
            this.props.firebase.companyLikes().orderByChild('companyEmail').equalTo(this.props.authUser.email).on('value', snap => {
                this.props.onSetLikedUsers(snap.val());
            })
        }

        if (this.props.users.length === 0) {
            this.props.firebase.users().orderByChild('incognito').equalTo(null).on('value', snap => {
                this.props.onSetUsers(snap.val());
            })
        }

        this.setState({ loading: false });

        if (this.props.location.searchParameter !== undefined) {
            this.setState({ searchParameter: this.props.location.searchParameter });
            this.displayJobSeekersWithSearchParameter(this.props.location.searchParameter);
        }
        else {

            this.displayJobSeekers()
        }
    }

    displayJobSeekers = () => {

        let likedUsersData = this.props.likedUsers;
        let usersData = this.props.users;
        let userType = this.props.userType;

        if (document.getElementById('jobSeekersList') != null) {
            document.getElementById('jobSeekersList').innerHTML = '';
        }

        var id = 0;

        usersData.forEach(userData => {

            id++;

            var div = document.createElement('div');
            div.setAttribute('id', id);
            div.setAttribute('class', 'jobSeeker');
            if (document.getElementById('jobSeekersList') != null) {
                document.getElementById('jobSeekersList').appendChild(div);

                ReactDOM.render(<JobSeekerObject
                    userData={userData}
                    likedUsersData={likedUsersData}
                    userType={userType}
                    authUser={this.props.authUser}
                    firebase={this.props.firebase}
                    pathHistory={this.props.history}
                />, document.getElementById(id));
            }
        })
    }

    componentDidUpdate = (nextProps) => {
        if (this.props !== nextProps) {
            if (this.props.location.searchParameter !== undefined) {
                this.setState({ searchParameter: this.props.location.searchParameter });
                this.displayJobSeekersWithSearchParameter(this.props.location.searchParameter);
            }
            else {
                this.displayJobSeekers()
            }
        }
    }

    render() {
        const { searchParameter } = this.state;

        // can now grab the users from redux here instead of firebase in ComponentDidMount ... maybe ¯\_(ツ)_/¯
        const { loading } = this.state;

        return (
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Job Seekers</h4>
                {loading && <div>Loading ...</div>}
                <Form onSubmit={e => this.handleSubmit(e)} inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                    <div className="input-group-prepend" style={{ backgroundColor: 'none', borderColor: "#FFC107" }}>
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <FormControl value={searchParameter} onChange={this.handleChange} name="searchParameter" type="text" placeholder="Name, Keyword or Title" className="mr-sm-2" style={{ borderColor: "#FFC107" }} />
                    </div>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <FaSearchLocation />
                        </span>
                        <FormControl disabled={true} type="text" placeholder="BC, Canada" className="mr-sm-2" style={{ borderColor: "#FFC107" }} />
                    </div>
                    {/* <Button variant="warning"
                        type="submit"
                        disabled={true}>
                        Search
                    </Button> */}
                </Form>
                <p id='jobSeekersList'></p>
            </div>
        )
    }
}


class JobSeekerObject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLikeDisabled: true,
            likeStatus: 'Like',
        }
    }

    componentDidMount = () => {
        if (this.props.authUser != null) {
            // this.props.firebase.database().ref.child('companies').orderByChild('email').equalTo(this.props.authUser.email).once('value', snap => {
            //     if (snap.exists()) {
            //         this.setState({ isLikeDisabled: false })
            //     }
            // });
            // alert(this.props.userType)

            if (this.props.userType === 'company') {
                this.setState({ isLikeDisabled: false })
            }
            this.props.likedUsersData.forEach(likedUserData => {
                if (likedUserData.companyEmail === this.props.authUser.email &&
                    likedUserData.jobSeekerEmail === this.props.userData.email) {
                    this.setState({ likeStatus: 'Dislike' })
                }
            });
        }
    }

    handleLike = (e) => {

        this.props.authUser != null ? (this.state.likeStatus === 'Like' ? this.addLike() : this.removeLike()) : window.alert("You need to log in to leave a like");

        e.preventDefault();
    }

    addLike = () => {
        if (this.props.authUser) {
            this.props.firebase.database().child('companyLikes').push({
                companyEmail: this.props.authUser.email,
                jobSeekerEmail: this.props.userData.email,
                date: (new Date()).toISOString().split('T')[0],
            })
                .then(this.setState({ likeStatus: 'Dislike' }))
                .catch(error => console.log(error));
        } else {
            window.alert("You need to log in to leave a like")
        }
    }

    removeLike = () => {

        let companyLikesRef = this.props.firebase.database().child('companyLikes').ref;

        companyLikesRef.once('value', snap => {
            snap.forEach(snap1 => {
                if (snap1.child('companyEmail').val() === this.props.authUser.email &&
                    snap1.child('jobSeekerEmail').val() === this.props.userData.email) {
                    companyLikesRef.child(snap1.key).remove()
                        .then(this.setState({ likeStatus: 'Like' }))
                        .catch(error => console.log(error));
                }
            })
        })
    }

    goToProfile = () => {
        this.props.pathHistory.push({
            pathname: `profile/${this.props.userData.userId}`,
            userData: this.props.userData
        })
    }

    render() {

        let userData = this.props.userData;

        let imageStyle = {
            width: '8em',
            height: '8em',
            borderRadius: '10em'
        }

        return (
            <div style={{ display: 'table' }}>
                <div style={{ float: 'left', margin: '0 2em 0 1em' }}>
                    <img style={imageStyle} src={
                        userData.profileImage ?
                            userData.profileImage :
                            'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                        alt=''>
                    </img>
                </div>
                <div style={{ float: 'left', maxWidth: '25em', minWidth: '25em', margin: '0 2em', textAlign: 'left' }}>
                    <h4>{userData.firstName} {userData.lastName}</h4>
                    <h5>{userData.title}</h5>
                    <h5>{userData.email}</h5>
                    <h6>{userData.city}, {userData.province}, {userData.country}</h6>
                </div>
                <div style={{ float: 'left', margin: '0 2em' }}>
                    <Button variant="primary" onClick={this.goToProfile}>View Profile</Button> <span />
                    <Button variant="primary">Send Email</Button> <span />
                    <Button variant="primary">Invite</Button> <span />
                    <Button onClick={e => this.handleLike(e)} variant="danger" disabled={this.state.isLikeDisabled}>{this.state.likeStatus}</Button>
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
    likedUsers: Object.keys(state.likedUsersState.likedUsers || {}).map(key => ({
        ...state.likedUsersState.likedUsers[key],
        uid: key,
    })),
    userType: state.userTypeState.userType,
    authUser: state.sessionState.authUser,
});

const mapDispatchToProps = dispatch => ({
    onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
    onSetLikedUsers: likedUsers => dispatch({ type: 'LIKED_USERS_SET', likedUsers })
});

export default compose(withFirebase, connect(
    mapStateToProps,
    mapDispatchToProps,
))(JobSeekers);