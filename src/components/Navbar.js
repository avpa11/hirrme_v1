import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ModalSignIn from './ModalSignIn';

// need to create a use pop up and put sign out button there
// import SignOut from './SignOut';
import ModalSignOut from './ModalSignOut';

import { AuthUserContext } from './Session';

class Navibar extends Component {
    render() {

      // const {authUser} = this.props;

      return ( 
        <div className="container">
          <Navbar expand="lg">
            <Navbar.Brand as={Link} to="/"><img
              alt="HirrMe logo"
              src={require('../img/logo.png')}
              width="20" 
              className="d-inline-block align-top"
            />{' '}Hirr.me</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
              <Nav>
                  <Nav.Link as={Link} to="/about">About</Nav.Link>
                  <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                  {/* TEMPORARY */}
                  <Nav.Link as={Link} to="/useraccount">User Account</Nav.Link>
              </Nav>
          {/* display sign out button if user is not authentivates. */}
          <AuthUserContext.Consumer>{
              authUser => authUser ? 
              // Need to create a user profile popup and put sign out button there
                // <SignOut />
                <ModalSignOut />
              : <ModalSignIn />
            }</AuthUserContext.Consumer>
          </Navbar.Collapse>
          {/* <UserAccount/> */}
          {/* Will be a user object in the future
            {user} */}
        </Navbar> 
      </div>
      )
  }
}
// withRouter is used to pass the route properties to Navbar component (supercharging it)
export default withRouter(Navibar);