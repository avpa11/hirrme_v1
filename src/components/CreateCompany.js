import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { withAuthorization } from './Session';

import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

const CreateCompany = () => (
    <div>
        <CompanyForm />
    </div>
)

const initState = {
    companyName: '',
    companyField: '',
    companyDesrciption: '',
    companyDirector: '',
    companyCity: '',
    companyProvince: 'BC',
    companyCountry: 'Canada'
};

class CreateCompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState }
    }


    handleSubmit = (e, authUser) => {
        e.preventDefault();

        // this adds a user object with a key and stores uid as userId field inside
        this.props.firebase.companies().push({
            companyId: authUser.uid,
            name: this.state.companyName,
            field: this.state.companyField,
            email: authUser.email,
            desrciption: this.state.companyDesrciption,
            director: this.state.companyDirector,
            city: this.state.companyCity,
            province: this.state.companyProvince,
            country: this.state.companyCountry,
        })
            .then(() => {
                this.setState({...initState})
            })
            .then(() => {
                this.props.history.push('/useraccount#link1');
            })
            .catch(error => console.log(error));

        // // this adds a user object under uid key from auth and nests key inside
        // this.props.firebase.company(authUser.uid).push({
        //     companyName: this.state.companyName,
        //     companyField: this.state.companyField,
        //     companyEmail: authUser.email,
        //     companyDesrciption: this.state.companyDesrciption,
        //     companyDirector: this.state.companyDirector,
        //     companyCity: this.state.companyCity,
        //     companyProvince: this.state.companyProvince,
        //     companyCountry: this.state.companyCountry,
        // })
        //     .then(() => {
        //         this.props.history.push('/useraccount');
        //     })


    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { companyName, companyField, companyDesrciption, companyDirector, companyCity, companyProvince, companyCountry } = this.state;
        return (
                <div className="registerCard container" style={{ marginTop: "120px" }}>
                    <div className="container">
                        <h1>Let us know more about your company!</h1>
                        <Form
                            onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                            style={{ justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                                <Row>
                                    <Col sm={6}>
                                        <FormControl type="text" value={companyName} onChange={this.handleChange} name="companyName" placeholder="Name"></FormControl>
                                        <FormControl type="text" value={companyField} onChange={this.handleChange} name="companyField" placeholder="Field"></FormControl>
                                        <FormControl type="text" value={companyDesrciption} onChange={this.handleChange} name="companyDesrciption" placeholder="Description"></FormControl>
                                        <FormControl type="text" value={companyDirector} onChange={this.handleChange} name="companyDirector" placeholder="Director"></FormControl>
                                    </Col>
                                    <Col sm={6}>
                                        <FormControl type="text" value={companyCity} onChange={this.handleChange} name="companyCity" placeholder="City"></FormControl>
                                        <FormControl type="text" value={companyProvince} onChange={this.handleChange} name="companyProvince" placeholder="Province"></FormControl>
                                        <FormControl type="text" value={companyCountry} onChange={this.handleChange} name="companyCountry" placeholder="Country"></FormControl>
                                    </Col>
                                </Row>
                                <div className="center" style={{marginTop: "50px", paddingBottom: '50px'}}>
                                    <Button type="submit" className="loginButton" variant="warning">
                                        Register
                                    </Button>
                                </div> 
                        </Form>
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
