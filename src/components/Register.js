import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import * as firebase from 'firebase';


class Register extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            passwordrepeat: '',
            errorMessage: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const tempName = e.target.name;
        const tempValue = e.target.value;

        this.setState({ [tempName]: tempValue }, () => {
            if (this.state.password !== this.state.passwordrepeat) {
                this.setState({errorMessage: 'Passwords don\'t match'})
            } else {
                this.setState({errorMessage: null});
            }
        });
    }

    handleSubmit(e) {
        var regInfo = {
            email: this.state.email,
            password: this.state.password
        }
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(
            regInfo.email,
            regInfo.password
        ).catch(error => {
            if (error.message != null) {
                this.setState({errorMessage: error.message});
            } else {
                this.setState({errorMessage: null});
            }
        });
    }

    render() {
        return (
            <div className="rectangle registerect container" style={{marginTop: "120px"}}>
                <div className="container">
                    <h1>Help us get you work/ers</h1>
                    <Form onSubmit={this.handleSubmit} style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                        { this.state.errorMessage !== null ? (
                            <Alert variant="warning">
                                {this.state.errorMessage}
                            </Alert>
                        ) : null }
                        <FormControl value={this.state.email} onChange={this.handleChange} type="text" placeholder="Email" name="email" className="mr-sm-2 col-sm-6 col-xs-12" />
                        <FormControl value={this.state.password} onChange={this.handleChange} type="password" placeholder="Password" name="password" className="mr-sm-2 col-sm-6 col-xs-12" />
                        <FormControl value={this.state.passwordrepeat} onChange={this.handleChange} type="password" placeholder="Repeat Password" name="passwordrepeat" className="mr-sm-2 col-sm-6 col-xs-12" />
        
                        <Button type="submit" variant="warning">
                            Register
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Register;