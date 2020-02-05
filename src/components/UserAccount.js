import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from './Session';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class UserAccount extends Component {
    
    // getCompanyName = (uid) => {
    //     this.props.firebase.company(uid).on('value', snap => {
    //         snap.forEach(childSnap => {
    //             var companyName = childSnap.child('companyName').val();
    //         })
    //     })
    // }

    render () {
       
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                <div className="container"  style={{marginTop: "120px"}}>
                <h1>Welcome to your account, {authUser.email}</h1>
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                        <Col sm={3}>
                        <ListGroup>
                            <ListGroup.Item action href="#link1">
                            User Account
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link2">
                            Invitations
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link3">
                            Applications
                            </ListGroup.Item>
                            <ListGroup.Item action href="#link4">
                            Settings
                            </ListGroup.Item>
                        </ListGroup>
                        </Col>
                        <Col sm={9} style={{backgroundColor: 'rgb(255,255,255)', borderRadius: '5px'}}>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link1">
                            Jsdfs lskdfjz lksjf slzkfj lksjd fslzdkfj 
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                            J;LSKD lj lksjdf skdfhjg skdfb skdfhksdfkj
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link3">
                            ggJ  sdkfhsd fks dfkhszjdf ksdzfzsjkdfh'
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link4">
                            Hjhgds  sdkfhsd fks dfkhszjdf kdfgdfg
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                    
                </div>
            )}
            </AuthUserContext.Consumer>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(UserAccount);
