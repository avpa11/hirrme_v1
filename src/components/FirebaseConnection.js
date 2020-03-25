import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/storage';
require('dotenv').config();

const firebaseConfig = {
          apiKey: process.env.REACT_APP_API_KEY,
          authDomain: process.env.REACT_APP_AUTH_DOMAIN,
          databaseURL: process.env.REACT_APP_DATABASE_URL,
          projectId: process.env.REACT_APP_PROJECT_ID,
          storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
          messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
          appId: process.env.REACT_APP_APP_ID,
          measurementId: process.env.REACT_APP_MEASUREMENT_ID
      };


const firebaseConfigProduction = {
    apiKey: process.env.REACT_APP_API_KEY_PROD,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN_PROD,
    databaseURL: process.env.REACT_APP_DATABASE_URL_PROD,
    projectId: process.env.REACT_APP_PROJECT_ID_PROD,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET_PROD,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_PROD,
    appId: process.env.REACT_APP_APP_ID_PROD,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID_PROD
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
