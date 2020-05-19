import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { VacancyObject } from './Vacancies'

class SavedVacancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: this.props.firebase.auth.currentUser,
            search: '',
        };
    }

    componentDidMount() {
        this.props.authUser ? this.displayVacanciesWithSearchParameter('') : window.location.replace("/");
    }

    componentDidUpdate = (nextProps) => {
        if (this.props !== nextProps) {
            this.displayVacanciesWithSearchParameter('')
        }
    }

    handleSubmit = (e) => {
        alert('In development');
        e.preventDefault();
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        this.displayVacanciesWithSearchParameter(e.target.value);
    };


    displayVacanciesWithSearchParameter = searchParameterArg => {

        let vacanciesData = this.props.vacancies;
        let savedVacanciesData = this.props.savedVacancies;
        let userType = this.props.userType;
        let appliedVacanciesData = this.props.appliedVacancies;

        let searchParameter = searchParameterArg.toLowerCase();

        if (document.getElementById('savedVacanciesList') != null) {
            document.getElementById('savedVacanciesList').innerHTML = '';
        }

        var id = 0;
        let k = 0;


        for (var i in vacanciesData) {
            var companyData = vacanciesData[i];

            let ref = this.props.firebase.database().child('companies').orderByChild('companyId').equalTo(companyData.uid);
            ref.once('value', snap2 => {
                snap2.forEach(snap3 => {
                    let companyName = snap3.child('name').val();
                    let companyImage = snap3.child('profileImage').val();

                    k = 0;

                    let key = Object.keys(companyData);

                    for (var vacancy in companyData) {
                        if (companyData[vacancy].hasOwnProperty('positionTitle')) {

                            for (var j in savedVacanciesData) {
                                var savedVacancyData = savedVacanciesData[j];
                                if (savedVacancyData.email === this.props.authUser.email &&
                                    savedVacancyData.positionTitle === companyData[vacancy].positionTitle &&
                                    savedVacancyData.contactInfo === companyData[vacancy].contactInfo) {
                                    if (companyData[vacancy].positionTitle.toLowerCase().indexOf(searchParameter) >= 0 ||
                                        companyData[vacancy].sector.toLowerCase().indexOf(searchParameter) >= 0 ||
                                        companyData[vacancy].type.toLowerCase().indexOf(searchParameter) >= 0 ||
                                        companyData[vacancy].city.toLowerCase().indexOf(searchParameter) >= 0 ||
                                        companyData[vacancy].positionTitle.toLowerCase().indexOf(searchParameter) >= 0) {

                                        id++;

                                        var div = document.createElement('div');
                                        div.setAttribute('id', id);
                                        div.setAttribute('class', 'vacancy');
                                        if (document.getElementById('savedVacanciesList') != null) {
                                            document.getElementById('savedVacanciesList').appendChild(div);

                                            ReactDOM.render(<VacancyObject
                                                vacancyKey={key[k++]}
                                                vacancyData={companyData[vacancy]}
                                                savedVacanciesData={savedVacanciesData}
                                                appliedVacanciesData={appliedVacanciesData}
                                                authUser={this.props.authUser}
                                                userType={userType}
                                                profileImage={companyImage}
                                                companyName={companyName}
                                                firebase={this.props.firebase}
                                            />, document.getElementById(id));
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            })
        }
    }

    render() {
        const { searchParameter } = this.state;
        return (
            <div className="container" style={{ marginTop: "120px", width: '55%' }}>
                <Form onSubmit={e => this.handleSubmit(e)} inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                    <div className="input-group-prepend col-lg-5 col-6 col-sm-5" style={{ backgroundColor: 'none', borderColor: "#FFC107" }}>
                        <FormControl value={searchParameter} onChange={this.handleChange} name="searchParameter" type="text" placeholder=" &#xF002; Keyword or Title" className="mr-sm-2 searchBoxes" style={{ borderColor: "#FFC107", width: '100%' }} />
                    </div>
                    <div className="input-group-prepend col-lg-4 col-6 col-sm-4">
                        <FormControl disabled={true} type="text" placeholder=" &#xf015; BC, Canada" className="mr-sm-2 searchBoxes" style={{ borderColor: "#FFC107", width: '100%' }} />
                    </div>

                    <Nav className="col-lg-3 col-6 col-sm-3">
                        <Nav.Link as={Link} to="/vacancies"><Button className='searchButton' variant="warning">Vacancies</Button></Nav.Link>
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