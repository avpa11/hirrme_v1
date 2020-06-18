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

let logoStyle = {
  width: '25%',
  float: 'right',
  marginRight: '3em'
}

let logoTextStyle = {
  marginTop: '30%',
  width: '20',
  fontSize: '120%'
}

let linksStyle = {
  width: '8em',
  minWidth: '6em',
  color: 'black',
  fontSize: '130%',
  marginRight: 'auto',
  marginLeft: '6%',
}

class Navibar extends Component {
  state = {
    isTop: true,
  };

  componentDidMount() {
    document.addEventListener('scroll', () => {
      const isTop = window.scrollY === 0;
      if (isTop !== this.state.isTop) {
        this.setState({ isTop })
      }
    });
  }

  render() {

    return (
      <Container>
        <Navbar fixed="top" expand="lg" className={this.state.isTop ? '' : 'scrolled'}>
          <Navbar.Brand style={logoStyle} as={Link} to="/">
            <div style={{width: '15%', margin: 'auto'}}>
            <img alt="HirrMe logo" src={require('../img/logo.png')} width='40' />
            <span style={logoTextStyle}> Hirr.me</span>

            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="mr-left" >
              {/* <Nav.Link style={linksStyle} as={Link} to="/">About</Nav.Link> */}
              <Nav.Link style={linksStyle} as={Link} to="/vacancies">Vacancies</Nav.Link>
              <Nav.Link style={linksStyle} as={Link} to="/jobseekers">Job Seekers</Nav.Link>
              <NavHashLink style={linksStyle} className="nav-link" smooth as={Link} to="/#contactFooter">Contact</NavHashLink>              
            </Nav>
            {
                this.props.authUser != null ? <ModalSignOut /> : <ModalSignIn />
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
export default compose(connect(mapStateToProps), withRouter)(Navibar);