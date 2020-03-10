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

const CreateUser = () => (
    <div>
        <UserForm />
    </div>
)

const initState = {
    firstName: '',
    lastName: '',
    title: '',
    city: '',
    province: 'BC',
    country: 'Canada',
    img: null,
    progress: 0
};

// const allInputs = {imgUrl: ''};
// const [imageAsFile, setImageAsFile] = useState('');
// const [imageAsUrl, setImageAsUrl] = useState(allInputs);

class CreateUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState};
    }
    
    handleSubmit = (e, authUser) => {
        e.preventDefault();

        // this adds a user object with a key and stores uid as userId field inside
        this.props.firebase.users().push({
            userId: authUser.uid,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: authUser.email,
            title: this.state.title,
            city: this.state.city,
            province: this.state.province,
            country: this.state.country,
        })
        .then(() => {
            this.setState({...initState})
        })
        .then(() => {
            this.props.history.push('/education');
        })
        .catch(error => console.log(error));

        // this adds a user object under uid key from auth and nests key inside
        // this.props.firebase.user(authUser.uid).push({
        //     firstName: this.state.firstName,
        //     lastName: this.state.lastName,
        //     email: authUser.email,
        //     title: this.state.title,
        //     city: this.state.city,
        //     province: this.state.province,
        //     country: this.state.country,
        // })
        // .then(() => {
        //     this.props.history.push('/education');
        // })

        // this.setState({
        //     firstName: '',
        //     lastName: '',
        //     title: '',
        //     city: '',
        //     province: '',
        //     country: '',
        // })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleImage = e => {
        // console.log(imageAsFile);
        // const image = e.target.files[0];
        // setImageAsFile(imageFile => (image))
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    }

    handleImageUpload = (e, authUser) => {
        e.preventDefault();

        const { image } = this.state;
        const uploadTask = this.props.firebase.storage.ref(`images/${image.name}`).put(image);
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
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                  this.setState({ url });
                });
            }
          );
    }

    render () {
        const { firstName, lastName, title, city, province, country } = this.state;
        return (
            // to grab the authenticated user info from React.Context hoc (may use Redux instead in the future)
                <div className="rectangle registerect container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h1>Almost done</h1>
                        <Row>
                            <Col sm={6}>
                                <Form
                                    onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                                    style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                                
                                    <FormControl type="text" value={firstName} onChange={this.handleChange} name="firstName" placeholder="First Name"></FormControl>                        
                                    <FormControl type="text" value={lastName} onChange={this.handleChange} name="lastName" placeholder="Last Name"></FormControl>                        
                                    <FormControl type="text" value={title} onChange={this.handleChange} name="title" placeholder="Title"></FormControl>                        
                                    <FormControl type="text" value={city} onChange={this.handleChange} name="city" placeholder="City"></FormControl>                        
                                    <FormControl type="text" value={province} onChange={this.handleChange} name="province" placeholder="Province"></FormControl>                        
                                    <FormControl type="text" value={country} onChange={this.handleChange} name="country" placeholder="Country"></FormControl>                        
                                    <Button type="submit" variant="warning">
                                        Register
                                    </Button>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <ProgressBar animated  now={this.state.progress} />
                                <Form onSubmit={e => this.handleImageUpload(e, this.props.authUser)}>
                                    <FormControl type="file" onChange={this.handleImage} ></FormControl>
                                    <Button type="submit" variant="warning">
                                        Upload a photo
                                    </Button>
                                </Form>
                                <img
                                src={this.state.url || require('../img/logo.png')}
                                alt="Uploaded Image Profile"
                                width="100"
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const UserForm = compose(connect(mapStateToProps), withRouter, withFirebase)(CreateUserForm);
// condtion to check for user authorization
const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreateUser);

export { UserForm };
