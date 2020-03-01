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

const mapStateToProps = state => ({
    vacancies: Object.keys(state.vacanciesState.vacancies || {}).map(key => ({
        ...state.vacanciesState.vacancies[key],
        uid: key,
    })),
    savedVacancies: Object.keys(state.savedVacanciesState.savedVacancies || {}).map(key => ({
        ...state.savedVacanciesState.savedVacancies[key],
        uid: key,
    })),
    authUser: state.sessionState.authUser,
});

const mapDispatchToProps = dispatch => ({
    onSetVacancies: vacancies => dispatch({ type: 'VACANCIES_SET', vacancies }),
    onSetSavedVacancies: savedVacancies => dispatch({ type: 'SAVED_VACANCIES_SET', savedVacancies })
});

class Vacancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // authUser: this.props.firebase.auth.currentUser,
            search: '',
            loading: false,

        };
    }

    componentDidMount() {
        this.displayVacancies();
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


    displayVacancies() {
        // this.props.firebase.auth.onAuthStateChanged(authUser => {
        //     authUser != null ? this.setState({ authUser }) : this.setState({ authUser: null })
        // })

        var savedVacanciesRef = this.props.firebase.database().ref.child('savedVacancies').ref;

        savedVacanciesRef.on('value', snap => {
            this.props.onSetSavedVacancies(snap.val());
        })

        let savedVacanciesData = this.props.savedVacancies;

        var id = 0;

        var vacanciesRef = this.props.firebase.database().child('vacancies').ref;

        vacanciesRef.on('value', snap => {

            this.props.onSetVacancies(snap.val());
            // ¯\_(ツ)_/¯
            this.setState({ loading: false });

            if (document.getElementById('vacanciesList') != null) {
                document.getElementById('vacanciesList').innerHTML = '';
            }

            let vacanciesData = this.props.vacancies;

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

                            ReactDOM.render(<VacancyObject vacancyData={companyData[vacancy]} savedVacanciesData={savedVacanciesData} authUser={this.props.authUser} firebase={this.props.firebase} />, document.getElementById(id));
                        }
                    }
                }
            }
        })
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
            saveStatus: 'Save'
        };
    }

    componentDidMount = () => {
        // var savedVacancies = this.state.firebase.database().child('savedVacancies').ref;

        if (this.props.authUser != null) {
            this.props.firebase.database().ref.child('companies').orderByChild('email').equalTo(this.props.authUser.email).once('value', snap => {
                if (!snap.exists()) {
                    this.setState({ isSaveDisabled: false })
                }
            });
            this.props.savedVacanciesData.forEach(savedVacancyData => {
                if (savedVacancyData.email === this.props.authUser.email &&
                    savedVacancyData.positionTitle === this.props.vacancyData.positionTitle &&
                    savedVacancyData.positionTitle === this.props.vacancyData.positionTitle) {
                    this.setState({ saveStatus: 'Remove' })
                }
            });
        }

        // if (this.state.authUser !== null) {
        //     likedVacancies.on('value', snap => {
        //         snap.forEach(snap1 => {
        //             if (snap1.child('email').val() === this.state.authUser.email &&
        //                 snap1.child('vacancyTitle').val() === this.props.vacancyTitle &&
        //                 snap1.child('contactInfo').val() === this.props.contactInfo) {
        //                 this.setState({ likeStatus: 'Dislike' })
        //             }
        //         })
        //     })
        // }
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

        let vacancyData = this.props.vacancyData;
        // console.log( "d ", vacancyData);

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
                    <div style={{ float: 'left', margin: '0 2em' }}>
                        <Button onClick={this.showAllInfo} variant="primary">{this.state.displayButton}</Button> <span />
                        <Button variant="primary">Send Email</Button> <span />
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

export default compose(withFirebase, connect(
    mapStateToProps,
    mapDispatchToProps,
))(Vacancies);