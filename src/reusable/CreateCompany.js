import React, { Component }  from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'


import { withRouter } from 'react-router-dom';
import { withAuthorization } from '../components/Session';
import { withFirebase } from '../components/Firebase';
// import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { connect } from 'react-redux';

const CreateCompany = () => (
    <CompanyForm />
)

const initState = {
    companyName: '',
    companyField: '',
    companyDesrciption: '',
    companyCity: '',
    companyProvince: 'BC',
    companyCountry: 'Canada',
    error: null,
    visible : false
};

class CreateCompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: (this.props.location.pathname === '/useraccount' && this.props.loggedCompany!== undefined ) ? this.props.loggedCompany.name : '',
            companyField: (this.props.location.pathname === '/useraccount' && this.props.loggedCompany!== undefined ) ? this.props.loggedCompany.field : '',
            companyDesrciption: (this.props.location.pathname === '/useraccount' && this.props.loggedCompany!== undefined ) ? this.props.loggedCompany.desrciption : '',
            companyCity: (this.props.location.pathname === '/useraccount' && this.props.loggedCompany!== undefined ) ? this.props.loggedCompany.city : '',
            companyProvince: 'BC',
            companyCountry: 'Canada',
            error: null,
            visible : false
        };
    }

    
    handleSubmit = (e, authUser) => {
        e.preventDefault();

        if (this.state.companyName === '' || this.state.companyField === '' || this.state.companyDesrciption === '' || this.state.companyCity === '' || this.state.companyDesrciption === '') {
            this.setState({ error: 'Please fill all required fields'});
            this.setState({visible: true},()=>{
                setTimeout(()=>{
                  this.setState({visible: false})
                },2000)
              });
        } else {
        
            if (this.props.loggedCompany !== null  && this.props.loggedCompany !== undefined) {
                // this adds a user object with a key and stores uid as userId field inside
                this.props.firebase.companies().ref.child(this.props.loggedCompanyKey[0]).set({
                    companyId: authUser.uid,
                    name: this.state.companyName,
                    field: this.state.companyField,
                    email: authUser.email,
                    desrciption: this.state.companyDesrciption,
                    city: this.state.companyCity,
                    province: this.state.companyProvince,
                    country: this.state.companyCountry,
                    profileImage: (this.props.loggedCompany.profileImage!== null && this.props.loggedCompany.profileImage!== undefined) ? this.props.loggedCompany.profileImage : null

                })
                    .then(() => {
                        this.setState({...initState})
                    })
                    .then(() => {
                        this.props.onDeleteLoggedCompany(
                            null,
                            null,
                        );
                    })
                    .then(() => {
                        // this.props.history.push('/education');
                        let companyRef = this.props.firebase.companies().orderByChild('companyId')
                            .equalTo(this.props.authUser.uid)
                            companyRef.on('value', snapshot => {
                                snapshot.forEach(snap1 => {
                                    // Redux
                                    this.props.onSetLoggedCompany(
                                        snap1.val(),
                                        // user object key
                                        Object.keys(snapshot.val())[0],
                                    );
                                });
                        })
                    })
                    // .then(() => {
                    //     this.props.history.push('/useraccount#link1');
                    // })
                    .catch(error => console.log(error));
            } else {
                // this adds a user object with a key and stores uid as userId field inside
                this.props.firebase.companies().push({
                    companyId: authUser.uid,
                    name: this.state.companyName,
                    field: this.state.companyField,
                    email: authUser.email,
                    desrciption: this.state.companyDesrciption,
                    city: this.state.companyCity,
                    province: this.state.companyProvince,
                    country: this.state.companyCountry,
                })
                    .then(() => {
                        this.setState({...initState})
                    })
                    .then(() => {
                        // this.props.history.push('/education');
                        let companyRef = this.props.firebase.companies().orderByChild('companyId')
                            .equalTo(this.props.authUser.uid)
                            companyRef.on('value', snapshot => {
                                snapshot.forEach(snap1 => {
                                    // Redux
                                    this.props.onSetLoggedCompany(
                                        snap1.val(),
                                        // user object key
                                        Object.keys(snapshot.val())[0],
                                    );
                                });
                        })
                    })
                    // .then(() => {
                    //     this.props.history.push('/useraccount#link1');
                    // })
                    .catch(error => console.log(error));
            }
        }


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
    
    render () {
        // console.log(this.props);
        // console.log(this.props.loggedCompanyKey[0]);
        const { companyName, companyField, companyDesrciption, companyCity, companyProvince, companyCountry, error } = this.state;
        return (
            <Form
                onSubmit={e => this.handleSubmit(e, this.props.authUser)}
                style={{ justifyContent: 'center', marginTop: "40px", marginBottom: "20px",  width: '100%' }}>

                {error && <Alert style= {this.state.visible ? {} : {display: 'none'}} variant="danger">{error}</Alert>}

                {this.props.location.pathname === '/useraccount' ?
                <React.Fragment>
                    <Row style={{marginLeft: '30px', marginRight: '30px'}}>
                        <Col sm={6}>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Name<span style={{color: '#dc3545'}}>*</span></Form.Label>
                            <FormControl type="text" value={companyName} onChange={this.handleChange} name="companyName" placeholder=""></FormControl>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Field<span style={{color: '#dc3545'}}>*</span></Form.Label>
                            <FormControl type="text" value={companyField} onChange={this.handleChange} name="companyField" placeholder=""></FormControl>
                        </Col>
                        <Col sm={6}>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>City<span style={{color: '#dc3545'}}>*</span></Form.Label>
                            <FormControl type="text" value={companyCity} onChange={this.handleChange} name="companyCity" placeholder=""></FormControl>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Province</Form.Label>
                            <FormControl type="text" value={companyProvince} onChange={this.handleChange} name="companyProvince" placeholder="" disabled></FormControl>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Country</Form.Label>
                            <FormControl type="text" value={companyCountry} onChange={this.handleChange} name="companyCountry" placeholder="" disabled></FormControl>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: '30px', marginRight: '30px'}}>
                        <Col sm={12}>
                            <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Description</Form.Label>
                        </Col>
                        <Col sm={12} className="center">
                            <textarea rows="4" style={{width: '100%'}} value={companyDesrciption} onChange={this.handleChange} name="companyDesrciption" placeholder=""></textarea>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: '30px', marginRight: '30px'}}>
                        <Col sm={12} className="center" style={{marginTop: '20px'}}>
                            <Button type="submit" variant="warning">
                                Save Changes
                            </Button>
                        </Col>
                    </Row>
                </React.Fragment> : 
                <React.Fragment>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Name<span style={{color: '#dc3545'}}>*</span></Form.Label>
                    <FormControl type="text" value={companyName} onChange={this.handleChange} name="companyName" placeholder=""></FormControl>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Field<span style={{color: '#dc3545'}}>*</span></Form.Label>
                    <FormControl type="text" value={companyField} onChange={this.handleChange} name="companyField" placeholder=""></FormControl>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>City<span style={{color: '#dc3545'}}>*</span></Form.Label>
                    <FormControl type="text" value={companyCity} onChange={this.handleChange} name="companyCity" placeholder="City"></FormControl>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Province</Form.Label>
                    <FormControl type="text" value={companyProvince} onChange={this.handleChange} name="companyProvince" placeholder="Province" disabled></FormControl>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Country</Form.Label>
                    <FormControl type="text" value={companyCountry} onChange={this.handleChange} name="companyCountry" placeholder="Country" disabled></FormControl>
                    <Form.Label style={{color: 'rgb(104, 104, 104)', marginLeft: '5px', marginBottom: '0', textAlign: 'left !important'}}>Description<span style={{color: '#dc3545'}}>*</span></Form.Label>
                    <textarea rows="4" style={{width: '100%'}} value={companyDesrciption} onChange={this.handleChange} name="companyDesrciption" placeholder=""></textarea>
                    {/* <div className="center" style={{marginTop: "50px", paddingBottom: '50px'}}>
                        <Button type="submit" className="loginButton" variant="warning">
                            Register
                        </Button>
                    </div>  */}
                    <Button type="submit" variant="warning">
                    {(this.props.loggedCompany!== null && this.props.loggedCompany!== undefined) ? 
                        'Change'
                        :
                        'Next'
                    } 
                    </Button>
                </React.Fragment>
            }
            </Form>
        )
    }
}

const mapStateToProps = (state, props) => ({
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

export default  withAuthorization(condition)(CreateCompany);

export { CompanyForm };