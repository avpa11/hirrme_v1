import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as firebase from 'firebase';

class ContactFooter extends Component {

    subscribeForSpam = () => {

        var email = document.getElementById('emailinput').value;

        var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;

        if(emailRegex.test(email)){
            firebase.database().ref("subscriptions").push({
                email: email
            })
            document.getElementById('emailinput').value = "";
        }
    }

    render() {        

        return (
            <div id='contactFooter'>
                <div className="row">
                    <div className="col">
                        <img id='paperPlaneIcon' src='https://image.flaticon.com/icons/png/128/149/149446.png' alt=""/>
                        <h2>Subscribe to receive updates!</h2>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col">
                        <div className="input-group inputs">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <img src='http://pluspng.com/img-png/email-icon-png-download-icons-logos-emojis-email-icons-2400.png' alt=""/>
                                </span>
                            </div>
                            <input type="email" id="emailinput" className="form-control" aria-label="Useremail" aria-describedby="basic-addon1" />
                            <button id='buttonSubscribeForEmails' type="button" className="btn btn-warning"
                                onClick={this.subscribeForSpam}>
                                Subscribe
                            </button>                                                      
                        </div>
                    </div>
                </div>
                <div className="row" id="rectangleRow">
                    <div className="rectangle">
                        <img className='rectangleIcon' src='http://pluspng.com/img-png/email-icon-png-download-icons-logos-emojis-email-icons-2400.png' alt="" />
                        <h4>___________</h4>
                        <h5>hirr.me@gmail.com</h5>
                    </div>
                    <div className="rectangle">
                        <img className='rectangleIcon' src='https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png' alt=""/>
                        <h4>___________</h4>
                        <h5>+1 (604) 635-3726</h5>
                    </div>
                    <div className="rectangle">
                        <img className='rectangleIcon' src='https://freeiconshop.com/wp-content/uploads/edd/location-pin-compact-outline.png' alt=""/>
                        <h4>___________</h4>
                        <h5>123 Pender St. <br /> Vancouver </h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactFooter;