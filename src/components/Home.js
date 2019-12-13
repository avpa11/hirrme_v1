import React, { Component } from 'react';
// import CardDeck from 'react-bootstrap/CardDeck';
// import Card from 'react-bootstrap/Card';
// import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Video from '../components/Video';
import './FirebaseConnection.js'
import * as firebase from 'firebase';

class Home extends Component {

    display = () => {
        firebase.database().ref().child('test').on('value', snap => {
            alert(snap.val());
        })
    }

    render() {

        return (
            <div>
            <Video />
            <div className="container" style={{ marginTop: "50px", zIndex: 1 }}>
                <h1 className="text-center">Seacrh for a job at Hirr.me</h1>
                <p className="text-center">Let us help you to get work/ers</p>
                <Form inline style={{ display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px" }}>
                <div className="input-group-prepend" style={{backgroundColor: 'none',borderColor: "#FFC107"}}>
                    <span className="input-group-text">
                        <i className="fa fa-search"></i>
                    </span>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" style={{borderColor: "#FFC107" }} />
                </div>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <i className="material-icons">place</i>                   
                    </span>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" style={{borderColor: "#FFC107" }} />
                </div>
                    <Button variant="warning"
                        onClick={this.display}>
                        Search
                    </Button>
                </Form>
                <div className="container" style={{ width: '80%', marginTop: "30px" }}>
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

                    {/* {Array.apply(null, Array(6)).map(function(item, i){                                        
                        return (
                            <div className="card">
                                    <p className="center">Some text</p>
                            </div>
                        );                
                    }, this)} */}

                </div>
            </div>
            </div>
        )
    }
}

export default Home;