import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import ModalSignIn from './ModalSignIn';

// need to create a use pop up and put sign out button there
// import SignOut from './SignOut';
import ModalSignOut from './ModalSignOut';

import { AuthUserContext } from './Session';

class Navibar extends Component {
  state = {
    isTop: true,
  };

  componentDidMount() {
    document.addEventListener('scroll', () => {
      const isTop = window.scrollY < 100;
      if (isTop !== this.state.isTop) {
          this.setState({ isTop })
      }
    });
  }
    render() {

      // const {authUser} = this.props;

      return ( 
        <Container>
          <Navbar fixed="top" expand="lg" className={this.state.isTop ? '' : 'scrolled'}>
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
                  <Nav.Link as={Link} to="/">Vacancies</Nav.Link>
                  <Nav.Link as={Link} to="/">Job Seekers</Nav.Link>
                  <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
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
      </Container>
      )
  }
}
// withRouter is used to pass the route properties to Navbar component (supercharging it)
export default withRouter(Navibar);