import React, { Component } from 'react';
import { withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';

import FormEducation from '../reusable/FormEducation';

const Education = () => (
    <div>
        <EducationForm />
    </div>
)

class CreateEducationForm extends Component {

    
    redirect = e => {
        this.props.history.push('/experience');
    }

    render () {
        return (
            <div className="rectangle registerect container" style={{ marginTop: "120px", marginBottom: "500px" }}>
                <div className="container">
                    <h1>Almost done</h1>
                        <FormEducation />
                        <Button type="button" variant="warning" onClick={this.redirect}>Next</Button>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

const EducationForm = compose(connect(mapStateToProps), withRouter, withFirebase)(CreateEducationForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Education);

export { EducationForm };
