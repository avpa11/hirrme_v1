import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from './Session';

class UserAccount extends Component {

    render () {
       
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                <div className="container">
                    <h1>Welcome to our account, {authUser.email}</h1>
                    <p>This page is only accessible to logged in users. (Same goes to /createaccount)</p>
                </div>
            )}
            </AuthUserContext.Consumer>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(UserAccount);
