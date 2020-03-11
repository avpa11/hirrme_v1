import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import { IoMdPaper } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';

class Vacancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loading: false,
            savedVacanciesInvisible: true
        };
    }

    componentDidMount() {
        if (this.props.authUser) {
            this.props.firebase.database().ref.child('companies').orderByChild('email').equalTo(this.props.authUser.email).once('value', snap => {
                if (!snap.exists()) {
                    this.setState({ savedVacanciesInvisible: false })
                }
            });
        }

        this.fetchVacanciesData();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var id = 0;

        var vacanciesByTitle = this.props.firebase.database().child('vacancies').ref;

        vacanciesByTitle.on('value', snap => {
            if (document.getElementById('vacanciesList') != null) {
                document.getElementById('vacanciesList').innerHTML = '';
            }
            snap.forEach(snap => {
                snap.forEach(snap1 => {
                    id++;

                    if (snap1.child('positionTitle').val().toLowerCase().indexOf(this.state.search) >= 0 ||
                        snap1.child('sector').val().toLowerCase().indexOf(this.state.search) >= 0 ||
                        snap1.child('description').val().toLowerCase().indexOf(this.state.search) >= 0 ||
                        snap1.child('requirements').val().toLowerCase().indexOf(this.state.search) >= 0 ||
                        snap1.child('keyResponsibilities').val().toLowerCase().indexOf(this.state.search) >= 0 ||
                        snap1.child('type').val().toLowerCase().indexOf(this.state.search) >= 0) {

                        var div = document.createElement('div');
                        div.setAttribute('id', id);
                        div.setAttribute('class', 'vacancy');
                        if (document.getElementById('vacanciesList') != null) {
                            document.getElementById('vacanciesList').appendChild(div);

                            ReactDOM.render(<VacancyObject
                                vacancyTitle={snap1.child('positionTitle').val()}
                                sector={snap1.child('sector').val()}
                                type={snap1.child('type').val()}
                                salaryType={snap1.child('salaryType').val()}
                                salary={snap1.child('salary').val()}
                                city={snap1.child('city').val()}
                                province={snap1.child('province').val()}
                                country={snap1.child('country').val()}
                                contactInfo={snap1.child('contactInfo').val()}
                                description={snap1.child('description').val()}
                                keyResponsibilities={snap1.child('keyResponsibilities').val()}
                                requirements={snap1.child('requirements').val()}
                                authUser={this.state.authUser}
                                firebase={this.props.firebase}
                                userId={snap.key}
                            />, document.getElementById(id));
                        }
                    }
                })
            })
        })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };


    fetchVacanciesData() {
        if (this.props.authUser && this.props.savedVacancies.length === 0) {
            this.props.firebase.savedVacancies().orderByChild('email').equalTo(this.props.authUser.email).on('value', snap => {
                this.props.onSetSavedVacancies(snap.val());
            })
            this.props.firebase.vacanciesApplications().orderByChild('userEmail').equalTo(this.props.authUser.email).on('value', snap => {
                this.props.onSetAppliedVacancies(snap.val());
            })
        }

        if (this.props.vacancies.length === 0) {
            this.props.firebase.vacancies().on('value', snap => {
                this.props.onSetVacancies(snap.val());
            })
        }

        this.setState({ loading: false });

        this.displayVacancies();
    }

    displayVacancies = () => {

        let vacanciesData = this.props.vacancies;
        let savedVacanciesData = this.props.savedVacancies;
        let appliedVacanciesData = this.props.appliedVacancies;
        let userType = this.props.userType;

        if (document.getElementById('vacanciesList') != null) {
            document.getElementById('vacanciesList').innerHTML = '';
        }

        var id = 0;

        for (var i in vacanciesData) {
            var companyData = vacanciesData[i];

            for (var vacancy in companyData) {
                if (companyData[vacancy].hasOwnProperty('positionTitle')) {
                    id++;

                    var div = document.createElement('div');
                    div.setAttribute('id', id);
                    div.setAttribute('class', 'vacancy');
                    if (document.getElementById('vacanciesList') != null) {
                        document.getElementById('vacanciesList').appendChild(div);

                        ReactDOM.render(<VacancyObject
                            vacancyData={companyData[vacancy]}
                            savedVacanciesData={savedVacanciesData}
                            appliedVacanciesData={appliedVacanciesData}
                            userType={userType}
                            authUser={this.props.authUser}
                            firebase={this.props.firebase}

                        />, document.getElementById(id));
                    }
                }
            }
        }
    }

    componentDidUpdate = (nextProps) => {
        if (this.props !== nextProps) {
            this.displayVacancies()
        }
    }

    render() {
        const { search } = this.state;
        return (
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Vacancies</h4>
                <Form onSubmit={e => this.handleSubmit(e)} inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                    <div className="input-group-prepend" style={{ backgroundColor: 'none', borderColor: "#FFC107" }}>
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <FormControl value={search} onChange={this.handleChange} name="search" type="text" placeholder="Keyword or Title" className="mr-sm-2" style={{ borderColor: "#FFC107" }} />
                    </div>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <FaSearchLocation />
                        </span>
                        <FormControl disabled={true} type="text" placeholder="BC, Canada" className="mr-sm-2" style={{ borderColor: "#FFC107" }} />
                    </div>
                    <Button variant="warning"
                        type="submit">
                        Search
                    </Button>
                    <Nav>
                        <Nav.Link as={Link} to="/savedVacancies"><Button disabled={this.state.savedVacanciesInvisible} variant="warning">Saved Vacancies</Button></Nav.Link>
                    </Nav>
                </Form>
                <p id='vacanciesList'></p>
            </div>
        )
    }
}

class VacancyObject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "none",
            displayButton: "Expand",
            isSaveDisabled: true,
            saveStatus: 'Save',
            applyStatus: 'Apply',
            applyVariant: 'primary',
            show: false,
            modalText: 'Have something to say/show/attach? Do it here',
        };
    }

    componentDidMount = () => {

        if (this.props.authUser != null) {
            if (this.props.userType === 'jobSeeker') {
                this.setState({ isSaveDisabled: false })
            }
            this.props.savedVacanciesData.forEach(savedVacancyData => {
                if (savedVacancyData.email === this.props.authUser.email &&
                    savedVacancyData.positionTitle === this.props.vacancyData.positionTitle &&
                    savedVacancyData.contactInfo === this.props.vacancyData.contactInfo) {
                    this.setState({ saveStatus: 'Remove' })
                }
            });
            this.appliedVacancies();
        }
    }

    handleLike = (e) => {
        e.preventDefault();

        this.props.authUser != null ? (this.state.saveStatus === 'Save' ? this.saveVacancy() : this.removeVacancy()) : window.alert("You need to log in to leave a like")
    }

    saveVacancy = () => {
        this.props.firebase.database().child('savedVacancies').push({
            positionTitle: this.props.vacancyData.positionTitle,
            contactInfo: this.props.vacancyData.contactInfo,
            email: this.props.authUser.email,
            date: (new Date()).toISOString().split('T')[0],
        })
            .then(this.setState({ saveStatus: 'Remove' }))
            .catch(error => console.log(error));
    }

    removeVacancy = () => {
        var savedVacanciesRef = this.props.firebase.database().child('savedVacancies').ref;

        savedVacanciesRef.once('value', snap => {
            snap.forEach(snap1 => {
                if (snap1.child('email').val() === this.props.authUser.email &&
                    snap1.child('positionTitle').val() === this.props.vacancyData.positionTitle &&
                    snap1.child('contactInfo').val() === this.props.vacancyData.contactInfo) {
                    savedVacanciesRef.child(snap1.key).remove()
                        .then(this.setState({ saveStatus: 'Save' }))
                        .catch(error => console.log(error));
                }
            })
        })
    }

    appliedVacancies = () => {

        this.props.appliedVacanciesData.forEach(appliedVacancyData => {
                if (appliedVacancyData.userEmail === this.props.authUser.email &&
                    appliedVacancyData.positionTitle === this.props.vacancyData.positionTitle &&
                    appliedVacancyData.contactInfo === this.props.vacancyData.contactInfo) {
                    this.setState({
                        applyStatus: 'Applied',
                        applyVariant: 'success'
                    })

                }
        })
    }

    showAllInfo = () => {
        if (this.state.display === 'none') {
            this.setState({ display: "contents" });
            this.setState({ displayButton: "Hide" })

        } else {
            this.setState({ display: "none" });
            this.setState({ displayButton: "Expand" })
        }
    }

    render() {

        const handleClose = () => this.setState({ show: false });
        const handleShow = () => this.setState({ show: true });

        const applyForJob = () => {
            this.props.firebase.vacanciesApplications().push({
                positionTitle: vacancyData.positionTitle,
                userId: this.props.authUser.uid,
                userEmail: this.props.authUser.email,
                attachedFile: 'linkToFile',
                date: (new Date()).toISOString().split('T')[0],
                contactInfo: this.props.vacancyData.contactInfo,
            })
                .then(this.setState({
                    applyStatus: 'Applied',
                    modalText: 'Done! Wish you luck',
                    applyVariant: 'success'
                }))
                .then(setTimeout(handleClose, 2000))
                .catch(error => { console.log(error) });
        }

        let vacancyData = this.props.vacancyData;

        return (
            <div>
                <div style={{ display: 'table' }}>
                    <div style={{ float: 'left', margin: '0 2em 0 1em' }}>
                        <IoMdPaper size={180} />
                    </div>
                    <div style={{ float: 'left', maxWidth: '25em', minWidth: '25em', margin: '0 2em', textAlign: 'left' }}>
                        <h4>{vacancyData.positionTitle}</h4>
                        <h5>{vacancyData.sector}</h5>
                        <h5>{vacancyData.type}</h5>
                        <h6>{vacancyData.city}, {vacancyData.province}, {vacancyData.country}</h6>
                    </div>

                    <Modal show={this.state.show} onHide={handleClose} size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header>
                            <Modal.Title>Want to attach anything?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Add styling in the future */}
                            <div style={{ textAlign: 'center' }}>
                                <h4>{this.state.modalText}</h4>
                                <br />
                                <input type="file" id="myfile" name="myfile"></input>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Button variant="secondary" onClick={handleClose} style={{ margin: '0.25em' }}>
                                    Close
                            </Button>
                                <Button variant="primary" onClick={applyForJob} >
                                    Apply
                            </Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <div style={{ float: 'left', margin: '0 2em' }}>
                        <Button onClick={this.showAllInfo} variant="primary">{this.state.displayButton}</Button> <span />
                        <Button onClick={this.state.applyStatus === 'Apply' ? handleShow : null} variant={this.state.applyVariant} disabled={this.state.isSaveDisabled}>{this.state.applyStatus}</Button> <span />
                        <Button onClick={e => this.handleLike(e)} variant="danger" disabled={this.state.isSaveDisabled}>{this.state.saveStatus}</Button>
                    </div>
                </div>
                <div style={{ display: this.state.display, textAlign: 'left' }}>
                    <div style={{ margin: '2em' }}>
                        <h4>Description</h4>
                        <h6>{vacancyData.description}</h6>
                        <h4>Responsibilities</h4>
                        <h6>{vacancyData.keyResponsibilities}</h6>
                        <h4>Requirements</h4>
                        <h6>{vacancyData.requirements}</h6>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    vacancies: Object.keys(state.vacanciesState.vacancies || {}).map(key => ({
        ...state.vacanciesState.vacancies[key],
        uid: key,
    })),
    savedVacancies: Object.keys(state.savedVacanciesState.savedVacancies || {}).map(key => ({
        ...state.savedVacanciesState.savedVacancies[key],
        uid: key,
    })),
    appliedVacancies: Object.keys(state.appliedVacanciesState.appliedVacancies || {}).map(key => ({
        ...state.appliedVacanciesState.appliedVacancies[key],
        uid: key,
    })),
    userType: state.userTypeState.userType,
    authUser: state.sessionState.authUser,
});

const mapDispatchToProps = dispatch => ({
    onSetVacancies: vacancies => dispatch({ type: 'VACANCIES_SET', vacancies }),
    onSetSavedVacancies: savedVacancies => dispatch({ type: 'SAVED_VACANCIES_SET', savedVacancies }),
    onSetAppliedVacancies: appliedVacancies => dispatch({ type: 'APPLIED_VACANCIES_SET', appliedVacancies })
});

export default compose(withFirebase, connect(
    mapStateToProps,
    mapDispatchToProps,
))(Vacancies);

export { VacancyObject };

