import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Video from '../components/Video';
// import { FaSearch, FaSearchLocation } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { IoMdPaperPlane } from "react-icons/io";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { withFirebase } from './Firebase';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Carousel from 'react-elastic-carousel';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vacanciesTitle: [],
            sector: [],
            type: [],
            salaryType: [],
            salary: [],
            firstName: [],
            lastName: [],
            title: [],
            email: [],
            city: [],
            province: [],
            country: [],
            searchParameterVacancies: '',
            searchParameterJobSeekers: '',
        };
        this.breakPoints = [
            { width: 1, itemsToShow: 1 },
            { width: 550, itemsToShow: 3, itemsToScroll: 3 },
            { width: 850, itemsToShow: 3 },
            { width: 1150, itemsToShow: 4, itemsToScroll: 2 },
            { width: 1450, itemsToShow: 5 },
            { width: 1750, itemsToShow: 6 },
        ]
    }

    subscribeForSpam = e => {

        e.preventDefault();

        var email = document.getElementById('emailInput').value;

        if (email) {
            this.props.firebase.subscriptions().push({
                email: email
            })
            document.getElementById('emailInput').value = "";
        }
    }

    displayVacancies = () => {
        var vacanciesRef = this.props.firebase.database().child('vacancies').ref;
        vacanciesRef.on('value', snap => {
            snap.forEach(snap1 => {
                snap1.forEach(snap2 => {

                    this.setState(state => {
                        const vacanciesTitle = state.vacanciesTitle.concat(snap2.child('positionTitle').val());
                        const sector = state.sector.concat(snap2.child('sector').val());
                        const type = state.type.concat(snap2.child('type').val());
                        const salaryType = state.salaryType.concat(snap2.child('salaryType').val());
                        const salary = state.salary.concat(snap2.child('salary').val());
                        return { vacanciesTitle, sector, type, salaryType, salary }
                    });
                })
            })
        })
    }

    displayJobSeekers = () => {
        var jobSeekersRef = this.props.firebase.database().child('users').orderByChild('incognito')
            .equalTo(null);
        jobSeekersRef.on('value', snap => {
            snap.forEach(snap1 => {

                this.setState(state => {
                    const firstName = state.firstName.concat(snap1.child('firstName').val());
                    const lastName = state.lastName.concat(snap1.child('lastName').val());
                    const title = state.title.concat(snap1.child('title').val());
                    const email = state.email.concat(snap1.child('email').val());
                    const city = state.city.concat(snap1.child('city').val());
                    const province = state.province.concat(snap1.child('province').val());
                    const country = state.country.concat(snap1.child('country').val());
                    return { firstName, lastName, title, email, city, province, country }
                });
            })
        })
    }

    loadDataToState = () => {
        if (this.props.users.length === 0) {
            this.props.firebase.users().orderByChild('incognito').equalTo(null).on('value', snap => {
                this.props.onSetUsers(snap.val());
            })
        }

        if (this.props.vacancies.length === 0) {
            this.props.firebase.vacancies().on('value', snap => {
                this.props.onSetVacancies(snap.val());
            })
        }
    }

    componentDidMount = () => {
        this.displayVacancies();
        this.displayJobSeekers();
        this.loadDataToState();
    }

    goToVacancies = () => {
        this.props.history.push({
            pathname: `vacancies`,
            searchParameter: this.state.searchParameterVacancies
        })
    }

    goToJobSeekers = () => {
        this.props.history.push({
            pathname: `jobseekers`,
            searchParameter: this.state.searchParameterJobSeekers
        })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        let { searchParameterVacancies } = this.state;
        let { searchParameterJobSeekers } = this.state;

        return (

            <div>
                <Video />
                <br />
                <div className="container" style={{ zIndex: 1 }}>
                    <div id='homePageHeader'>
                        <h1 className="text-center">Seacrh for a job at Hirr.me</h1>
                    </div>

                    <div>
                        <Form inline className='searchForm'>
                            <div className="input-group-prepend" style={{ backgroundColor: 'none', borderColor: "#FFC107" }}>
                                <FormControl className='searchBoxes mr-sm-2 keywordInput' type="text" value={searchParameterVacancies} name="searchParameterVacancies" placeholder=" &#xF002; Keyword or Title" onChange={this.handleChange} />
                            </div>
                            <div className="input-group-prepend">
                                <FormControl className='searchBoxes mr-sm-2 placeInput' disabled={true} type="text" placeholder=" &#xf015; BC, Canada" />
                            </div>
                            <Button variant="warning" className='searchButton'
                                onClick={this.goToVacancies}>
                                Search
                    </Button>
                        </Form>
                    </div>

                    <div className="container" style={{ maxWidth: '60em' }}>
                        <Carousel breakPoints={this.breakPoints}>
                            {Array.apply(null, Array(6)).map(function (item, i) {
                                return (
                                    <div className="rectangle" style={{ padding: '1em 1em 2em 1em' }} key={i}>
                                        <div className="card_inside" style={{ margin: 'auto', display: 'table', textAlign: 'left', verticalAlign: 'center' }}>
                                            <p style={{ fontWeight: "bold" }}>{this.state.vacanciesTitle[i] ? this.state.vacanciesTitle[i] : "Coming soon"}</p>
                                            <p className="cardText">Sector: {this.state.sector[i] ? this.state.sector[i] : "Coming soon"}</p>
                                            <p className="cardText">Type: {this.state.type[i] ? this.state.type[i] : "Coming soon"}</p>
                                            <p className="cardText">Salary Type: {this.state.salaryType[i] ? this.state.salaryType[i] : "Coming soon"}</p>
                                            <p className="cardText">Salary: ${this.state.salary[i] ? this.state.salary[i] : "Coming soon"}</p>
                                            <Nav>
                                                <Nav.Link as={Link} to="/vacancies"><Button variant="primary" size="sm">View vacancy</Button> </Nav.Link>
                                            </Nav>
                                        </div>
                                    </div>
                                );
                            }, this)}
                        </Carousel>

                        <br /> <br /><br /><br />
                        <h1 className="text-center">Seacrh for workers at Hirr.me</h1>
                        <Form inline className='searchForm'>
                            <div className="input-group-prepend" style={{ backgroundColor: 'none', borderColor: "#FFC107" }}>
                                <FormControl className='searchBoxes mr-sm-2 keywordInput' type="text" value={searchParameterJobSeekers} name="searchParameterJobSeekers" placeholder=" &#xF002; Name, Keyword or Title" onChange={this.handleChange} />
                            </div>
                            <div className="input-group-prepend">
                                <FormControl className='searchBoxes mr-sm-2 placeInput' disabled={true} type="text" placeholder=" &#xf015; BC, Canada" />
                            </div>
                            <Button variant="warning" className='searchButton'
                                onClick={this.goToJobSeekers}>
                                Search
                    </Button>
                        </Form>
                        <Carousel breakPoints={this.breakPoints}>
                            {Array.apply(null, Array(6)).map(function (item, i) {
                                return (
                                    <div className="rectangle" style={{ padding: '1em 1em 2em 1em' }} key={i}>
                                        <div className="card_inside" style={{ margin: 'auto', display: 'table', textAlign: 'left', verticalAlign: 'center' }}>
                                            <p style={{ fontWeight: "bold" }}>{this.state.firstName[i]} {this.state.lastName[i]}</p>
                                            <p className="cardText">Title: {this.state.title[i]}</p>
                                            <p className="cardText">Email: {this.state.email[i]}</p>
                                            <p className="cardText">From: {this.state.city[i]}</p>
                                            <Nav>
                                                <Nav.Link as={Link} to="/jobseekers"><Button variant="primary" size="sm">View profile</Button> </Nav.Link>
                                            </Nav>
                                        </div>
                                    </div>
                                );
                            }, this)}
                        </Carousel>
                    </div>
                </div>
                {/* Contact footer */}
                <div id='contactFooter'>
                    <div className="row">
                        <div className="col" id='footer_top'>
                            <img src={require('../img/paper_plane_orange.png')} alt='paper_plane_orange.png'></img>
                            <h2>Subscribe to receive updates!</h2>
                        </div>
                    </div>
                    <div className="inputs">
                        <Form onSubmit={this.subscribeForSpam}>
                            <div className="input-group-prepend" id='subscriptionForm'>
                                <FormControl type="email" id="emailInput" placeholder="&#xf0e0;  Enter your email address..." style={{ fontFamily: "FontAwesome" }} className="form-control" />
                                <Button type="submit" id='buttonSubscribeForEmails' className="btn btn-warning" style={{ backgroundColor: '#FFAC11' }} >
                                    Subscribe
                            </Button>
                            </div>
                        </Form>
                    </div>
                    <div className="row" id="rectangleRow">
                        <div className="rectangle">
                            <img src={require('../img/email_icon.png')} alt='email_icon.png'></img>
                            <hr />
                            <h5>hirr.me@gmail.com</h5>
                        </div>
                        <div className="rectangle">
                            <img src={require('../img/phone_icon.png')} alt='phone_icon.png'></img>
                            <hr />
                            <h5>+1 (604) 635-3726</h5>
                        </div>
                        <div className="rectangle">
                            <img src={require('../img/location_icon.png')} alt='location_icon.png'></img>
                            <hr />
                            <h5>123 Pender St. <br /> Vancouver </h5>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    users: Object.keys(state.usersState.users || {}).map(key => ({
        ...state.usersState.users[key],
        uid: key,
    })),
    vacancies: Object.keys(state.vacanciesState.vacancies || {}).map(key => ({
        ...state.vacanciesState.vacancies[key],
        uid: key,
    })),
    authUser: state.sessionState.authUser,
});

const mapDispatchToProps = dispatch => ({
    onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
    onSetVacancies: vacancies => dispatch({ type: 'VACANCIES_SET', vacancies }),
});

// export default withFirebase(Home);
export default compose(withFirebase, connect(
    mapStateToProps,
    mapDispatchToProps,
))(Home);