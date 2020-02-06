import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/Register';
import CreateAccount from './components/CreateAccount';
import UserAccount from './components/UserAccount';
import User from './components/CreateUser';
import Company from './components/CreateCompany';
import Education from './components/Education';
import Experience from './components/Experience';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Route path='/createuser' component={User} />
            <Route path='/createcompany' component={Company} />
            <Route path='/education' component={Education} />
            <Route path='/experience' component={Experience} />
          </div>  
        </BrowserRouter>    
    )
  }
}

export default withAuthentication(App);
