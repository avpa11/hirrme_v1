import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as firebase from 'firebase';


class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    const ref = firebase.database().ref('user');

    ref.on('value', snapshot => {
      let user = snapshot.val();
      this.setState({ user: user });
    });
  }

  render(){    

    return (      
      <BrowserRouter>
        <div className="App">
          <Navbar user={this.state.user} />
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/contact' component={Contact} />          
          <Route path='/register' component={Register} />          
        </div>  
      </BrowserRouter>      
    );
  }
}

export default App;
