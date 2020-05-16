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
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import CompanyForm from '../reusable/CreateCompany';
import CompanyImage from '../reusable/CompanyImage';



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

            if (this.props.authUser != null) {

                var companyRef = this.props.firebase.companies().orderByChild('companyId')
                    .equalTo(this.props.authUser.uid)
                companyRef.on('value', snapshot => {
                    snapshot.forEach(snap1 => {
                        // Redux
                        this.props.onSetLoggedCompany(
                            snap1.val(),
                            // user object key
                            Object.keys(snapshot.val())[0],
                        );

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
                
                var vacanciesRef = this.props.firebase.database().ref.child('vacancies').ref.child(this.props.authUser.uid);
                vacanciesRef.on('value', snapshot => {                 

                    this.props.onSetCompanyVacancies(snapshot.val());

                    if (document.getElementById('vacancies') != null) {
                        document.getElementById('vacancies').innerHTML = '';
                    }

                    let id = 0;
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
        this.props.firebase.database().ref.child('quizes').off();
        this.props.firebase.database().ref.child('vacanciesApplications').off();
        this.props.firebase.database().ref.child('companyLikes').off();
    }

    showAllInfo = (e) => {
        e.preventDefault();
        if (this.state.showProfileAdd === true) {
            this.setState({ showProfileAdd: false });
        } else {
            this.setState({ showProfileAdd: true });
        }
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
                                    <ListGroup.Item action href="#link3">
                                        Edit Account
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#link2">
                                        Vacancies
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#link4">
                                        Settings
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col sm={9} style={{ backgroundColor: 'rgb(255,255,255)', borderRadius: '5px' }}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="#link1">
                                        <Row>
                                            <Col sm={4} style={{borderRight: '1px solid #686868', marginTop: '1em',  marginBottom: '1em'}}>
                                            <div className="center">
                                                { (this.props.company!== null && this.props.company!== undefined) ?
                                                (<img
                                                    src={this.state.url ||  this.props.company.profileImage || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                                                    alt="Uploaded Profile"
                                                    width="100"
                                                    />) : (
                                                        <img
                                                        src={this.state.url || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png'}
                                                        alt="Uploaded Profile"
                                                        width="100"
                                                        />
                                                        )}
                                            </div>
                                                <h4 className="center" style={{ marginBottom: 0, marginTop: '20px', color: '#686868' }}>{this.state.company.name}</h4>
                                                <p className="center" style={{ color: '#686868' }}>
                                                    <span>{this.state.company.city}</span>,
                                                    <span> {this.state.company.province}</span>,
                                                    <span> {this.state.company.country}</span>
                                                </p> <br />
                                            </Col>
                                            <Col sm={8} style={{marginTop: '2em'}}>
                                                <h4 class="jobTypeSpan">#{this.state.company.field}</h4>
                                                <p>
                                                    <span>{this.state.company.desrciption}</span>
                                                </p>
                                            </Col>
                                        </Row>

                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#link2">
                                        <VacancyForm />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#link3">
                                        <Row  style={{marginTop: '20px'}}>
                                            <Col sm={6}>
                                                <CompanyForm></CompanyForm>
                                            </Col>
                                            <Col sm={6}>
                                                <CompanyImage></CompanyImage>
                                            </Col>
                                        </Row>
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
            showReview: false,
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
            }],
            hasQuiz: []
        }
    }

    handleSubmit = (event) => {
        // alert('A name was submitted: ' + JSON.stringify(this.state.educations));
        event.preventDefault();

        /* Creates Separate Objects for questions */
        this.state.questions.map((item, key) => {
            return this.props.fireb.quiz(this.props.vacancy.vacancyID).push({
                question: item.question,
                questionType: item.questionType,
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
        this.showQuizButton();     
    }

    handleChange(i, e) {
        const { name, value } = e.target;
        let questions = [...this.state.questions];
        questions[i] = { ...questions[i], [name]: value };
        this.setState({ questions });
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
    handleQuizReviewClose = () => this.setState({ showReview: false });
    handleQuizReview = () => this.setState({ showReview: true });

    handleQuizDelete = () => {
        this.props.fireb.database().ref.child('quizes').ref.child(this.props.vacancy.vacancyID).remove();
        this.setState({ showReview: false })
    }

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

    showQuizButton = () => {
        this.props.fireb.database().ref.child('quizes').ref.child(this.props.vacancy.vacancyID).on('value', snap => {   
            this.setState({hasQuiz: snap.val()} )
        })
    }

    // quiz form
    createUI() {
        return this.state.questions.slice(0, 5).map((el, i) => (
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
                                <option value={el.option1}>Option 1 : {el.option1}</option>
                                <option value={el.option2}>Option 2 : {el.option2}</option>
                                <option value={el.option3}>Option 3 : {el.option3}</option>
                                <option value={el.option4}>Option 4 : {el.option4}</option>
                            </Form.Control>
                        </Form.Group>
                    </React.Fragment>
                ) : null}
                <div className="center">
                    {i !== 4 ?
                        <AiFillPlusCircle size={50} style={{color: '#ffc107', marginTop: '20px'}} type='button' onClick={this.addClick.bind(this)}>Add another question</AiFillPlusCircle>
                    : null
                    }
                    {i !== 0 ?
                        <AiFillMinusCircle size={50} style={{color: '#dc3545', marginTop: '20px'}} onClick={this.removeClick.bind(this, i)}>Remove</AiFillMinusCircle>
                    : null}
                </div>
                <hr />
            </div>
        ))
    }

    reviewQuiz() {
        if (this.state.hasQuiz !== null) {

            return Object.keys(this.state.hasQuiz).map((item, i) => (
                <div className="container" key={i} style={{ marginBottom: '20px' }}>

                    
                    { this.state.hasQuiz[item].question }
                    
                    <br />
                    { (this.state.hasQuiz[item].questionType === 'multipleChoice') ? (
                        <React.Fragment>
                            <div className="radio">
                                <label>
                                    {
                                        (this.state.hasQuiz[item].option1 === this.state.hasQuiz[item].answer ? 
                                            <input type="radio" value={this.state.hasQuiz[item].option1} defaultChecked /> :
                                            <input type="radio" value={this.state.hasQuiz[item].option1} disabled />)
                                    }
                                    {this.state.hasQuiz[item].option1}
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    {
                                        (this.state.hasQuiz[item].option2 === this.state.hasQuiz[item].answer ? 
                                            <input type="radio" value={this.state.hasQuiz[item].option2} defaultChecked /> :
                                            <input type="radio" value={this.state.hasQuiz[item].option2} disabled />)
                                    }
                                    {this.state.hasQuiz[item].option2}
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    {
                                        (this.state.hasQuiz[item].option3 === this.state.hasQuiz[item].answer ? 
                                            <input type="radio" value={this.state.hasQuiz[item].option3} defaultChecked /> :
                                            <input type="radio" value={this.state.hasQuiz[item].option3} disabled />)
                                    }
                                    {this.state.hasQuiz[item].option3}
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    {
                                        (this.state.hasQuiz[item].option4 === this.state.hasQuiz[item].answer ? 
                                            <input type="radio" value={this.state.hasQuiz[item].option4} defaultChecked /> :
                                            <input type="radio" value={this.state.hasQuiz[item].option4} disabled />)
                                    }
                                    {this.state.hasQuiz[item].option4}
                                </label>
                            </div>
                        </React.Fragment>
                        ) : (
                            <textarea style={{width: '100%'}} disabled value="Placeholder for an answer" />
                        )
                    }
                </div>
            )
                // console.log(this.state.hasQuiz[item].question)
            )
        }
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
                        <div id="quizButton">

                        </div>
                        { (this.state.hasQuiz == null) ? (
                                <Button variant="warning" onClick={this.handleShow}>Add a quiz</Button>
                            ) : (
                                <Button type='button' variant="warning" onClick={this.handleQuizReview}>Review Quiz</Button>
                            )
                        }
                        <br />
                        <Button style={{marginTop: '20px'}} onClick={this.goToApplications} variant="warning">Show Applicants</Button>

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

                <Modal show={this.state.showReview} onHide={this.handleQuizReviewClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>
                        <Modal.Title>Review a Quiz for {this.props.vacancy.positionTitle} vacancy </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.reviewQuiz()}
                        <Button onClick={this.handleQuizReviewClose} variant="secondary" style={{ margin: '0.25em' }}>
                                Close
                        </Button>
                        <Button onClick={this.handleQuizDelete} variant="danger" style={{ margin: '0.25em' }}>
                                Delete quiz
                        </Button>
                    </Modal.Body>
                </Modal>

            </React.Fragment>
        )
    }
}

class CreateVacancyForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState, show: false }
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
        .then(() =>  {
            var vacanciesRef = this.props.firebase.database().ref.child('vacancies').ref.child(this.props.authUser.uid);
                vacanciesRef.on('value', snapshot => {                 
                    this.props.onSetCompanyVacancies(snapshot.val());

                    if (document.getElementById('vacancies') != null) {
                        document.getElementById('vacancies').innerHTML = '';
                    }

                    let id = 0;
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
                })
            })
            .then(() => {
                this.setState({ show: true });
            })
            .then(() => {
                this.setState({ ...initState })
            })
            .catch(error => console.log(error));
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    render() {
        const { positionTitle, description, city, province, country, requirements, sector,
            keyResponsibilities, type, salary, salaryType, contactInfo } = this.state;
        return (
            <React.Fragment>
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
                                <FormControl type="text" value={province} onChange={this.handleChange} name="province" placeholder="Province" disabled></FormControl>
                            </Col>
                            <Col m={4}>
                                <FormControl type="text" value={country} onChange={this.handleChange} name="country" placeholder="Country" disabled></FormControl>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Control as="textarea" value={requirements} onChange={this.handleChange} name="requirements" placeholder="Job Requirements" rows="3"></Form.Control>
                    <Form.Group>
                        <Form.Label>Job Sector</Form.Label>
                        <Form.Control onChange={this.handleChange} value={sector} name="sector" as="select">
                            <option value=""></option>
                            <option value="Commercial Services">Commercial Services</option>
                            <option value="Communication">Communication</option>
                            <option value="Consumer Durables">Consumer Durables</option>
                            <option value="Consumer Services">Consumer Services</option>
                            <option value="Distribution Services">Distribution Services</option>
                            <option value="Electronic Technology">Electronic Technology</option>
                            <option value="Energy Minerals">Energy Minerals</option>
                            <option value="Finance">Finance</option>
                            <option value="Health Services">Health Services</option>
                            <option value="Health Technology">Health Technology</option>
                            <option value="Industrial Services">Industrial Services</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                            <option value="Non-Energy Minerals">Non-Energy Minerals</option>
                            <option value="Process Industries">Process Industries</option>
                            <option value="Retail Trade">Retail Trade</option>
                            <option value="Technology Services">Technology Services</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Utilities">Utilities</option>
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
                
                <Modal show={this.state.show} onHide={this.handleClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>
                        <Modal.Title>Vacancy Created! </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Your vacancy was successfully created!
                        <div style={{ textAlign: 'right' }}>
                            <Button onClick={this.handleClose} variant="secondary" style={{ margin: '0.25em' }}>
                                Close
                        </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
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
    vacanciesKey: Object.keys(state.comapanyVacanciesState.companyVacancies || {}),
    loggedCompany: (state.loggedCompanyState.loggedCompany || {})[Object.keys(state.loggedCompanyState.loggedCompany  || {})],
    loggedCompanyKey: Object.keys(state.loggedCompanyState.loggedCompany || {})
});

const mapDispatchToProps = dispatch => ({
    onSetCompanyVacancies: companyVacancies => dispatch({ type: 'COMPANY_VACANCIES_SET', companyVacancies }),
    onSetAppliedVacancies: appliedVacancies => dispatch({ type: 'APPLIED_VACANCIES_SET', appliedVacancies }),
    onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
    onSetLoggedCompany: (loggedCompany, key) => dispatch({ type: 'LOGGED_COMPANY_SET', loggedCompany, key }),
});

const VacancyForm = compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase)(CreateVacancyForm);

const VacancyObject = withFirebase(ListVacancies);

export default compose(withFirebase, withRouter, connect(mapStateToProps, mapDispatchToProps))(CompanyAccount);

export { VacancyForm };
export { VacancyObject };