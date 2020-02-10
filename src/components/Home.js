import React, { Component } from 'react';
// import CardDeck from 'react-bootstrap/CardDeck';
// import Card from 'react-bootstrap/Card';
// import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Video from '../components/Video';
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { IoMdPaperPlane } from "react-icons/io";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { withFirebase } from './Firebase';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          vacanciesTitle: [],
          sector: [],
          type: [],
          salaryType: [],
          salary: [],
        };
      }

    subscribeForSpam = e => {

        e.preventDefault();

        var email = document.getElementById('emailInput').value;

        if (email) {
            this.props.firebase.subscriptions().push({
                email: email
            })
            document.getElementById('emailInput').value = "";
        }
    }

    displayVacancies = () => {
        var vacanciesRef = this.props.firebase.database().child('vacancies').ref;      
        vacanciesRef.on('value', snap => {            
            snap.forEach(snap1 => {
                snap1.forEach(snap2 => {
                    console.log(snap2.child('description').val());
                    
                    this.setState(state => {
                        const vacanciesTitle = state.vacanciesTitle.concat(snap2.child('positionTitle').val());
                        const sector = state.sector.concat(snap2.child('sector').val());
                        const type = state.type.concat(snap2.child('type').val());
                        const salaryType = state.salaryType.concat(snap2.child('salaryType').val());
                        const salary = state.salary.concat(snap2.child('salary').val());
                        return {vacanciesTitle, sector, type, salaryType,salary}
                    });
                })                
            })
        })                 
    }

    componentDidMount = () => {
        this.displayVacancies();
    }

    render() {

        return (
            
            <div>
            <Video />
            <div className="container" style={{ marginTop: "70px", zIndex: 1 }}>
                <h1 className="text-center">Seacrh for a job at Hirr.me</h1>
                <p className="text-center">Let us help you to get work/ers</p>
                <Form inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                <div className="input-group-prepend" style={{backgroundColor: 'none',borderColor: "#FFC107"}}>
                    <span className="input-group-text">
                        <FaSearch />
                    </span>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" style={{borderColor: "#FFC107" }} />
                </div>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <FaSearchLocation />                   
                    </span>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" style={{borderColor: "#FFC107" }} />
                </div>
                    <Button variant="warning"
                        onClick={this.display}>
                        Search
                    </Button>
                </Form>
                <div className="container">
                    {/* <Carousel interval={4000} slide={true} wrap={true} >
                    {Array.apply(null, Array(6)).map(function(item, i){                                        
                        return (
                            <Carousel.Item>
                            <Card className="card col-4 img-fluid" style={{ width: '15rem' }}>
                                <Card.Body>
                                    <Card.Title>Card Title</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                    <Card.Text>
                                        Some quick example text to build on the card title and make up the bulk of
                                        the card's content.
                                </Card.Text>
                                    <Card.Link href="#">Card Link</Card.Link>
                                </Card.Body>
                            </Card>
                        </Carousel.Item>
                        );                
                    }, this)}
                        

                    </Carousel> */}
               
                    <div className="scrolling-wrapper center">
                    {Array.apply(null, Array(6)).map(function(item, i){                                                                    
                            return (
                                <div className="scroll_card rectangle">
                                    <div className="card_inside" style={{margin: 'auto', display: 'table', textAlign : 'left', verticalAlign: 'center'}}>                                                                                                                                                  
                                            <p style={{fontWeight: "bold"}}>{this.state.vacanciesTitle[i] ? this.state.vacanciesTitle[i] : "Coming soon"}</p>
                                            <h7>Sector: {this.state.sector[i] ? this.state.sector[i] : "Coming soon"}</h7> <br/>
                                            <h7>Type: {this.state.type[i] ? this.state.type[i] : "Coming soon"}</h7> <br/>
                                            <h7>Salary Type: {this.state.salaryType[i] ? this.state.salaryType[i] : "Coming soon"}</h7> <br/>
                                            <h7>Salary: ${this.state.salary[i] ? this.state.salary[i] : "Coming soon"}</h7> <br/>                                                                                   
                                    </div>
                                </div>
                            );                
                        }, this)}
                    </div>
                </div>
            </div>
            {/* Contact footer */}
            <div className="container" id='contactFooter' style={{marginTop: '150px'}}>
                <div className="row">
                    <div className="col">
                        <IoMdPaperPlane size={120} />
                        <h2>Subscribe to receive updates!</h2>
                    </div>
                </div>
                <div className="inputs">
                    <Form onSubmit={this.subscribeForSpam}>
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FaRegEnvelope />
                            </span>
                            <FormControl type="email" id="emailInput" placeholder="email@gmail.com" className="form-control" />
                            <Button type="submit" id='buttonSubscribeForEmails' className="btn btn-warning" >
                                Subscribe
                            </Button>
                        </div>
                    </Form>
                </div>
                <div className="row" id="rectangleRow">
                    <div className="rectangle">
                        <FaRegEnvelope size={70} />
                        <hr />
                        <h5>hirr.me@gmail.com</h5>
                    </div>
                    <div className="rectangle">
                        <FiPhone size={70} />
                        <hr />
                        <h5>+1 (604) 635-3726</h5>
                    </div>
                    <div className="rectangle">
                        <FiMapPin size={70} />
                        <hr />
                        <h5>123 Pender St. <br /> Vancouver </h5>
                    </div>
                </div>
            </div>
        </div>        
        )
    }
}

export default withFirebase(Home);