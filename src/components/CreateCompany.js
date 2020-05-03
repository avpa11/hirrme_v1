import React, { Component } from 'react';

import { withAuthorization } from './Session';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


import { connect } from 'react-redux';

import CompanyProfileForm from '../reusable/CreateCompany';
import CompanyImage from '../reusable/CompanyImage';


const CreateCompany = () => (
    <div>
        <CompanyForm />
    </div>
)


class CreateCompanyForm extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let currentComponent = this;
        var jobSeekersRef = this.props.firebase.companies().orderByChild('companyId')
        .equalTo(this.props.authUser.uid)
        jobSeekersRef.on('value', snapshot => {
            snapshot.forEach(snap1 => {
                // Redux
                this.props.onSetLoggedCompany(
                    snap1.val(),
                    // user object key
                    Object.keys(snapshot.val())[0],
                );
                currentComponent.setState({ key: Object.keys(snapshot.val())[0]  });
            });
        })
    }

    componentWillUnmount() {
        this.props.firebase.database().off();
        this.props.firebase.database().ref.child('users').off();
    }

    redirect = e => {
        this.props.history.push('/education');
    }

    render() {
        return (
                <div className="registerCard container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h1>Let us know more about your company!</h1>
                        <Row>
                            <Col sm={6}>
                                <CompanyProfileForm></CompanyProfileForm>
                            </Col>
                            <Col sm={6}>
                                <CompanyImage></CompanyImage>
                            </Col>
                        </Row>
                        {(this.props.loggedCompany!== null && this.props.loggedCompany!== undefined) ? 
                            <div className="center" style={{marginTop: '15px', paddingBottom: '50px'}}>
                                <Button type="button"  className="loginButton" variant="warning" onClick={this.redirect}>Continue</Button>
                            </div> 
                            :
                            null
                        }
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
    loggedCompany: (state.loggedCompanyState.loggedCompany || {})[Object.keys(state.loggedCompanyState.loggedCompany  || {})],
    loggedCompanyKey: Object.keys(state.loggedCompanyState.loggedCompany || {})
  });

  const mapDispatchToProps = dispatch => ({
    onSetLoggedCompany: (loggedCompany, key) => dispatch({ type: 'LOGGED_COMPANY_SET', loggedCompany, key }),
    onDeleteLoggedCompany: (loggedCompany, key) => dispatch({ type: 'LOGGED_COMPANY_DELETE', loggedCompany, key }),
  });

const CompanyForm = compose(connect(mapStateToProps, mapDispatchToProps), withRouter, withFirebase)(CreateCompanyForm);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreateCompany);

export { CompanyForm };
