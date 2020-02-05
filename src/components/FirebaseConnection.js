import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';

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
        app.initializeApp(firebaseConfig);
        app.analytics();

        this.auth = app.auth();
        this.db = app.database();

    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    // Database
    database = () => this.db.ref();

    // User
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // Education
    education = uid => this.db.ref(`educations/${uid}`);
    educactions = () => this.db.ref('educations');
    
    // Experience
    experience = uid => this.db.ref(`experience/${uid}`);
    experiences = () => this.db.ref('experiences');

    // Subscriptions
    subscriptions = () => this.db.ref('subscriptions');

    // Company
    company = uid => this.db.ref(`companies/${uid}`);
    companies = () => this.db.ref(`companies`);
}

export default Firebase;
