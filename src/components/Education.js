import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { AuthUserContext, withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const Education = () => (
    <div>
        <EducationForm />
    </div>
)

const initState = {
    schoolName: '',
    programType: '',
    programName: '',
    startDate: '',
    endDate: '',
    location: '',
    successMessage: null
};

class CreateEducationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState}
    }

    
    handleSubmit = (e, authUser) => {
        e.preventDefault();

        // this adds an education object under uid
        this.props.firebase.education(authUser.uid).push({
            // theoretically can set " this.setState({...initState}) " instead of writing each prop
            schoolName: this.state.schoolName,
            programType: this.state.programType,
            programName: this.state.programName,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            location: this.state.location,
        })
        .then(() => {
            // to display an Alert with success message, not proprely wotking yet
            this.setState({successMessage: "One record has been added"});
            // for now just reloads the same component
            this.props.history.push('/education');
        })
        .then(() => {
            this.setState({...initState})
        })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render () {
        const { schoolName, programType, programName, startDate, endDate, location, successMessage } = this.state;
        return (
            // to grab the authenticated user info from React.Context hoc (may use Redux instead in the future)
            <AuthUserContext.Consumer>
            {authUser => (
                <div className="rectangle registerect container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h1>Almost done</h1>
                        <Form
                            onSubmit={e => this.handleSubmit(e, authUser)}
                            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                            { successMessage !== null ? (	                        
                                <Alert variant="warning">	                            
                                    {successMessage}	                                
                                </Alert>	                           
                            ) : null }
                            <FormControl type="text" value={schoolName} onChange={this.handleChange} name="schoolName" placeholder="School Name"></FormControl>                        
                            <FormControl type="text" value={programType} onChange={this.handleChange} name="programType" placeholder="Program Type"></FormControl>                        
                            <FormControl type="text" value={programName} onChange={this.handleChange} name="programName" placeholder="Program Name"></FormControl>                        
                            <FormControl type="text" value={startDate} onChange={this.handleChange} name="startDate" placeholder="Start Date"></FormControl>                        
                            <FormControl type="text" value={endDate} onChange={this.handleChange} name="endDate" placeholder="End Date"></FormControl>                        
                            <FormControl type="text" value={location} onChange={this.handleChange} name="location" placeholder="Location"></FormControl>                        
                            <Button type="submit" variant="warning">
                                Register
                            </Button>
                        </Form>
                    </div>
                </div>
            )}
            </AuthUserContext.Consumer>
        )
    }

}

const EducationForm = compose(withRouter, withFirebase)(CreateEducationForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Education);

export { EducationForm };
