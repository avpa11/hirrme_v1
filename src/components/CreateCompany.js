import React, { Component } from 'react';

import { withAuthorization } from './Session';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

import CompanyProfileForm from '../reusable/CreateCompany';

const CreateCompany = () => (
    <div>
        <CompanyForm />
    </div>
)


class CreateCompanyForm extends Component {

    render() {
        return (
                <div className="registerCard container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h1>Let us know more about your company!</h1>
                        <CompanyProfileForm></CompanyProfileForm>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const CompanyForm = compose(connect(mapStateToProps), withRouter, withFirebase)(CreateCompanyForm);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreateCompany);

export { CompanyForm };
