import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FaRegEnvelope } from "react-icons/fa";
import { IoMdPaperPlane } from "react-icons/io";
import { FiMapPin, FiPhone } from "react-icons/fi";


class ContactFooter extends Component {

    subscribeForSpam = e => {

        var email = document.getElementById('emailInput').value;

        if (email) {
            this.props.firebase.subscriptions().push({
                email: email
            })
            document.getElementById('emailInput').value = "";
        }
        e.preventDefault();
    }

    render() {
        return (
            <div className="container" id='contactFooter' style={{marginTop: '150px'}}>
                <div className="row">
                    <div className="col">
                        {/* <img id='paperPlaneIcon' src='https://image.flaticon.com/icons/png/128/149/149446.png' alt="" /> */}
                        <IoMdPaperPlane size={120} />
                        <h2>Subscribe to receive updates!</h2>
                    </div>
                </div>
                <div className="inputs">
                    <Form onSubmit={this.subscribeForSpam}>
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                {/* <img src='http://pluspng.com/img-png/email-icon-png-download-icons-logos-emojis-email-icons-2400.png' alt="" /> */}
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
                        {/* <img className='rectangleIcon' src='http://pluspng.com/img-png/email-icon-png-download-icons-logos-emojis-email-icons-2400.png' alt="" /> */}
                        <FaRegEnvelope size={70} />
                        <h4>___________</h4>
                        <h5>hirr.me@gmail.com</h5>
                    </div>
                    <div className="rectangle">
                        {/* <img className='rectangleIcon' src='https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png' alt="" /> */}
                        <FiPhone size={70} />
                        <h4>___________</h4>
                        <h5>+1 (604) 635-3726</h5>
                    </div>
                    <div className="rectangle">
                        {/* <img className='rectangleIcon' src='https://freeiconshop.com/wp-content/uploads/edd/location-pin-compact-outline.png' alt="" /> */}
                        <FiMapPin size={70} />
                        <h4>___________</h4>
                        <h5>123 Pender St. <br /> Vancouver </h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactFooter;