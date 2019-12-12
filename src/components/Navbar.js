import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from '../components/Modal';

class Navibar extends Component {
    render() {

      const {user} = this.props;

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
                </Nav>
            </Navbar.Collapse>
            <Modal />
            {/* Will be a user object in the future
             {user} */}
          </Navbar> 
        </div>
      )
  }
}
// withRouter is used to pass the route properties to Navbar component (supercharging it)
export default withRouter(Navibar);