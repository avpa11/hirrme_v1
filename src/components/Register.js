import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import * as firebase from 'firebase';

// Redux stuff
import { useSelector, useDispatch } from 'react-redux';
import { setEmail } from '../actions'

const Register = () => {

    // Get user email from redux
    // unused 
    var userEmail = useSelector(state => state.userEmail);

    const dispatch = useDispatch();

    // const handleChange = (e) => {
    //     const tempName = e.target.name;
    //     const tempValue = e.target.value;

    //     this.setState({ [tempName]: tempValue }, () => {
    //         if (this.state.password !== this.state.passwordrepeat) {
    //             this.setState({errorMessage: 'Passwords don\'t match'})
    //         } else {
    //             this.setState({errorMessage: null});
    //         }
    //     });
    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        var errorMessage = "";

        var email = document.getElementById('userRegistrationEmail').value;
        var password = document.getElementById('userRegistrationPassword').value;
                
        firebase.auth().createUserWithEmailAndPassword(email, password)        
        .catch((error) => {
            alert(error);
            errorMessage = error.Message
        })
        .then(() => {
            if(errorMessage === ""){
                dispatch(setEmail(email))
            }
        })
    }
    
    return (
        <div className="rectangle registerect container" style={{ marginTop: "120px" }}>
            <div className="container">
                <h1>Help us get you work/ers</h1>
                <Form
                    onSubmit={handleSubmit}
                    style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>

                    <FormControl type="text" placeholder="Email" name="email" className="mr-sm-2 col-sm-6 col-xs-12" id='userRegistrationEmail' />
                    <FormControl type="password" placeholder="Password" name="password" className="mr-sm-2 col-sm-6 col-xs-12" id='userRegistrationPassword' />
                    <FormControl type="password" placeholder="Repeat Password" name="passwordrepeat" className="mr-sm-2 col-sm-6 col-xs-12" id='userRegistrationPasswordRepeat' />

                    <Button type="submit" variant="warning">
                        Register
                        </Button>
                </Form>
            </div>
        </div>
    )
}

export default Register;