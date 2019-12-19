import * as firebase from 'firebase';
import app from 'firebase/app';

var firebaseConfig = {
          apiKey: "AIzaSyBrd47aC5DMfPk2D3_ejrFD9uqi0GQ1m30",
          authDomain: "hirr-12.firebaseapp.com",
          databaseURL: "https://hirr-12.firebaseio.com",
          projectId: "hirr-12",
          storageBucket: "hirr-12.appspot.com",
          messagingSenderId: "499108259977",
          appId: "1:499108259977:web:dccb6a56b42862256b7e58",
          measurementId: "G-QNL3PHTCVC"
      };

class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        this.auth = app.auth();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();
}

export default Firebase;
