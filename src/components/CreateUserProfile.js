import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar'

import { withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

import UserProfileForm from './CreateUser';

const initState = {
    img: null,
    progress: 0
};


class CreateUserForm extends Component {
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

    redirect = e => {
        this.props.history.push('/education');
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
                })
            },

          )
    }

    render () {
        return (
            // to grab the authenticated user info from React.Context hoc (may use Redux instead in the future)
                <div className="rectangle registerect container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h2 className="center">Almost done!</h2>
                        <Row>
                            <Col sm={6}>
                                <UserProfileForm></UserProfileForm>
                            </Col>
                            <Col sm={6}>
                            {
                                this.state.progress !== 100 ? (
                                    <ProgressBar animated  now={this.state.progress} />
                                ) :
                                <h4>Done</h4>
                            }
                                <Form onSubmit={e => this.handleImageUpload(e, this.props.authUser)}>
                                    <FormControl type="file" onChange={this.handleImage} ></FormControl>
                                    <Button type="submit" variant="warning">
                                        Upload a photo
                                    </Button>
                                </Form>
                                <img
                                src={this.state.url || require('../img/logo.png')}
                                alt="Uploaded Profile"
                                width="100"
                                />
                            </Col>
                        </Row>
                        <Button type="button" variant="warning" onClick={this.redirect}>Next</Button>
                    </div>
                </div>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

  const mapDispatchToProps = dispatch => ({
      onSetProfileFiles: profileFiles => dispatch({ type: 'FILES_SET', profileFiles })
  })

// const UserForm = compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase)(CreateUserForm);
// condtion to check for user authorization
const condition = authUser => !!authUser;

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase, withAuthorization(condition))(CreateUserForm);

// export { UserForm };
