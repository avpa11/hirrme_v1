import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/storage'

const firebaseConfig = {
          apiKey: "AIzaSyBrd47aC5DMfPk2D3_ejrFD9uqi0GQ1m30",
          authDomain: "hirr-12.firebaseapp.com",
          databaseURL: "https://hirr-12.firebaseio.com",
          projectId: "hirr-12",
          storageBucket: "hirr-12.appspot.com",
          messagingSenderId: "499108259977",
          appId: "1:499108259977:web:dccb6a56b42862256b7e58",
          measurementId: "G-QNL3PHTCVC"
      };


const firebaseConfigProduction = {
          apiKey: "AIzaSyAtvGKxO5slXwpjqdkbnHqkG201uonx2Ak",
          authDomain: "hirrproduction.firebaseapp.com",
          databaseURL: "https://hirrproduction.firebaseio.com",
          projectId: "hirrproduction",
          storageBucket: "hirrproduction.appspot.com",
          messagingSenderId: "1009908311945",
          appId: "1:1009908311945:web:acac06697fe9cd6e052358",
          measurementId: "G-ZE85J52CFR"
      };

const config = process.env.NODE_ENV === 'production' ? firebaseConfigProduction : firebaseConfig;

class Firebase {
    constructor() {
        app.initializeApp(config);
        app.analytics();

        this.auth = app.auth();
        this.db = app.database();
        this.storage = app.storage();

    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

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

    // Vacancies
    vacancy = uid => this.db.ref(`vacancies/${uid}`);
    vacancies = () => this.db.ref(`vacancies`);

    savedVacancies = () => this.db.ref('savedVacancies');

    // Likes 
    // companyLike = uid => this.db.ref(`companyLike/${uid}`);
    companyLikes = () => this.db.ref(`companyLikes`);

    // Quizes
    quizes = () => this.db.ref(`quizes`);

    vacanciesApplications = () => this.db.ref(`vacanciesApplications`);
}

export default Firebase;
