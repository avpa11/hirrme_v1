import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withAuthorization } from './Session';
import CreateCompanyPage from './CreateCompany';

import { connect } from 'react-redux';
import { compose } from 'recompose';

class CreateAccount extends Component {

    componentDidMount() {
        if (this.props.userType === 'company') {
            this.props.history.push('/');
        }
        // console.log(this.props.userType );
    }

    handleChange = e => {

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
                <div id="mainPlaceholder" className="container rectangle registerect container" style={{ marginTop: "120px", height: 'fit-content', width: '100%' }} >
                    <h1 className="center" style={{marginTop: '50px' }}>Tell us who you are</h1>

                    <Row className="center" style={{marginTop: '80px' }}>
                        <Col sm={6}>
                            <Button style={{borderRadius: '20px', marginBottom: '20px'}} value="jobseeker" onClick={this.handleChange} type="button" variant="warning">Employee</Button>
                        </Col>
                        <Col sm={6}>
                            <Button style={{borderRadius: '20px', marginBottom: '20px'}} value="employer" onClick={this.handleChange} type="button" variant="secondary">Employer</Button>
                        </Col>
                    </Row>
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
