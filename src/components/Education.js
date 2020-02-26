import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const Education = () => (
    <div>
        <EducationForm />
    </div>
)

// const initState = {
//     schoolName: '',
//     programType: '',
//     programName: '',
//     startDate: '',
//     endDate: '',
//     location: '',
//     successMessage: null
// };

class CreateEducationForm extends Component {
    constructor(props) {
        super(props);
        // this.state = {...initState}
        this.state = {
            educations: [{
                schoolName: '',
                programType: '',
                programName: '',
                startDate: '',
                endDate: '',
                location: '',
            }]
        }
    }

    handleSubmit = (event, authUser) => {
        // alert('A name was submitted: ' + JSON.stringify(this.state.educations));
        event.preventDefault();

        this.state.educations.map((item, key)=> (
            this.props.firebase.education(authUser.uid).push({
                schoolName: item.schoolName,
                programType: item.programType,
                programName: item.programName,
                startDate: item.startDate,
                endDate: item.endDate,
                location: item.location,
            })
        ))

        this.props.history.push('/experience');

    }

    
    // handleSubmit = (e, authUser) => {
    //     e.preventDefault();

    //     // this adds an education object under uid
    //     this.props.firebase.education(authUser.uid).push({
    //         // theoretically can set " this.setState({...initState}) " instead of writing each prop
    //         schoolName: this.state.schoolName,
    //         programType: this.state.programType,
    //         programName: this.state.programName,
    //         startDate: this.state.startDate,
    //         endDate: this.state.endDate,
    //         location: this.state.location,
    //     })
    //     .then(() => {
    //         // to display an Alert with success message, not proprely wotking yet
    //         this.setState({successMessage: "One record has been added"});
    //         // for now just reloads the same component
    //         this.props.history.push('/education');
    //     })
    //     .then(() => {
    //         this.setState({...initState})
    //     })
    // }

    // handleChange = e => {
    //     this.setState({ [e.target.name]: e.target.value });
    // };
    handleChange(i,e) {
        const { name, value } = e.target;
        let educations = [...this.state.educations];
        educations[i] = {...educations[i], [name]:value};
        this.setState({educations});
    };

    addClick() {
        this.setState(prevState => ({
            educations: [...prevState.educations, {schoolName: '',
            programType: '',
            programName: '',
            startDate: '',
            endDate: '',
            location: ''}]
        }))
    }

    removeClick(i){
        let educations = [...this.state.educations];
        educations.splice(i, 1);
        this.setState({ educations });
     }

    createUI() {
        return this.state.educations.map((el, i) => (
            <div key={i} style={{ marginBottom: '20px'}}>
                <FormControl type="text" value={el.schoolName} onChange={this.handleChange.bind(this, i)} name="schoolName" placeholder="School Name"></FormControl>                        
                <FormControl type="text" value={el.programType} onChange={this.handleChange.bind(this, i)} name="programType" placeholder="Program Type"></FormControl>                        
                <FormControl type="text" value={el.programName} onChange={this.handleChange.bind(this, i)} name="programName" placeholder="Program Name"></FormControl>                        
                <FormControl type="text" value={el.startDate} onChange={this.handleChange.bind(this, i)} name="startDate" placeholder="Start Date"></FormControl>                        
                <FormControl type="text" value={el.endDate} onChange={this.handleChange.bind(this, i)} name="endDate" placeholder="End Date"></FormControl>                        
                <FormControl type="text" value={el.location} onChange={this.handleChange.bind(this, i)} name="location" placeholder="Location"></FormControl>   
                <Button variant="danger" onClick={this.removeClick.bind(this, i)}>Remove</Button>                     
            </div>
        ))
    }

    render () {
        return (
            // to grab the authenticated user info from React.Context hoc (may use Redux instead in the future)
                <div className="rectangle registerect container" style={{ marginTop: "120px", marginBottom: "500px" }}>
                    <div className="container">
                        <h1>Almost done</h1>
                        <Form
                            onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                        {/* <Form
                            onSubmit={e => this.handleSubmit(e, authUser)}
                            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                            { successMessage !== null ? (	                        
                                <Alert variant="warning">	                            
                                    {successMessage}	                                
                                </Alert>	                           
                            ) : null } */}
                            {/* <FormControl type="text" value={schoolName} onChange={this.handleChange} name="schoolName" placeholder="School Name"></FormControl>                        
                            <FormControl type="text" value={programType} onChange={this.handleChange} name="programType" placeholder="Program Type"></FormControl>                        
                            <FormControl type="text" value={programName} onChange={this.handleChange} name="programName" placeholder="Program Name"></FormControl>                        
                            <FormControl type="text" value={startDate} onChange={this.handleChange} name="startDate" placeholder="Start Date"></FormControl>                        
                            <FormControl type="text" value={endDate} onChange={this.handleChange} name="endDate" placeholder="End Date"></FormControl>                        
                            <FormControl type="text" value={location} onChange={this.handleChange} name="location" placeholder="Location"></FormControl>                        
                            <Button type="submit" variant="warning">
                                Register
                            </Button> */}
                            {this.createUI()} 
                            <Button type='button' variant="warning" onClick={this.addClick.bind(this)}>Add More</Button>
                            <Button type="submit" variant="warning">
                                Register
                            </Button>
                        </Form>
                    </div>
                </div>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const EducationForm = compose(connect(mapStateToProps), withRouter, withFirebase)(CreateEducationForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Education);

export { EducationForm };
