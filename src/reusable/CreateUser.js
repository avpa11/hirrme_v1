import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { withAuthorization } from '../components/Session';
import { withFirebase } from '../components/Firebase';
import { withRouter } from 'react-router-dom';
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
    description: '',
};

class CreateUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.location.pathname === '/useraccount' ? this.props.user.firstName : '',
            lastName: this.props.location.pathname === '/useraccount' ? this.props.user.lastName : '',
            title: this.props.location.pathname === '/useraccount' ? this.props.user.title : '',
            city: this.props.location.pathname === '/useraccount' ? this.props.user.city : '',
            province: 'BC',
            country: 'Canada',
            description: this.props.location.description === '/useraccount' ? this.props.user.description : '',
        };
    }

    handleSubmit = (e, authUser) => {
        e.preventDefault();

        if (this.props.user !== null && this.props.user !== undefined) {

            this.props.firebase.users().ref.child(this.props.userKey[0]).set({
                userId: authUser.uid,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: authUser.email,
                title: this.state.title,
                city: this.state.city,
                province: this.state.province,
                country: this.state.country,
                description: this.state.description,
                profileImage: (this.props.user!== null && this.props.user!== undefined) ? this.props.user.profileImage : null
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
                description: this.state.description
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
        const { firstName, lastName, title, city, province, country, description } = this.state;
        // console.log(this.props.user);
        // {console.log(this.props.location.pathname)}
        return (
            <Form
                onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                style={{ justifyContent: 'center', marginTop: "40px", marginBottom: "20px",  width: '100%' }}>

            {this.props.location.pathname === '/useraccount' ?
                <React.Fragment>
                    <Row style={{marginLeft: '30px', marginRight: '30px'}}>
                        <Col sm={5}>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>First Name<span style={{color: '#dc3545'}}>*</span></Form.Label>
                            <FormControl type="text" value={firstName} onChange={this.handleChange} name="firstName" placeholder=""></FormControl>      
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Last Name<span style={{color: '#dc3545'}}>*</span></Form.Label>                       
                            <FormControl type="text" value={lastName} onChange={this.handleChange} name="lastName" placeholder=""></FormControl>    
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Title<span style={{color: '#dc3545'}}>*</span></Form.Label>                      
                            <FormControl type="text" value={title} onChange={this.handleChange} name="title" placeholder=""></FormControl>    
                        </Col>
                        <Col sm={5}>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>City<span style={{color: '#dc3545'}}>*</span></Form.Label>                   
                            <FormControl type="text" value={city} onChange={this.handleChange} name="city" placeholder=""></FormControl>     
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Province<span style={{color: '#dc3545'}}></span></Form.Label>                 
                            <FormControl type="text" value={province} onChange={this.handleChange} name="province" placeholder="" disabled></FormControl>                      
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Country<span style={{color: '#dc3545'}}></span></Form.Label>                 
                            <FormControl type="text" value={country} onChange={this.handleChange} name="country" placeholder="" disabled></FormControl>
                        </Col>
                        <Col sm={2}>
                            <div className="center" style={{paddingTop: "30%"}}>
                                <Button type="submit" variant="warning">
                                        {(this.props.user!== null && this.props.user!== undefined) ? 
                                            'Change'
                                            :
                                            'Next'
                                        } 
                                </Button>
                            </div>
                        </Col>
                    </Row> 
                    <Row style={{marginLeft: '30px', marginRight: '30px', marginTop: '20px'}}>
                        <Col sm={12}>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Description<span style={{color: '#dc3545'}}>*</span></Form.Label>  
                            <textarea rows="4" style={{width: '100%'}} value={description} onChange={this.handleChange} name="description" placeholder=""></textarea>                    
                        </Col>
                    </Row>
                </React.Fragment>:
                <React.Fragment>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>First Name<span style={{color: '#dc3545'}}>*</span></Form.Label>
                    <FormControl type="text" value={firstName} onChange={this.handleChange} name="firstName" placeholder=""></FormControl> 
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Last Name<span style={{color: '#dc3545'}}>*</span></Form.Label>                       
                    <FormControl type="text" value={lastName} onChange={this.handleChange} name="lastName" placeholder=""></FormControl>  
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Title<span style={{color: '#dc3545'}}>*</span></Form.Label>                      
                    <FormControl type="text" value={title} onChange={this.handleChange} name="title" placeholder=""></FormControl>     
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>City<span style={{color: '#dc3545'}}>*</span></Form.Label>                   
                    <FormControl type="text" value={city} onChange={this.handleChange} name="city" placeholder=""></FormControl>       
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Province<span style={{color: '#dc3545'}}></span></Form.Label>                 
                    <FormControl type="text" value={province} onChange={this.handleChange} name="province" placeholder="" disabled></FormControl>       
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Country<span style={{color: '#dc3545'}}></span></Form.Label>                 
                    <FormControl type="text" value={country} onChange={this.handleChange} name="country" placeholder="" disabled></FormControl>  
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Description<span style={{color: '#dc3545'}}>*</span></Form.Label>  
                    <textarea rows="4" style={{width: '100%'}} value={description} onChange={this.handleChange} name="description" placeholder=""></textarea>                    
                    <Button type="submit" variant="warning">
                        {(this.props.user!== null && this.props.user!== undefined) ? 
                            'Change'
                            :
                            'Next'
                        } 
                    </Button>
                </React.Fragment>
            }
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

const UserForm = compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase)(CreateUserForm);
const condition = authUser => !!authUser;

export default  withAuthorization(condition)(CreateUser);

export { UserForm };
