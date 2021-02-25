import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const loadFirebase = async () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_JS_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_JS_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_JS_FIREBASE_DATABASE,
    projectId: process.env.NEXT_JS_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_JS_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_JS_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_JS_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_JS_FIREBASE_MESURAMENT_ID
  };
  try {
    firebase.initializeApp(firebaseConfig);
    //await firebase.auth().signInAnonymously()
  } catch(err){
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack)}
  }
  return firebase;
}
export default loadFirebase;