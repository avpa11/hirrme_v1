import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import ReactDOM from 'react-dom';
// import { AuthUserContext } from './Session';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import PasswordChangeForm from '../reusable/PasswordChange';
import { FaBriefcase } from "react-icons/fa";
import { connect } from 'react-redux';
// import Nav from 'react-bootstrap/Nav';
// import { Link } from 'react-router-dom';



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
                            Object.keys(snapshot.val()).forEach(key => {
                                // The ID is the key
                                //   console.log(key);
                                currentComponent.setState({
                                    key: key,
                                });
                            });
                        }
                    });
                })

                this.props.firebase.vacanciesApplications().orderByChild('companyKey').equalTo(this.props.authUser.uid).on('value', snap => {
                    this.props.onSetAppliedVacancies(snap.val());
                })

                this.props.firebase.users().orderByChild('incognito').equalTo(null).on('value', snap => {
                    this.props.onSetUsers(snap.val());
                })
            

                var vacanciesRef = this.props.firebase.database().ref.child('vacancies').ref.child(this.state.authUser.uid);
                vacanciesRef.on('value', snapshot => {

                    this.props.onSetCompanyVacancies(snapshot.val());

                    if (document.getElementById('vacancies') != null) {
                        document.getElementById('vacancies').innerHTML = '';
                    }

                    let id = 0;
                    // console.log(this.props)
                    for (var i in this.props.vacancies) {
                        id++;

                        var div = document.createElement('div');
                        div.setAttribute('id', id);
                        if (document.getElementById('vacancies') != null) {
                            document.getElementById('vacancies').appendChild(div);

                            ReactDOM.render(<VacancyObject
                                vacancies={this.props.vacancies}
                                vacancy={this.props.vacancies[i]}
                                fireb={this.props.firebase}
                                companyID={this.props.authUser.uid}
                                authUser={this.props.authUser}
                                id={id}
                                pathHistory={this.props.history}
                            />, document.getElementById(id));
                        }
                    }
                });

            }
        })
    }

    componentWillUnmount() {
        this.props.firebase.database().off();
        this.props.firebase.database().ref.child('companies').off();
    }

    render() {
        return (
            <div>
                <div className="container" style={{ marginBottom: '20px' }}>
                    <Tab.Container id="list-group-tabs-example" activeKey={this.props.location.hash} defaultActiveKey="#link1">
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
                                    {/* <Nav>
                                        <Nav.Link as={Link} to={{
                                            pathname: "/applicants",
                                            data: 'kek'
                                        }}><Button variant="warning">Show Applicants</Button></Nav.Link>
                                    </Nav> */}
                                </ListGroup>
                            </Col>
                            <Col sm={9} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '5px' }}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="#link1">
                                        <h2 className="centerText" style={{ marginBottom: 0 }}>{this.state.company.name}</h2>
                                        <p style={{ color: 'rgb(155,155,155)' }}>
                                            <span>{this.state.company.city}</span>,
                                    <span> {this.state.company.province}</span>,
                                    <span> {this.state.company.country}</span>
                                        </p> <br />
                                        <h4><FaBriefcase /> {this.state.company.desrciption}</h4>
                                        <p style={{ color: 'rgb(155,155,155)' }}>
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
                <div className="container divcenter center" style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '10px', minHeight: '200px', maringTop: '30px', marginBottom: '50px' }}>
                    <h3 className="centerText">Your vacancies</h3>
                    {/* { console.log(this.state.vacancies) } */}
                    <div id="vacancies"></div>
                </div>
            </div >
        )
    }
}

class ListVacancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            numberOfApplicants: 0,
            numberOfSaves: 0,
            questions: [{
                question: '',
                questionType: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                answer: '',
            }]
        }
    }

    handleSubmit = (event) => {
        // alert('A name was submitted: ' + JSON.stringify(this.state.educations));
        event.preventDefault();

        /* Creates Separate Objects for questions */
        this.state.questions.map((item, key) => {
            this.props.fireb.quizes().push({
                question: item.question,
                qusetionType: item.questionType,
                option1: item.option1,
                option2: item.option2,
                option3: item.option3,
                option4: item.option4,
                answer: item.answer,
                vacancyId: this.props.vacancy.vacancyID,
                companyId: this.props.companyID
            })
                .then(setTimeout(this.handleClose, 2000))
                .catch(error => { console.log(error) });
        })
    }

    componentDidMount(){
        this.showVacancyStat();
    }

    handleChange(i, e) {
        const { name, value } = e.target;
        let questions = [...this.state.questions];
        questions[i] = { ...questions[i], [name]: value };
        this.setState({ questions });

        // console.log(questions);
    };

    removeClick(i) {
        let questions = [...this.state.questions];
        questions.splice(i, 1);
        this.setState({ questions });
    }

    addClick() {
        this.setState(prevState => ({
            questions: [...prevState.questions, {
                question: '',
                questionType: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                answer: '',
            }]
        }))
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    goToApplications = () => {
        this.props.pathHistory.push({
            pathname: '/applicants',
            state: { vacancy: this.props.vacancy }});
    }

    showVacancyStat = () => {        

        this.props.fireb.vacanciesApplications().orderByChild('positionTitle').equalTo(this.props.vacancy.positionTitle).on('value', snap => {
            this.setState({numberOfApplicants: snap.numChildren()})            
            })  
            
        this.props.fireb.savedVacancies().orderByChild('positionTitle').equalTo(this.props.vacancy.positionTitle).on('value', snap => {
            this.setState({numberOfSaves: snap.numChildren()})            
            })  
    }

    createUI() {
        return this.state.questions.map((el, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
                <Row>
                    <Col sm={8}>
                        <Form.Group>
                            <Form.Label>Question {i + 1}:</Form.Label>
                            <FormControl type="text" value={el.question} onChange={this.handleChange.bind(this, i)} name="question" placeholder="Type your question"></FormControl>
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Group>
                            <Form.Label>Question Type:</Form.Label>
                            <Form.Control onChange={this.handleChange.bind(this, i)} value={el.questionType} name="questionType" as="select">
                                <option value="" disabled={true}>Select type...</option>
                                <option value="openAnswer">Open Answer</option>
                                <option value="multipleChoice">Multiple Choice</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                {/* {el.questionType === 'multipleChoice' ? this.createOptions(el, i, this) : null} */}

                {el.questionType === 'multipleChoice' ? (
                    <React.Fragment>
                        <Form.Group>
                            <Form.Label>Option 1:</Form.Label>
                            <FormControl type="text" value={el.option1} onChange={this.handleChange.bind(this, i)} name="option1" placeholder="Answer Option 1"></FormControl>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Option 2:</Form.Label>
                            <FormControl type="text" value={el.option2} onChange={this.handleChange.bind(this, i)} name="option2" placeholder="Answer Option 2"></FormControl>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Option 3:</Form.Label>
                            <FormControl type="text" value={el.option3} onChange={this.handleChange.bind(this, i)} name="option3" placeholder="Answer Option 3"></FormControl>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Option 4:</Form.Label>
                            <FormControl type="text" value={el.option4} onChange={this.handleChange.bind(this, i)} name="option4" placeholder="Answer Option 4"></FormControl>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Answer:</Form.Label>
                            <Form.Control onChange={this.handleChange.bind(this, i)} value={el.answer} name="answer" as="select">
                                <option value="" disabled={true}>Select an answer from options...</option>
                                <option value="option1">Option 1 : {el.option1}</option>
                                <option value="option2">Option 2 : {el.option2}</option>
                                <option value="option3">Option 3 : {el.option3}</option>
                                <option value="option4">Option 4 : {el.option4}</option>
                            </Form.Control>
                        </Form.Group>
                    </React.Fragment>
                ) : null}

                <Button type='button' variant="warning" onClick={this.addClick.bind(this)}>Add another question</Button>
                <Button variant="danger" onClick={this.removeClick.bind(this, i)}>Remove</Button>
            </div>
        ))
    }

    render() {
        return (
            <React.Fragment>
                <Row>
                    <Col sm={8}>
                        <h3>{this.props.vacancy.positionTitle} <span className="jobTypeSpan">#{this.props.vacancy.type}</span></h3>
                        <h4>{this.props.vacancy.city}, {this.props.vacancy.province}, {this.props.vacancy.country}</h4>
                        <p>{this.props.vacancy.description}</p>
                    </Col>
                    <Col sm={4}>
                        <p>Number of Saves: {this.state.numberOfSaves}</p>
                        <p>Number of Applications: {this.state.numberOfApplicants}</p>
                        <Button variant="warning" onClick={this.handleShow}>Add a quiz</Button> <br />
                        <Button style={{marginTop: '20px'}} onClick={this.goToApplications} variant="warning">Show Applicants</Button>

                        {/*  

                        Alina, can you please take a look how to make Nav.Link working here?

                        <Nav>
                            <Nav.Link as={Link} to={{
                                pathname: "/applicants",
                                data: 'hey'
                            }}><Button variant="warning">Show Applicants</Button></Nav.Link>
                        </Nav> 
                        
                        */}
                    </Col>
                </Row>
                <hr />

                <Modal show={this.state.show} onHide={this.handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>
                        <Modal.Title>Add a Quiz for {this.props.vacancy.positionTitle} vacancy </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={e => this.handleSubmit(e)}>

                            {this.createUI()}

                            <hr />
                            <div style={{ textAlign: 'right' }}>
                                <Button onClick={this.handleClose} variant="secondary" style={{ margin: '0.25em' }}>
                                    Close
                            </Button>
                                <Button type="submit" >
                                    Create a quiz
                            </Button>
                            </div>
                        </Form>

                    </Modal.Body>
                </Modal>

            </React.Fragment>
        )
    }
}

class CreateVacancyForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState }
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
                this.setState({ ...initState })
            })
            .catch(error => console.log(error));
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
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

// Redux stuff
const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,

    vacancies: Object.keys(state.comapanyVacanciesState.companyVacancies || {}).map(key => ({
        ...state.comapanyVacanciesState.companyVacancies[key],
        vacancyID: key,
    })),
    appliedVacancies: Object.keys(state.appliedVacanciesState.appliedVacancies || {}).map(key => ({
        ...state.appliedVacanciesState.appliedVacancies[key],
        uid: key,
    })),
    vacanciesKey: Object.keys(state.comapanyVacanciesState.companyVacancies || {})

});

const mapDispatchToProps = dispatch => ({
    onSetCompanyVacancies: companyVacancies => dispatch({ type: 'COMPANY_VACANCIES_SET', companyVacancies }),
    onSetAppliedVacancies: appliedVacancies => dispatch({ type: 'APPLIED_VACANCIES_SET', appliedVacancies }),
    onSetUsers: users => dispatch({ type: 'USERS_SET', users })
});

const VacancyForm = compose(connect(mapStateToProps), withRouter, withFirebase)(CreateVacancyForm);

const VacancyObject = withFirebase(ListVacancies);

export default compose(withFirebase, withRouter, connect(mapStateToProps, mapDispatchToProps))(CompanyAccount);

export { VacancyForm };
export { VacancyObject };