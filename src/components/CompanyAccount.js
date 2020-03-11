import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { AuthUserContext } from './Session';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import PasswordChangeForm from '../reusable/PasswordChange';
import { FaBriefcase } from "react-icons/fa";
import { connect } from 'react-redux';

const initState = {
    //   for vacancies:
    positionTitle: null,
    description: '',
    city: '',
    province: 'BC',
    country: 'Canada',
    requirements: '',
    sector: '',
    keyResponsibilities: '',
    type: '',
    salary: '',
    salaryType: '',
    contactInfo: '',
}

class CompanyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
          company: [],
          vacancies: [],
          key: '',
        };
      }

      componentDidMount() {
        let currentComponent = this;
        this.setState({ loading: true });
        this.props.firebase.auth.onAuthStateChanged(authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });

            if (this.state.authUser != null) {

            var companyRef = this.props.firebase.database().ref.child('companies').orderByChild('companyId')
            .equalTo(this.state.authUser.uid)
            companyRef.on('value', snapshot => {
                snapshot.forEach(snap1 => {
                    currentComponent.setState({
                        company: snap1.val(),
                    });
                    if (snapshot.val() !== null) {
                        Object.keys(snapshot.val() ).forEach(key => {
                          // The ID is the key
                        //   console.log(key);
                          currentComponent.setState({
                            key: key,
                        });
                        });
                    }
                    // console.log(currentComponent.state.user.incognito);
                    // console.log(currentComponent.state.user);
                    // console.log(snapshot.val());
                });
            })
            var vacanciesRef = this.props.firebase.database().ref.child('vacancies').ref.child(this.state.authUser.uid);
            vacanciesRef.on('value', snapshot => {
                if (document.getElementById('vacancies')!= null) {
                    document.getElementById('vacancies').innerHTML = '';
                }
                snapshot.forEach(snap1 => {
                    currentComponent.setState({
                        vacancies: snapshot.val(),
                    });
                    var div = document.createElement('div');
                    div.setAttribute('class', 'edu');
                    var p = document.createElement('h3');    
                    p.setAttribute('class', 'mainp');            
                    p.textContent = snap1.child('positionTitle').val();
                    var spanDate = document.createElement('span'); 
                    spanDate.setAttribute('class', 'span_date'); 
                    spanDate.textContent = snap1.child('salary').val() + "$/ " + snap1.child('salaryType').val();
                    p.appendChild(spanDate);
                    div.appendChild(p);
                    // location
                    var p2 = document.createElement('p');
                    p2.setAttribute('class', 'name');
                    p2.textContent = snap1.child('city').val() + ", " + snap1.child('province').val()  + ", " + snap1.child('country').val();
                    div.appendChild(p2);
                    // description
                    var hDesc = document.createElement('h');
                    hDesc.textContent = "Description";
                    div.appendChild(hDesc);
                    var p3 = document.createElement('p');
                    p3.setAttribute('class', 'name');
                    p3.textContent = snap1.child('description').val();
                    div.appendChild(p3);
                    // requirements
                    var hRequirements = document.createElement('h');
                    hRequirements.textContent = "Requirements";
                    div.appendChild(hRequirements);
                    var p4 = document.createElement('p');
                    p4.setAttribute('class', 'name');
                    p4.textContent = snap1.child('requirements').val();
                    div.appendChild(p4);
                    // keyResponsibilities
                    var hResponsibilities = document.createElement('h');
                    hResponsibilities.textContent = "Responsibilities";
                    div.appendChild(hResponsibilities);
                    var p5 = document.createElement('p');
                    p5.setAttribute('class', 'name');
                    p5.textContent = snap1.child('keyResponsibilities').val();
                    div.appendChild(p5);
                    var hr = document.createElement('hr');
                    div.appendChild(hr);
                    if (document.getElementById('vacancies')!= null) {
                        if (div !== '') {
                            document.getElementById('vacancies').appendChild(div);
                        } else {
                            // NOT WORKING
                            document.getElementById('vacancies').innerHTML = "You don't have any vacancies yet";
                        }
                    }
                        
    
                    // console.log(currentComponent.state.vacancies);
                });
        });

         }
        })
    }

    componentWillUnmount() {
      this.props.firebase.database().off();
      this.props.firebase.database().ref.child('companies').off();
    }

    render () {
        return (
            <div>	                        
                <div className="container" style={{marginBottom: '20px'}}>  
                    <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                        <Col sm={3}>
                        <ListGroup>
                            <ListGroup.Item action href="#link1">
                            Company Account
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link2">
                            Vacancies
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link4">
                            Settings
                            </ListGroup.Item>
                        </ListGroup>
                        </Col>
                        <Col sm={9} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '5px'}}>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link1">
                                <h2 className="centerText" style={{marginBottom: 0}}>{this.state.company.name}</h2>
                                <p style={{color: 'rgb(155,155,155)'}}>
                                    <span>{this.state.company.city}</span>,
                                    <span> {this.state.company.province}</span>, 
                                    <span> {this.state.company.country}</span>
                                </p> <br />
                                <h4><FaBriefcase /> {this.state.company.desrciption}</h4>
                                <p style={{color: 'rgb(155,155,155)'}}>
                                    <span> {this.state.company.field}</span>
                                </p>
                                <p>Director - {this.state.company.director}</p>

                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                                <VacancyForm />
                            </Tab.Pane>
                            <Tab.Pane id="settingsTab" eventKey="#link4">
                                <h2>Password Change</h2>
                                <PasswordChangeForm />
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>
                </div>
                    <div className="container divcenter center" style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px', maringTop: '30px', marginBottom: '50px'}}>
                        <h3 className="centerText">Your vacancies</h3>
                        {/* { console.log(this.state.vacancies) } */}
                        <div id="vacancies"></div> 
                    </div>
                </div>  
        )
    }
}

class CreateVacancyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...initState}
    }

    
    handleSubmit = (e, authUser) => {
        e.preventDefault();

        this.props.firebase.vacancy(authUser.uid).push({
            positionTitle: this.state.positionTitle,
            description: this.state.description,
            city: this.state.city,
            province: this.state.province,
            country: this.state.country,
            requirements: this.state.requirements,
            sector: this.state.sector,
            keyResponsibilities: this.state.keyResponsibilities,
            type: this.state.type,
            salary: this.state.salary,
            salaryType: this.state.salaryType,
            contactInfo: this.state.contactInfo
        })
        .then(() => {
            this.setState({...initState})
        })
        .catch(error => console.log(error));
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render () {
        const { positionTitle, description, city, province, country, requirements, sector,
            keyResponsibilities, type, salary, salaryType, contactInfo } = this.state;
        return (
            <Form
                onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                style={{ justifyContent: 'center', marginTop: "30px", marginBottom: "30px" }}>
            
                <FormControl type="text" value={positionTitle} onChange={this.handleChange} name="positionTitle" placeholder="Title"></FormControl>                        
                <Form.Control as="textarea" value={description} onChange={this.handleChange} name="description" placeholder="Job Description" rows="3"></Form.Control> 
                <Form.Group>  
                    <Form.Label>Location</Form.Label>    
                    <Row>  
                        <Col m={4}>
                            <FormControl type="text" value={city} onChange={this.handleChange} name="city" placeholder="City"></FormControl>                        
                        </Col>               
                        <Col m={4}>
                            <FormControl type="text" value={province} onChange={this.handleChange} name="province" placeholder="Province"></FormControl>                        
                        </Col>               
                        <Col m={4}>
                            <FormControl type="text" value={country} onChange={this.handleChange} name="country" placeholder="Country"></FormControl>   
                        </Col>               
                    </Row>
                </Form.Group>   
                <Form.Control as="textarea" value={requirements} onChange={this.handleChange} name="requirements" placeholder="Job Requirements" rows="3"></Form.Control>                        
                <Form.Group>
                    <Form.Label>Job Sector</Form.Label>
                    <Form.Control onChange={this.handleChange} value={sector} name="sector" as="select">
                    <option value=""></option>
                    <option value="computer">Computer and Technology</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Accounting and Finance</option>
                    </Form.Control>
                </Form.Group>
                <Form.Control as="textarea" value={keyResponsibilities} onChange={this.handleChange} name="keyResponsibilities" placeholder="Key Responsibilities" rows="3"></Form.Control>                        
                <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Control onChange={this.handleChange} value={type} name="type" as="select">
                    <option value="" ></option>
                    <option value="full-time" >Full-time</option>
                    <option value="part-time" >Part-time</option>
                    <option value="contract" >Contract</option>
                    <option value="internship" >Internship</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Salary</Form.Label>
                    <Row>
                        <Col m={6}>
                            <FormControl type="text" value={salary} onChange={this.handleChange} name="salary" placeholder="Salary"></FormControl>   
                        </Col>  
                        <Col m={6}>
                            <Form.Control onChange={this.handleChange} value={salaryType} name="salaryType" as="select">
                            <option value=""> </option>
                            <option value="yearly">yearly</option>
                            <option value="hourly">hourly</option>
                            </Form.Control>
                        </Col>  
                    </Row>
                </Form.Group>
                <FormControl type="email" value={contactInfo} onChange={this.handleChange} name="contactInfo" placeholder="Contact Email"></FormControl>      
            
                <Button type="submit" variant="warning">
                    Create
                </Button>
            </Form>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
});



const VacancyForm = compose(connect(mapStateToProps),withRouter, withFirebase)(CreateVacancyForm);

export default withFirebase(CompanyAccount);

export { VacancyForm };