import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/Register';
import CreateAccount from './components/CreateAccount';
import UserAccount from './components/UserAccount';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContactFooter from './components/ContactFooter';

import { withAuthentication } from './components/Session';

class App extends Component {

  render(){    

    return (      
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route exact path='/' component={Home} />
            <Route path='/about' component={About} />
            <Route path='/contact' component={Contact} />          
            <Route path='/register' component={Register} />
            <Route path='/createaccount' component={CreateAccount} />
            <Route path='/useraccount' component={UserAccount} />
            <ContactFooter />          
          </div>  
        </BrowserRouter>    
    );
  }
}

export default withAuthentication(App);
