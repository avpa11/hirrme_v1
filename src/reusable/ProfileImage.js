import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar'

import { withAuthorization } from '../components/Session';

import { withFirebase } from '../components/Firebase';
// import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

const ChangeProfileImage = () => (
    <ProfileImage />
)

const initState = {
    img: null,
    progress: 0,
    key: null,
    profileImage: null
};

class CreateProfileImage extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState};
    }

    handleImage = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    }

    handleImageUpload = (e, authUser) => {
        e.preventDefault();

        const { image } = this.state;
        const imageName = 'ProfileImage.'+authUser.uid;
        const uploadTask = this.props.firebase.storage.ref(`${authUser.uid}/${imageName}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
              // progress function ...
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              this.setState({ progress });
            },
            error => {
              // Error function ...
              console.log(error);
            },
            () => {
              // complete function ...
              this.props.firebase.storage
                .ref(authUser.uid)
                .child(imageName)
                .getDownloadURL()
                .then(url => {
                    this.setState({ url });
                    
                    this.props.firebase.user(this.props.userKey).update({
                      profileImage: this.state.url
                  })
                })
            },

          )

    }

    render () {
        return(
            <React.Fragment>
                 {
                    (this.props.user!== null && this.props.user!== undefined) ? 
                        this.state.progress !== 100 ? (
                            <ProgressBar animated striped variant="warning" label={`${this.state.progress}%`} now={this.state.progress} />
                        ) :
                        <ProgressBar variant="success" label={`${this.state.progress}%`} now={this.state.progress} />
                        :
                        null
                    }

                    { (this.props.user!== null && this.props.user!== undefined) ? 
                    
                        <Form onSubmit={e => this.handleImageUpload(e, this.props.authUser)}>
                            <FormControl type="file" onChange={this.handleImage} ></FormControl>
                            <img
                            src={this.state.url ||  this.props.user.profileImage || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                            alt="Uploaded Profile"
                            width="100"
                            /><br />
                            {this.state.progress !== 100 ? (
                            <Button disabled={this.props.user == null} type="submit" variant="warning">
                                Upload a photo
                            </Button>
                            ) : <Button disabled={this.props.user == null} type="submit" variant="warning">
                                Change the photo
                                </Button>}
                        </Form>
                        : null
                    }
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    authUser: state.sessionState.authUser,
    user: (state.userState.user || {})[Object.keys(state.userState.user  || {})],
    userKey: Object.keys(state.userState.user || {})
});

const ProfileImage = compose(connect(mapStateToProps), withFirebase)(CreateProfileImage);
const condition = authUser => !!authUser;

export default  withAuthorization(condition)(ChangeProfileImage);

export { ProfileImage };