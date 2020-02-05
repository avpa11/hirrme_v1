import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { AuthUserContext, withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const Experience = () => (
    <div>
        <ExperienceForm />
    </div>
)

const initState = {
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    successMessage: null
};

class CreateExperienceForm extends Component {
    constructor(props) {
        super(props);
        // this.state = {...initState}
        this.state = {
            experiences: [{
                position: '',
                company: '',
                startDate: '',
                endDate: '',
                location: '',
            }]
        }
    }

    handleSubmit = (event, authUser) => {
        // alert('A name was submitted: ' + JSON.stringify(this.state.experiences));
        event.preventDefault();

        this.state.experiences.map((item, key)=> (
            this.props.firebase.education(authUser.uid).push({
                position: item.position,
                company: item.company,
                startDate: item.startDate,
                endDate: item.endDate,
                location: item.location,
            })
        ));
   
        this.props.history.push('/useraccount');

    }

    
    // handleSubmit = (e, authUser) => {
    //     e.preventDefault();

    //     // this adds an education object under uid
    //     this.props.firebase.education(authUser.uid).push({
    //         // theoretically can set " this.setState({...initState}) " instead of writing each prop
    //         position: this.state.position,
    //         company: this.state.company,
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
        let experiences = [...this.state.experiences];
        experiences[i] = {...experiences[i], [name]:value};
        this.setState({experiences});
    };

    addClick() {
        this.setState(prevState => ({
            experiences: [...prevState.experiences, {position: '',
            company: '',
            startDate: '',
            endDate: '',
            location: ''}]
        }))
    }

    removeClick(i){
        let experiences = [...this.state.experiences];
        experiences.splice(i, 1);
        this.setState({ experiences });
     }

    createUI() {
        return this.state.experiences.map((el, i) => (
            <div key={i} style={{ marginBottom: '20px'}}>
                <FormControl type="text" value={el.position} onChange={this.handleChange.bind(this, i)} name="position" placeholder="Position"></FormControl>                        
                <FormControl type="text" value={el.company} onChange={this.handleChange.bind(this, i)} name="company" placeholder="Company"></FormControl>                        
                <FormControl type="text" value={el.startDate} onChange={this.handleChange.bind(this, i)} name="startDate" placeholder="Start Date"></FormControl>                        
                <FormControl type="text" value={el.endDate} onChange={this.handleChange.bind(this, i)} name="endDate" placeholder="End Date"></FormControl>                        
                <FormControl type="text" value={el.location} onChange={this.handleChange.bind(this, i)} name="location" placeholder="Location"></FormControl>   
                <Button variant="danger" onClick={this.removeClick.bind(this, i)}>Remove</Button>                     
            </div>
        ))
    }

    render () {
        const { position, company, startDate, endDate, location, successMessage } = this.state;
        return (
            // to grab the authenticated user info from React.Context hoc (may use Redux instead in the future)
            <AuthUserContext.Consumer>
            {authUser => (
                <div className="rectangle registerect container" style={{ marginTop: "120px", marginBottom: "500px" }}>
                    <div className="container">
                        <h1>Almost done</h1>
                        <Form
                            onSubmit={e => this.handleSubmit(e, authUser)}
                            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                        {/* <Form
                            onSubmit={e => this.handleSubmit(e, authUser)}
                            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                            { successMessage !== null ? (	                        
                                <Alert variant="warning">	                            
                                    {successMessage}	                                
                                </Alert>	                           
                            ) : null } */}
                            {/* <FormControl type="text" value={position} onChange={this.handleChange} name="position" placeholder="School Name"></FormControl>                        
                            <FormControl type="text" value={company} onChange={this.handleChange} name="company" placeholder="Program Type"></FormControl>                        
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
            )}
            </AuthUserContext.Consumer>
        )
    }

}

const ExperienceForm = compose(withRouter, withFirebase)(CreateExperienceForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Experience);

export { ExperienceForm };
