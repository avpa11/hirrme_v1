import React from 'react';
import Button from 'react-bootstrap/Button';

import { withFirebase } from './Firebase';

const SignOut = ( { firebase }) => (
    <Button onClick={firebase.doSignOut} className='loginButton btn btn-warning'>
        Sign Out
    </Button>
)

export default withFirebase(SignOut);