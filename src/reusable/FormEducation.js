import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { withAuthorization } from '../components/Session';

import { withFirebase } from '../components/Firebase';
// import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

class FormEducation extends Component {
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
    }

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
            <Form
                onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                {this.createUI()} 
                <Button type='button' variant="warning" onClick={this.addClick.bind(this)}>Add More</Button>
                <Button type="submit" variant="warning">
                    Register
                </Button>
            </Form>
        )
    }
}


const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const condition = authUser => !!authUser;

export default compose(connect(mapStateToProps), withFirebase,withAuthorization(condition))(FormEducation);

