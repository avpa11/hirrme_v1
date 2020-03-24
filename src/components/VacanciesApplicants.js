import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import emailjs from 'emailjs-com';


class VacanciesApplicants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: this.props.firebase.auth.currentUser,
            search: '',
            firebase: this.props.firebase,
            // passed the whole vacancy object here ...
            vacancyProp: this.props.location.state.vacancy
        };
    }

    componentDidMount() {
        this.props.authUser ? this.displayApplicants() : window.location.replace("/");  
            // need to also account for undefined, when a user comes to this link not using "Show Applicants" button
     
        // console.log(this.state.vacancyProp);
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

        let applicantId = 0;

        let applicant = null;

        this.props.appliedVacancies.forEach(application => {

            this.props.users.forEach(user => {
                if (user.email === application.userEmail) {
                    applicant = user;
                }
            })
        
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
        });
    }

    render() {
        // To pass vacancy id from previous page
        // const { data } = this.props.location;

        return (
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Applications</h4>
                <p id='applicantsList'></p>
            </div>
        )
    }
}

class VacancyApplicant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachmentsUrl: null
        };
    }

    changeStatus = e => {
        this.props.firebase.vacanciesApplications().orderByChild('positionTitle').equalTo(this.props.applicationData.positionTitle).once('value', snap => {
            snap.forEach(snap1 => {
                if (snap1.child('userEmail').val() === this.props.userEmail) {
                    this.props.firebase.vacanciesApplications().child(snap1.key).update({
                        status: e.target.value
                    })

                    if(e.target.value === 'accepted'){
                        var template_params = {
                            "applicantEmail": "rkmnslt@gmail.com",
                            "applicantEmail": this.props.userEmail,
                            "companyEmail": this.props.applicationData.contactInfo,
                            "positionTitle": this.props.applicationData.positionTitle
                        }
                        emailjs.send('default_service', 'template_iZWkUrIo', template_params, 'user_uO9vrokcldxCjrl8HAWdk')
                        .then((result) => {
                        console.log(result.text);
                        }, (error) => {
                        console.log('error.text');
                        });
                    }                    
                }
            })
        })
    }

    componentDidMount = () => {
        this.getAttachmentsUrls();
    }

    getAttachmentsUrls = () => {
            this.props.firebase.storage
            .ref(this.props.applicantData.userId)
            .child('applicationAttachment_' + this.props.applicantData.userId + '_' + this.props.applicationData.positionTitle)
            .getDownloadURL()
            .then( url => {
                this.setState({attachmentsUrl: url})    
            }).catch(error => {})
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
            
            <div style={applicantStyle}>
                <Row>
                    <Col sm={2}>
                        <div style={divStyle}>
                            <Button variant="warning" value='saved' onClick={this.changeStatus} style={buttonStyle}>Save</Button> <br />
                            <Button variant="warning" value='accepted' onClick={this.changeStatus} style={buttonStyle}>Accept</Button> <br />
                            <Button variant="warning" value='rejected' onClick={this.changeStatus} style={buttonStyle}>Reject</Button> <br />
                        </div>
                    </Col>
                    <Col sm={10}>
                        <div style={divStyle}>
                            <p>{application.userEmail} applied for {application.positionTitle} position on {application.date}. Status: {application.status}</p>
                            <h4>{applicant.firstName} {applicant.lastName}, {applicant.title}</h4>
                            <p>{applicant.city}, {applicant.province}, {applicant.country}</p>
                            <p>User default text</p>
                            {this.state.attachmentsUrl ? <a href={this.state.attachmentsUrl} target="_blank">View attached files</a> : ''}
                        </div>
                    </Col>
                </Row>
            </div>
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

export default compose(withFirebase, connect(
    mapStateToProps,
))(VacanciesApplicants);