import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { compose } from 'recompose';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import ModalSignIn from './ModalSignIn';
import { NavHashLink } from 'react-router-hash-link';

// need to create a use pop up and put sign out button there
// import SignOut from './SignOut';
import ModalSignOut from './ModalSignOut';

// import { AuthUserContext } from './Session';

// Redux
import { connect } from 'react-redux';

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
                  <Nav.Link as={Link} to="/">About</Nav.Link>
                  <Nav.Link as={Link} to="/vacancies">Vacancies</Nav.Link>
                  <Nav.Link as={Link} to="/jobseekers">Job Seekers</Nav.Link>
                  <NavHashLink smooth className="nav-link" as={Link} to="/#contactFooter">Contact</NavHashLink>                  
              </Nav>
          {
              this.props.authUser != null ? 
                <ModalSignOut />
              : <ModalSignIn />
            }
          </Navbar.Collapse>
        </Navbar> 
      </Container>
      )
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});


// withRouter is used to pass the route properties to Navbar component (supercharging it)
export default compose(connect(mapStateToProps),withRouter)(Navibar);