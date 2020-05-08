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

import cardStyle from '../styles/HomePageCardsStyle.module.css';
import JobSeekerStyle from '../styles/JobSeekerStyle.module.css';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            v_Title: [],
            v_Type: [],
            v_City: [],
            v_Province: [],
            v_Country: [],
            v_CompanyName: [],
            v_CompanyImage: [],
            js_FirstName: [],
            js_LastName: [],
            js_Province: [],
            js_City: [],
            js_Title: [],
            js_ProfileImage: [],
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
        var companyName, companyImage;
        var vacanciesRef = this.props.firebase.database().child('vacancies').ref;
        vacanciesRef.on('value', snap => {
            snap.forEach(snap1 => {
                console.log(snap1.key);
                let ref = this.props.firebase.database().child('companies').orderByChild('companyId').equalTo(snap1.key);
                ref.once('value', snap2 => {
                    snap2.forEach(snap3 => {
                        companyName = snap3.child('name').val();
                        companyImage = snap3.child('profileImage').val();
                        snap1.forEach(snap2 => {
                            this.setState(state => {
                                const v_Title = state.v_Title.concat(snap2.child('positionTitle').val());
                                const v_Type = state.v_Type.concat(snap2.child('type').val());
                                const v_City = state.v_City.concat(snap2.child('city').val());
                                const v_Province = state.v_Province.concat(snap2.child('province').val());
                                const v_Country = state.v_Country.concat(snap2.child('counrty').val());
                                const v_CompanyName = state.v_CompanyName.concat(companyName);
                                const v_CompanyImage = state.v_CompanyImage.concat(companyImage);
                                return { v_Title, v_Type, v_City, v_Province, v_Country, v_CompanyName, v_CompanyImage }
                            });
                        })
                    })
                })                
            })
        })
    }

    displayJobSeekers = () => {
        var jobSeekersRef = this.props.firebase.database().child('users').orderByChild('incognito')
            .equalTo(null);
        jobSeekersRef.on('value', snap => {
            snap.forEach(snap1 => {

                let profilePicture;

                if (snap1.child('profileImage').val() !== null) {
                    profilePicture = snap1.child('profileImage').val();
                }
                else {
                    profilePicture = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png';
                }

                this.setState(state => {
                    const js_FirstName = state.js_FirstName.concat(snap1.child('firstName').val());
                    const js_LastName = state.js_LastName.concat(snap1.child('lastName').val());
                    const js_Title = state.js_Title.concat(snap1.child('title').val());
                    const js_City = state.js_City.concat(snap1.child('city').val());
                    const js_Province = state.js_Province.concat(snap1.child('province').val());
                    const js_ProfileImage = state.js_ProfileImage.concat(profilePicture);
                    return { js_FirstName, js_LastName, js_City, js_Province, js_Title, js_ProfileImage }
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
                                    <div className={cardStyle.card} key={i}>
                                        <VacancyFromHomePage
                                            type={this.state.v_Type[i]}
                                            title={this.state.v_Title[i]}
                                            city={this.state.v_City[i]}
                                            province={this.state.v_Province[i]}
                                            country={this.state.v_Country[i]}
                                            companyName={this.state.v_CompanyName[i]}
                                            companyImage={this.state.v_CompanyImage[i]} />
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
                                    <div className={cardStyle.card} key={i}>
                                        <JobSeekerFromHomePage
                                            firstName={this.state.js_FirstName[i]}
                                            lastName={this.state.js_LastName[i]}
                                            city={this.state.js_City[i]}
                                            title={this.state.js_Title[i]}
                                            province={this.state.js_Province[i]}
                                            profileImage={this.state.js_ProfileImage[i]} />
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
                                <Button type="submit" id='buttonSubscribeForEmails' className="btn btn-warning" style={{ backgroundColor: '#FFAC11', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }} >
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

const VacancyFromHomePage = (props) => {

    return (
        <div>
            <Nav.Link as={Link} to="/vacancies" className={cardStyle.navLink} style={{ padding: '0', margin: '0' }}>
                <p id={cardStyle.orangeText}>#{props.type}</p>
                <h5>{props.title}</h5>
                <p>{props.city}{props.province ? ', ' + props.province : ''}</p>
                <p><img id={cardStyle.icon} src={props.companyImage ? props.companyImage : require('../img/companyIcon.png')}></img> {props.companyName}</p>
            </Nav.Link>
        </div>
    );
};

const JobSeekerFromHomePage = (props) => {

    // No such a thing in user profile ¯\_(ツ)_/¯

    let randomWorkTypes = {
        types: ['full-time', 'part-time', 'contract']
    }

    let randomNum = Math.floor(Math.random() * 3);

    return (
        <div>
            <Nav.Link as={Link} to="/jobSeekers/" className={cardStyle.navLink} style={{ padding: '0', margin: '0' }}>
                <p id={cardStyle.orangeText}>#{randomWorkTypes.types[randomNum]}</p>
                <h5>{props.firstName} {props.lastName}</h5>
                <p>{props.title}</p>
                <p><img id={cardStyle.icon} src={props.profileImage}></img>{props.city}{props.province ? ', ' + props.province : ''}</p>
            </Nav.Link>
        </div>
    );
};

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