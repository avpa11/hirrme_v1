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


class VacanciesApplicants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: this.props.firebase.auth.currentUser,
            search: '',
            firebase: this.props.firebase,
            // passed the whole vacancy object here ...
            vacancyProp: this.props.location.state.vacancy,
        };
    }

    componentDidMount() {
        this.props.authUser ? this.displayApplicants() : window.location.replace("/");
        // need to also account for undefined, when a user comes to this link not using "Show Applicants" button
        // console.log(this.state.hasQuiz);
        
        
    }

    componentDidUpdate = (nextProps) => {
        if (this.props !== nextProps) {
            this.displayApplicants()
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    displayApplicants() {

        // console.log(this.state.vacancyProp);

        let applicantId = 0;

        let applicant = null;

        this.props.appliedVacancies.forEach(application => {

            this.props.users.forEach(user => {
                if (user.email === application.userEmail) {
                    applicant = user;
                }
            })

            if (application.positionTitle === this.state.vacancyProp.positionTitle) {
                applicantId++;
                var div = document.createElement('div');
                div.setAttribute('id', applicantId);

                if (document.getElementById('applicantsList') != null) {
                    document.getElementById('applicantsList').appendChild(div);

                    ReactDOM.render(<VacancyApplicant
                        firebase={this.props.firebase}
                        applicationData={application}
                        applicantData={applicant}
                        userEmail={application.userEmail}
                    />, document.getElementById(applicantId));
                }
            }
        });
    }

    render() {
        // To pass vacancy id from previous page
        // const { data } = this.props.location;

        return (
            <React.Fragment>
                <Video />
            <div className="container" style={{ marginTop: "120px" }}>
                <h2 className="text-center">{this.state.vacancyProp.positionTitle}</h2>
                <p id='applicantsList'></p>
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
        this.setState({statusValue: e.target.value})
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
            .then(url => {
                this.setState({ attachmentsUrl: url })
            }).catch(error => { })
    }

    handleQuizReviewClose = () => this.setState({ showReview: false });
    handleQuizReview = () => this.setState({ showReview: true });

    showQuizButton = () => {
        this.props.firebase.database().ref.child('quizeAnswers').ref.child(this.props.applicationData.vacancyId).on('value', snap => {   
            this.setState({hasQuiz: snap.val()} )
            // console.log(snap.val());
        })
    }

    showQuiz = () => {
        if (this.state.hasQuiz !== null) {
            return Object.keys(this.state.hasQuiz).map((item, i) => (
                <React.Fragment key={i}>
                    {(this.state.hasQuiz[item].userId === this.props.applicantData.userId) ?
                        <div style={{marginBottom: '20px'}}>
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
                                    Correct Answer: {this.state.hasQuiz[item].correctAanswer}
                                </React.Fragment>
                                ) : (
                                    <textarea style={{width: '100%'}} disabled value={this.state.hasQuiz[item].answer} />
                                )
                            }
                    </div>
                    :null}
                </React.Fragment>
            )
            )
        }
    }

    render() {
        let applicantStyle = {
            width: '100%',
            height: '30%',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '10px',
            margin: '1em'
        }

        let buttonStyle = {
            margin: '0.25em'
        }

        let divStyle = {
            margin: '1em',
            padding: '1em'
        }

        let application = this.props.applicationData;
        let applicant = this.props.applicantData;

        return (
            <React.Fragment>
            <div style={applicantStyle}>
                <Row>
                    <Col sm={2}>
                        <div style={divStyle}>
                            <Button variant="warning" value='saved' onClick={this.changeStatus} style={buttonStyle}>Save</Button> <br />
                            <Button variant="warning" value='accepted' onClick={this.changeStatus} style={buttonStyle}>Accept</Button> <br />
                            <Button variant="warning" value='rejected' onClick={this.changeStatus} style={buttonStyle}>Reject</Button> <br />
                            {(this.state.hasQuiz !== null) ? 
                            <Button type='button' variant="warning" onClick={this.handleQuizReview}>Review Quiz</Button> : null
                            } 
                        </div>
                    </Col>
                    <Col sm={10}>
                        <div style={divStyle}>
                            <p>{application.userEmail} applied for {application.positionTitle} position on {application.date}. Status: {this.state.statusValue}</p>
                            <h4>{applicant.firstName} {applicant.lastName}, {applicant.title}</h4>
                            <p>{applicant.city}, {applicant.province}, {applicant.country}</p>
                            <p>User default text</p>
                            {this.state.attachmentsUrl ? <a href={this.state.attachmentsUrl} target="_blank" rel="noopener noreferrer">View attached files</a> : ''}
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