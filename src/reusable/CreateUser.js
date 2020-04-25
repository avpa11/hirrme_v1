import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { withAuthorization } from '../components/Session';

import { withFirebase } from '../components/Firebase';
// import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

const CreateUser = () => (
    <UserForm />
)

const initState = {
    firstName: '',
    lastName: '',
    title: '',
    city: '',
    province: 'BC',
    country: 'Canada',
};

class CreateUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState};
    }
    
    handleSubmit = (e, authUser) => {
        e.preventDefault();

        if (this.props.user !== null) {
            // this.props.firebase.users().ref.child(this.props.userKey[0]).remove();
            // // Redux
            // this.props.onDeleteUser(
            //     null,
            //     null,
            // );

            this.props.firebase.users().ref.child(this.props.userKey[0]).set({
                userId: authUser.uid,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: authUser.email,
                title: this.state.title,
                city: this.state.city,
                province: this.state.province,
                country: this.state.country,
                profileImage: this.props.user.profileImage
            })
            .then(() => {
                this.setState({...initState})
            })
            .then(() => {
                this.props.onDeleteUser(
                    null,
                    null,
                );
            })
            .then(() => {
                // this.props.history.push('/education');
                let jobSeekersRef = this.props.firebase.users().orderByChild('userId')
                    .equalTo(this.props.authUser.uid)
                    jobSeekersRef.on('value', snapshot => {
                        snapshot.forEach(snap1 => {
                            // Redux
                            this.props.onSetUser(
                                snap1.val(),
                                // user object key
                                Object.keys(snapshot.val())[0],
                            );
                        });
                })
            })
            .catch(error => console.log(error));

        } else {
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
                // this.props.history.push('/education');
                let jobSeekersRef = this.props.firebase.users().orderByChild('userId')
                    .equalTo(this.props.authUser.uid)
                    jobSeekersRef.on('value', snapshot => {
                        snapshot.forEach(snap1 => {
                            // Redux
                            this.props.onSetUser(
                                snap1.val(),
                                // user object key
                                Object.keys(snapshot.val())[0],
                            );
                        });
                })
            })
            .catch(error => console.log(error));
        }

    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render () {
        const { firstName, lastName, title, city, province, country } = this.state;
        // console.log(this.props.user);
        return (
            <Form
                onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                style={{ justifyContent: 'center', marginTop: "40px", marginBottom: "20px" }}>
            
                <FormControl type="text" value={firstName} onChange={this.handleChange} name="firstName" placeholder="First Name"></FormControl>                        
                <FormControl type="text" value={lastName} onChange={this.handleChange} name="lastName" placeholder="Last Name"></FormControl>                        
                <FormControl type="text" value={title} onChange={this.handleChange} name="title" placeholder="Title"></FormControl>                        
                <FormControl type="text" value={city} onChange={this.handleChange} name="city" placeholder="City"></FormControl>                        
                <FormControl type="text" value={province} onChange={this.handleChange} name="province" placeholder="Province"></FormControl>                        
                <FormControl type="text" value={country} onChange={this.handleChange} name="country" placeholder="Country"></FormControl>                        
                <Button type="submit" variant="warning">
                    {(this.props.user!== null && this.props.user!== undefined) ? 
                        'Change'
                        :
                        'Next'
                    } 
                </Button>
            </Form>
        )
    }

}

const mapStateToProps = (state, props) => ({
    authUser: state.sessionState.authUser,
    user: (state.userState.user || {})[Object.keys(state.userState.user  || {})],
    userKey: Object.keys(state.userState.user || {})
});

const mapDispatchToProps = dispatch => ({
    onSetUser: (user, key) => dispatch({ type: 'USER_SET', user, key }),
    onDeleteUser: (user, key) => dispatch({ type: 'USER_DELETE', user, key }),
  });

const UserForm = compose(connect(mapStateToProps, mapDispatchToProps), withFirebase)(CreateUserForm);
const condition = authUser => !!authUser;

export default  withAuthorization(condition)(CreateUser);

export { UserForm };
