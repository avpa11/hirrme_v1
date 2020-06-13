import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";

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
                description: ''
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
                description: item.description
            })
        ))
        if (this.props.location.pathname === '/education') {
            this.props.history.push('/experience');
        }
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
            location: '',
            description: ''}]
        }))
    }

    removeClick(i){
        let educations = [...this.state.educations];
        educations.splice(i, 1);
        this.setState({ educations });
     }

    createUI() {
        return this.state.educations.slice(0, 5).map((el, i) => (
            <div key={i} style={{ marginBottom: '20px'}}>
                <Row>
                    <Col sm={6}>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>School Name<span style={{color: '#dc3545'}}>*</span></Form.Label>
                        <FormControl type="text" value={el.schoolName} onChange={this.handleChange.bind(this, i)} name="schoolName" placeholder=""></FormControl>                        
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Program Type<span style={{color: '#dc3545'}}>*</span></Form.Label>
                        <FormControl type="text" value={el.programType} onChange={this.handleChange.bind(this, i)} name="programType" placeholder=""></FormControl>  
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Program Name<span style={{color: '#dc3545'}}>*</span></Form.Label>                      
                        <FormControl type="text" value={el.programName} onChange={this.handleChange.bind(this, i)} name="programName" placeholder=""></FormControl>                                
                    </Col>
                    <Col sm={6}>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Start Date<span style={{color: '#dc3545'}}>*</span></Form.Label>    
                        <FormControl type="date" value={el.startDate} onChange={this.handleChange.bind(this, i)} name="startDate" placeholder=""></FormControl>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>End Date<span style={{color: '#dc3545'}}></span></Form.Label>                        
                        <FormControl type="date" value={el.endDate} onChange={this.handleChange.bind(this, i)} name="endDate" placeholder=""></FormControl> 
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Location<span style={{color: '#dc3545'}}>*</span></Form.Label>                       
                        <FormControl type="text" value={el.location} onChange={this.handleChange.bind(this, i)} name="location" placeholder=""></FormControl>   
                    </Col>
                </Row>
                <Row style={{marginTop: '20px'}}>
                    <Col sm={12}>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Description<span style={{color: '#dc3545'}}>*</span></Form.Label>                       
                        <textarea rows="4" style={{width: '100%'}} value={el.description} onChange={this.handleChange.bind(this, i)} name="description" placeholder=""></textarea>                    
                    </Col>
                </Row>
                <div className="center">
                    {i > 0 ? 
                    <AiFillMinusCircle size={50} style={{color: '#dc3545', marginTop: '20px'}} onClick={this.removeClick.bind(this, i)}>Remove</AiFillMinusCircle>
                    : null}
                    {i < 4 ? 
                    <AiFillPlusCircle size={50} style={{color: '#ffc107', marginTop: '20px'}} type='button' variant="warning" onClick={this.addClick.bind(this)}>Add More</AiFillPlusCircle> 
                    : null}                   
                </div>
            </div>
        ))
    }

    render () {
        return (
            <Form
                onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                style={{ justifyContent: 'center', marginTop: "50px" }}>
                {this.createUI()}
                <div className="center" style={{marginTop: "50px"}}>
                    <Button type="submit" className="loginButton" variant="warning">
                        Continue
                    </Button>
                </div> 
            </Form>
        )
    }
}


const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const condition = authUser => !!authUser;

export default compose(connect(mapStateToProps), withFirebase,withAuthorization(condition))(FormEducation);

