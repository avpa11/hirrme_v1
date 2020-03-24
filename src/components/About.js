import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Contact from '../components/Contact';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';


const About = () => {
    return (
        <BrowserRouter>
        <Switch>
            <Route path="/about" exact render={() => {
                return (
                    <div className="container" style={{marginTop: "120px"}}>
                        <h4 className="text-center">About Us</h4>
                        <Nav>
                            <Nav.Link as={Link} to={{
                                pathname: "/contact",
                                data: 'hey'
                            }}><Button variant="warning">Contact</Button></Nav.Link>
                        </Nav> 
                    </div>
                )
             }} />
        </Switch>
        <Route exact path="/contact" component={Contact} />
        </BrowserRouter>
    )
}

export default About;