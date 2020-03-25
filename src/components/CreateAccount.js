import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Row from 'react-bootstrap/Row';
import FormControl from 'react-bootstrap/FormControl';
import { withAuthorization } from './Session';
import CreateCompanyPage from './CreateCompany';

import { connect } from 'react-redux';
import { compose } from 'recompose';

class CreateAccount extends Component {

    componentDidMount() {
        if (this.props.userType !== null) {
            this.props.history.push('/');
        }
    }

    handleSubmit = e => {
        e.preventDefault();
    }

    handleChange = e => {
        // this.setState({ [e.target.name]: e.target.value });
        // console.log(e.target.value);


        if (e.target.value === 'jobseeker') {
            this.props.history.push('/createuser');
        }
        else {
            //this.props.history.push('/createcompany');
            document.getElementById('mainPlaceholder').style.display = "none";
            document.getElementById('createCompanyPagePlaceholder').style.display = "inline";
        }
    };

    render() {

        return (
            <div>
                <div id="mainPlaceholder" className="container rectangle registerect container" style={{ marginTop: "120px" }} >
                    <h1>Tell us who you are</h1>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>

                        <FormControl value="jobseeker" onChange={this.handleChange} type="radio" name="usertype" className="mr-sm-2 col-12 col-xs-12" id='rdbjobseeker' />
                        <label htmlFor="rdbjobseeker">Job Seeker</label>
                        <FormControl value="employer" onChange={this.handleChange} type="radio" name="usertype" className="mr-sm-2 col-12 col-xs-12" id='rdbemployer' />
                        <label htmlFor="rdbemployer">Employer</label>
                        {/* <Row>
                    <Button type="submit" variant="warning" className="container center">
                        Continue
                    </Button>
                </Row> */}
                    </Form>
                </div>
                <div id="createCompanyPagePlaceholder" style={{display:"none"}}>
                    <CreateCompanyPage />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
    userType: state.userTypeState.userType,
  });


const condition = authUser => !!authUser;

export default compose(connect(mapStateToProps),withAuthorization(condition))(CreateAccount);
