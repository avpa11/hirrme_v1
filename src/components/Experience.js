import React, { Component } from 'react';
import FormExperience from '../reusable/FormExperience';

import Button from 'react-bootstrap/Button';

import { withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const Experience = () => (
    <div>
        <ExperienceForm />
    </div>
)

class CreateExperienceForm extends Component {

    redirect = e => {
        this.props.history.push('/useraccount');
    }

    render () {
        return (
            <div className="rectangle registerect container" style={{ marginTop: "120px", marginBottom: "500px" }}>
                <div className="container">
                    <h1>Last step</h1>
                    <FormExperience />
                    <Button type="button" variant="warning" onClick={this.redirect}>Next</Button>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const ExperienceForm = compose(connect(mapStateToProps), withRouter, withFirebase)(CreateExperienceForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Experience);

export { ExperienceForm };
