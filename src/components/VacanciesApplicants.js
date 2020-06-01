import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Video from '../components/Video2';
// import emailjs from 'emailjs-com';

let applicantList = {
    width: '100%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: '10px',
    margin: 'auto',
    marginBottom: '1em',
    padding: '1em',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
}

let applicantStyle = {
    width: '90%',
    height: '30%',
    backgroundColor: 'white',
    border: '1px solid #686868',
    borderRadius: '10px',
    margin: 'auto',
    marginBottom: '1em',
    marginTop: '1em',
    paddingTop: '1em',
    paddingBottom: '1em'

}

let buttonStyle1 = {
    margin: '0.25em',
    width: '10em'
}

let buttonStyle2 = {
    margin: '0.25em',
    width: '8em',
    color: '#686868',
    backgroundColor: 'white'
}

let actionsDivStyle = {
    padding: '1em',
    maxHeight: '70%'
}

let detailsDivStyle = {
    margin: 'auto'
}


class VacanciesApplicants extends Component {
    constructor(props) {
        super(props);
        // this.test = this.test.bind(this);
        this.state = {
            authUser: this.props.firebase.auth.currentUser,
            search: '',
            firebase: this.props.firebase,
            // passed the whole vacancy object here ...
            vacancyProp: this.props.location.state.vacancy,
            modalIsVisible: false
        };
    }

    componentDidMount() {
        this.props.authUser ? this.displayApplicants() : window.location.replace("/");
    }

    componentDidUpdate = nextProps => {
        if (this.props !== nextProps) {
            this.displayApplicants()
        }
    }

    deleteVacancy = () => {
        // let vacancyToRemove = this.props.firebase.vacanciesApplications().orderByChild('vacancyId').equalTo(this.state.vacancyProp.vacancyID);
        // vacancyToRemove.remove();
        // this.props.history.push({
        //     pathname: `useraccount#link1`,
        // })

        alert('Deletion is suspended for now')
    }


    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    displayApplicants = e => {

        let param = e ? e.target.value : 'pending';

        let userEmail = this.state.authUser ? this.state.authUser.email : '';

        document.getElementById('applicantsList').innerHTML = '';

        let applicantId = 0;

        let applicant = null;

        this.props.firebase.vacanciesApplications().orderByChild('positionTitle').equalTo(this.state.vacancyProp.positionTitle).once('value', snap => {
            snap.forEach(snap1 => {
                if (snap1.child('contactInfo').val() === userEmail) {
                    console.log(snap1.val())

                    if (snap1.child('status').val() === param) {

                        var div = document.createElement('div');
                        div.setAttribute('id', ++applicantId);

                        this.props.users.forEach(user => {
                            if (user.email === snap1.child('userEmail').val()) {
                                applicant = user;
                            }
                        })

                        if (document.getElementById('applicantsList') != null) {
                            document.getElementById('applicantsList').appendChild(div);

                            ReactDOM.render(<VacancyApplicant
                                firebase={this.props.firebase}
                                applicationData={snap1.val()}
                                applicantData={applicant}
                                userEmail={snap1.child('userEmail').val()}
                                history={this.props.history}
                            />, document.getElementById(applicantId));
                        }
                    }
                }
            })
        })
    }

    handleModal = () => this.setState({ modalIsVisible: !this.state.modalIsVisible });

    render() {

        return (
            <React.Fragment>
                <Video />
                <div className="container" style={{ width: '90%', margin: 'auto', marginTop: "120px" }}>
                    <div style={applicantList}>
                        <h2 style={{ color: '#686868' }} className="text-center">{this.state.vacancyProp.positionTitle} {this.state.vacancyProp.vacancyID.substring(this.state.vacancyProp.vacancyID.length - 5, this.state.vacancyProp.vacancyID.length)}</h2>
                        <div className="text-center">
                            <p>{this.state.marker}</p>
                            <Button variant="warning" value='addQuiz' style={buttonStyle1}>Add a quiz</Button>
                            <Button variant="warning" value='editVacancy' style={buttonStyle1}>Edit vacancy</Button>
                            <Button variant="warning" value='deleteVacancy' style={buttonStyle1} onClick={this.handleModal}>Delete vacancy</Button>
                            <Button variant="warning" value='archiveVacancy' style={buttonStyle1}>Archive vacancy</Button>
                        </div>
                    </div>

                    <div style={applicantList}>
                        <div className="text-center">
                            <Button variant="light" size="lg" onClick={this.displayApplicants} value='pending' style={buttonStyle2}>New</Button>
                            <Button variant="light" size="lg" onClick={this.displayApplicants} value='saved' style={buttonStyle2}>Saved</Button>
                            <Button variant="light" size="lg" onClick={this.displayApplicants} value='accepted' style={buttonStyle2}>Accepted</Button>
                            <Button variant="light" size="lg" onClick={this.displayApplicants} value='rejected' style={buttonStyle2}>Rejected</Button>
                        </div>
                        <div id='applicantsList'></div>
                    </div>

                    <Modal show={this.state.modalIsVisible} onHide={this.handleModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header>
                            <Modal.Title>Warning</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ margin: '0 auto' }}>
                                <h4>Are you sure you want to delet vacancy?</h4>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Button variant="primary" onClick={this.deleteVacancy}>Delete</Button>
                                <Button variant="secondary" onClick={this.handleModal} style={{ margin: '0.25em' }}>Close</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </React.Fragment>
        )
    }
}

class VacancyApplicant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachmentsUrl: null,
            hasQuiz: [],
            showReview: false,
            statusValue: this.props.applicationData.status,
        };
    }

    changeStatus = e => {

        this.setState({ statusValue: e.target.value })
        this.props.firebase.vacanciesApplications().orderByChild('positionTitle').equalTo(this.props.applicationData.positionTitle).once('value', snap => {
            snap.forEach(snap1 => {
                if (snap1.child('userEmail').val() === this.props.userEmail) {
                    this.props.firebase.vacanciesApplications().child(snap1.key).update({
                        status: this.state.statusValue
                    })

                    // 190 emails left ¯\_(ツ)_/¯
                    // if(e.target.value === 'accepted'){
                    //     var template_params = {
                    //         "applicantEmail": "rkmnslt@gmail.com",
                    //         "applicantEmail": this.props.userEmail,
                    //         "companyEmail": this.props.applicationData.contactInfo,
                    //         "positionTitle": this.props.applicationData.positionTitle
                    //     }
                    //     emailjs.send('default_service', 'template_iZWkUrIo', template_params, 'user_uO9vrokcldxCjrl8HAWdk')
                    //     .then((result) => {
                    //     console.log(result.text);
                    //     }, (error) => {
                    //     console.log('error.text');
                    //     });
                    // }                    
                }
            })
        })
    }

    componentDidMount = () => {
        this.getAttachmentsUrls();
        this.showQuizButton();
    }

    getAttachmentsUrls = () => {
        this.props.firebase.storage
            .ref(this.props.applicantData.userId)
            .child('applicationAttachment_' + this.props.applicantData.userId + '_' + this.props.applicationData.positionTitle)
            .getDownloadURL()
            .then(url => { this.setState({ attachmentsUrl: url }) })
            .catch(error => { })
    }

    handleQuizReviewClose = () => this.setState({ showReview: false });
    handleQuizReview = () => this.setState({ showReview: true });

    showQuizButton = () => {
        this.props.firebase.database().ref.child('quizeAnswers').ref.child(this.props.applicationData.vacancyId).on('value', snap => {
            this.setState({ hasQuiz: snap.val() })
        })
    }

    goToProfile = () => {
        this.props.history.push({
            pathname: `profile/${this.props.applicantData.userId}`,
            userData: this.props.userData
        })
    }

    showQuiz = () => {
        if (this.state.hasQuiz !== null) {
            return Object.keys(this.state.hasQuiz).map((item, i) => (
                <React.Fragment key={i}>
                    {(this.state.hasQuiz[item].userId === this.props.applicantData.userId) ?
                        <div style={{ marginBottom: '20px' }}>
                            {this.state.hasQuiz[item].question}
                            <br />
                            {(this.state.hasQuiz[item].questionType === 'multipleChoice') ? (
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
                                    Correct Answer: {this.state.hasQuiz[item].correctAanswer}
                                </React.Fragment>
                            ) : (
                                    <textarea style={{ width: '100%' }} disabled value={this.state.hasQuiz[item].answer} />
                                )
                            }
                        </div>
                        : null}
                </React.Fragment>
            )
            )
        }
    }

    render() {

        let application = this.props.applicationData;
        let applicant = this.props.applicantData;

        return (
            <React.Fragment>
                <div style={applicantStyle}>
                    <Row>
                        <Col sm={3} lg={2}>
                            <div style={actionsDivStyle}>
                                <Button value='saved' onClick={this.changeStatus} style={{ backgroundColor: '#FFAC11', borderColor: 'transparent', margin: '0.25em', width: '7em' }}>Save</Button> <br />
                                <Button value='accepted' onClick={this.changeStatus} style={{ background: 'linear-gradient(90deg, #F3565E 0%, #F97F3A 55.85%, #FFAC11 100.21%)', borderColor: 'transparent', margin: '0.25em', width: '7em' }}>Accept</Button> <br />
                                <Button value='rejected' onClick={this.changeStatus} style={{ backgroundColor: '#FF4C41', borderColor: 'transparent', margin: '0.25em', width: '7em' }}>Reject</Button> <br />
                            </div>
                        </Col>
                        <Col sm={9} lg={10}>
                            <div style={detailsDivStyle} onClick={this.goToProfile}>
                                <div style={{ fontSize: '150%' }}>{applicant.firstName} {applicant.lastName} - {applicant.title}</div>
                                <p>{applicant.city}, {applicant.province}, {applicant.country}</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <div>
                                    <div style={{ float: 'left', width: '25%' }}>{this.state.statusValue === 'accepted' ? application.userEmail : <div style={{ backgroundColor: 'grey', borderRadius: '0.5em', padding: '0.1em', display: 'inline-block' }}>User's email</div>}</div>
                                    <div style={{ width: '50%' }}>{this.state.attachmentsUrl ? <a href={this.state.attachmentsUrl} target="_blank" rel="noopener noreferrer">View attached files</a> : ''}</div>
                                    <div style={{ width: '25%' }}>{(this.state.hasQuiz !== null) ? <Button type='button' variant="warning" onClick={this.handleQuizReview} style={{ backgroundColor: '#FF4C41', borderColor: 'transparent', margin: '0.25em', width: '7em' }}>Review Quiz</Button> : null}</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                <Modal show={this.state.showReview} onHide={this.handleQuizReviewClose} size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header>
                        <Modal.Title>Review quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.showQuiz()}
                        <Button onClick={this.handleQuizReviewClose} variant="secondary" style={{ margin: '0.25em' }}>
                            Close
                        </Button>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    vacancies: Object.keys(state.vacanciesState.vacancies || {}).map(key => ({
        ...state.vacanciesState.vacancies[key],
        uid: key,
    })),
    VacanciesApplicants: Object.keys(state.savedVacanciesState.VacanciesApplicants || {}).map(key => ({
        ...state.savedVacanciesState.VacanciesApplicants[key],
        uid: key,
    })),
    appliedVacancies: Object.keys(state.appliedVacanciesState.appliedVacancies || {}).map(key => ({
        ...state.appliedVacanciesState.appliedVacancies[key],
        uid: key,
    })),
    companyVacancies: Object.keys(state.comapanyVacanciesState.companyVacancies || {}).map(key => ({
        ...state.comapanyVacanciesState.companyVacancies[key],
        vacancyID: key,
    })),
    userType: state.userTypeState.userType,
    users: Object.keys(state.usersState.users || {}).map(key => ({
        ...state.usersState.users[key],
        uid: key,
    })),
    authUser: state.sessionState.authUser,
});

const mapDispatchToProps = dispatch => ({
    onSetAppliedVacancies: appliedVacancies => dispatch({ type: 'APPLIED_VACANCIES_SET', appliedVacancies })
});

export default compose(withFirebase, connect(
    mapStateToProps,
    mapDispatchToProps
))(VacanciesApplicants);