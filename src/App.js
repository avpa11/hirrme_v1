import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/Register';
import CreateAccount from './components/CreateAccount';
import UserAccount from './components/UserAccount';
import User from './components/CreateUserProfile';
import Company from './components/CreateCompany';
import Education from './components/Education';
import Experience from './components/Experience';
import JobSeekers from './components/JobSeekers';
import Vacancies from './components/Vacancies';
import savedVacancies from './components/SavedVacancies';
import VacanciesApplicants from './components/VacanciesApplicants';
import JobSeekerPublicProfile from './components/JobSeekerPublicProfile';
// import CompanyAccount from "./components/CompanyAccount";
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
            <Route path='/vacancies' component={Vacancies} />          
            <Route path='/savedVacancies' component={savedVacancies} />          
            <Route path='/jobseekers' component={JobSeekers} />          
            <Route path='/register' component={Register} />
            <Route path='/createaccount' component={CreateAccount} />
            <Route path='/useraccount' component={UserAccount} />
            <Route path='/createuser' component={User} />
            <Route path='/createcompany' component={Company} />
            <Route path='/education' component={Education} />
            <Route path='/experience' component={Experience} />
            <Route path='/applicants' component={VacanciesApplicants} />
            <Route path='/profile/:id' component={JobSeekerPublicProfile} />
          </div>  
        </BrowserRouter>    
    )
  }
}

export default withAuthentication(App);
