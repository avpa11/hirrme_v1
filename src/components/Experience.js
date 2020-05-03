import React, { Component } from 'react';
import FormExperience from '../reusable/FormExperience';
import Video from '../components/Video2';
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

    // componentDidMount() {
    //     if (this.props.userType !== null) {
    //         this.props.history.push('/');
    //     }
    // }

    redirect = e => {
        this.props.history.push('/useraccount#link1');
    }

    render () {
        return (
            <React.Fragment>
                <Video />
            <div className="container registerCard" style={{ marginTop: "120px", marginBottom: "500px" }}>
                <div className="container">
                    <h1>Last step</h1>
                    <h2>Your Experience</h2>
                    <FormExperience />
                    <div className="center" style={{paddingBottom: "50px"}}>
                        <Button type="button" style={{color: '#6c757d', background: 'transparent', border: 'none'}}
                        onClick={this.redirect}>Skip this step</Button>
                    </div>
                </div>
            </div>
                        </React.Fragment>
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
