import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import ReactDOM from 'react-dom';
import { IoMdPaper } from "react-icons/io";
import Button from 'react-bootstrap/Button';

class Vacancies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {
        this.displayVacancies('positionTitle')
    }


    displayVacancies(order) {
        this.props.firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState({ authUser })
                : this.setState({ authUser: null });
        })

        var id = 0;

        var vacanciesRef = this.props.firebase.database().child('vacancies').ref;

        vacanciesRef.on('value', snap => {
            if (document.getElementById('vacanciesList') != null) {
                document.getElementById('vacanciesList').innerHTML = '';
            }
            snap.forEach(snap => {
                snap.forEach(snap1 => {
                    id++;

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
                            authUser={this.state.authUser != null ? this.state.authUser.uid : null}
                            authEmail={this.state.authUser != null ? this.state.authUser.email : null}
                            firebase={this.props.firebase}
                            userId={snap.key}
                        />, document.getElementById(id));
                    }
                })
            })
        })
    }



    render() {
        return (
            <div className="container" style={{ marginTop: "120px" }}>
                <h4 className="text-center">Vacancies</h4>
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
            displayButton: "Expand"
        };
    }

    handleLike = (e, userId, authUser, firebase, email) => {
        e.preventDefault();
        if (authUser != null) {
            firebase.like(userId).push({
                accountId: authUser,
                email: email,
                date: (new Date()).toISOString().split('T')[0],
            })
                .then(window.alert("Thank you for the like"))
                .catch(error => console.log(error));
        } else {
            window.alert("You need to log in to leave a like")
        }
    }

    showAllInfo = () => {
        if (this.state.display === 'none') {
            this.setState({ display: "contents" });
            this.setState({ displayButton: "Hide" })
        }
        else {
            this.setState({ display: "none" });
            this.setState({ displayButton: "Expand" })
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'table' }}>
                    <div style={{ float: 'left', margin: '0 2em 0 1em' }}>
                        <IoMdPaper size={180} />
                    </div>
                    <div style={{ float: 'left', maxWidth: '25em', minWidth: '25em', margin: '0 2em', textAlign: 'left' }}>
                        <h4>{this.props.vacancyTitle} {this.props.lastName}</h4>
                        <h5>{this.props.sector}</h5>
                        <h5>{this.props.type}</h5>
                        <h6>{this.props.city}, {this.props.province}, {this.props.country}</h6>
                    </div>
                    <div style={{ float: 'left', margin: '0 2em' }}>
                        <Button onClick={this.showAllInfo} variant="primary">{this.state.displayButton}</Button> <span />
                        <Button variant="primary">Send Email</Button> <span />
                        <Button onClick={e => this.handleLike(e, this.props.userId, this.props.authUser, this.props.firebase, this.props.authEmail)} variant="danger">Like</Button>
                    </div>
                </div>
                <div style={{ display: this.state.display, textAlign: 'left' }}>
                    <div style={{ margin: '2em' }}>
                        <h4>Description</h4>
                        <h6>{this.props.description}</h6>
                        <h4>Responsibilities</h4>
                        <h6>{this.props.keyResponsibilities}</h6>
                        <h4>Requirements</h4>
                        <h6>{this.props.requirements}</h6>
                    </div>
                </div>
            </div>
        )
    }
}
export default withFirebase(Vacancies);