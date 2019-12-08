import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class Home extends Component {
    render() {
        return (

            <div className="container" style={{marginTop: "30px", zIndex: 1}}>
                <h1 className="text-center">Seacrh for a job at Hirr.me</h1>
                <p className="text-center">Let us help you to get work/ers</p>
                <Form inline style={{display: 'flex', justifyContent: 'center', marginTop: "80px", marginBottom: "80px"}}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>
                <div className="container" style={{ width: '80%', marginTop: "30px" }}>
                <Carousel interval={4000} slide={true} wrap={true} >
                    <Carousel.Item>
                    <CardDeck>
                            <Card style={{ width: '15rem' }}>
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
                            <Card style={{ width: '15rem' }}>
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
                            <Card style={{ width: '15rem' }}>
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
                        </CardDeck>
                    </Carousel.Item>
                    <Carousel.Item>
                    <CardDeck>
                            <Card style={{ width: '15rem' }}>
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
                            <Card style={{ width: '15rem' }}>
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
                            <Card style={{ width: '15rem' }}>
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
                        </CardDeck>
                    </Carousel.Item>

                    </Carousel>
                    
                </div>
            </div>
        )
    }
}

export default Home;