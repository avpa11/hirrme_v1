import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";

import { withAuthorization } from '../components/Session';

import { withFirebase } from '../components/Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

class FormExperience extends Component {
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
                description: ''
            }]
        }
    }

    handleSubmit = (event, authUser) => {
        event.preventDefault();

        this.state.experiences.map((item, key)=> (
            this.props.firebase.experience(authUser.uid).push({
                position: item.position,
                company: item.company,
                startDate: item.startDate,
                endDate: item.endDate,
                location: item.location,
                description: item.description
            })
        ))
        if (this.props.location.pathname === '/experience') {
            this.props.history.push('/useraccount#link1');
        }
    }

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
            location: '',
            description: ''}]
        }))
    }

    removeClick(i){
        let experiences = [...this.state.experiences];
        experiences.splice(i, 1);
        this.setState({ experiences });
     }

    createUI() {
        return this.state.experiences.slice(0, 5).map((el, i) => (
            <div key={i} style={{ marginBottom: '20px'}}>
                <Row>
                    <Col sm={6}>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Position<span style={{color: '#dc3545'}}>*</span></Form.Label>
                        <FormControl type="text" value={el.position} onChange={this.handleChange.bind(this, i)} name="position" placeholder=""></FormControl>                        
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Company<span style={{color: '#dc3545'}}>*</span></Form.Label>
                        <FormControl type="text" value={el.company} onChange={this.handleChange.bind(this, i)} name="company" placeholder=""></FormControl>                        
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Start Date<span style={{color: '#dc3545'}}>*</span></Form.Label>
                        <FormControl type="text" value={el.startDate} onChange={this.handleChange.bind(this, i)} name="startDate" placeholder=""></FormControl>                        
                    </Col>
                    <Col sm={6}>
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>End Date<span style={{color: '#dc3545'}}></span></Form.Label>
                        <FormControl type="text" value={el.endDate} onChange={this.handleChange.bind(this, i)} name="endDate" placeholder=""></FormControl>    
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Location<span style={{color: '#dc3545'}}>*</span></Form.Label>                    
                        <FormControl type="text" value={el.location} onChange={this.handleChange.bind(this, i)} name="location" placeholder=""></FormControl>   
                        <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Description<span style={{color: '#dc3545'}}>*</span></Form.Label>                       
                        <textarea rows="4" style={{width: '100%'}} value={el.description} onChange={this.handleChange.bind(this, i)} name="description" placeholder=""></textarea>                    
                    </Col>
                </Row>
                <div className="center">
                {i > 0 ? 
                    <AiFillMinusCircle size={50} style={{color: '#dc3545', marginTop: '20px'}} onClick={this.removeClick.bind(this, i)}>Remove</AiFillMinusCircle>                     
                : null}
                {i < 5 ? 
                    <AiFillPlusCircle size={50} type='button' style={{color: '#ffc107', marginTop: '20px'}}  onClick={this.addClick.bind(this)}>Add More</AiFillPlusCircle>
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
                        Register
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

export default  compose(connect(mapStateToProps), withRouter, withFirebase,withAuthorization(condition))(FormExperience);