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

    componentDidMount() {
        if (this.props.userType !== null) {
            this.props.history.push('/');
        }
    }
    
    redirect = e => {
        this.props.history.push('/experience');
    }

    render () {
        return (
            <div className="container registerCard" style={{ marginTop: "120px", marginBottom: "500px" }}>
                <div className="container">
                    <h1>Almost done</h1>
                    <h2>Your Education...</h2>
                        <FormEducation />
                        <div className="center" style={{paddingBottom: "50px"}}>
                            <Button type="button" style={{color: '#6c757d', background: 'transparent', border: 'none'}}
                            onClick={this.redirect}>Skip this step</Button>
                        </div>

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
