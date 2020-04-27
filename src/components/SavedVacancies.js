import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
// import { FaSearch, FaSearchLocation } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
// import FormControl from 'react-bootstrap/FormControl';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { VacancyObject } from './Vacancies'

// Fix applied vacancies

class SavedVacancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: this.props.firebase.auth.currentUser,
            search: '',
        };
    }

    componentDidMount() {
        this.props.authUser ? this.displaySavedVacancies() : window.location.replace("/");
    }

    componentDidUpdate = (nextProps) => {
        if (this.props !== nextProps) {
            this.displaySavedVacancies()
        }
    }

    handleSubmit = (e) => {
        alert('In development');
        e.preventDefault();
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };


    displaySavedVacancies() {

        let vacanciesData = this.props.vacancies;
        let savedVacanciesData = this.props.savedVacancies;
        let userType = this.props.userType;
        let appliedVacanciesData = this.props.appliedVacancies;


        if (document.getElementById('savedVacanciesList') != null) {
            document.getElementById('savedVacanciesList').innerHTML = '';
        }

        var id = 0;

        for (var i in vacanciesData) {
            var companyData = vacanciesData[i];
            for (var vacancy in companyData) {
                if (companyData[vacancy].hasOwnProperty('positionTitle')) {
                    for (var j in savedVacanciesData) {
                        var savedVacancyData = savedVacanciesData[j];
                        if (savedVacancyData.email === this.props.authUser.email &&
                            savedVacancyData.positionTitle === companyData[vacancy].positionTitle &&
                            savedVacancyData.contactInfo === companyData[vacancy].contactInfo) {
                            id++;

                            var div = document.createElement('div');
                            div.setAttribute('id', id);
                            div.setAttribute('class', 'vacancy');
                            if (document.getElementById('savedVacanciesList') != null) {
                                document.getElementById('savedVacanciesList').appendChild(div);

                                ReactDOM.render(<VacancyObject
                                    vacancyData={companyData[vacancy]}
                                    savedVacanciesData={savedVacanciesData}
                                    appliedVacanciesData={appliedVacanciesData}
                                    authUser={this.props.authUser}
                                    userType={userType}
                                    firebase={this.props.firebase}
                                />, document.getElementById(id));
                            }
                        }
                    }
                }
            }
        }
    }

    render() {
        // const { search } = this.state;
        return (
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Saved Vacancies</h4>
                <Form onSubmit={e => this.handleSubmit(e)} inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                    {/* <div className="input-group-prepend" style={{ backgroundColor: 'none', borderColor: "#FFC107" }}>
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
                    </Button> */}
                    <Nav>
                        <Nav.Link as={Link} to="/vacancies"><Button variant="warning">Vacancies</Button></Nav.Link>
                    </Nav>
                </Form>
                <p id='savedVacanciesList'></p>
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

export default compose(withFirebase, connect(
    mapStateToProps,
))(SavedVacancies);