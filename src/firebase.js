// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAxXQnNN28mDKYcqJvcG_yMOejuHWZSbBM",
    authDomain: "tea-ti.firebaseapp.com",
    projectId: "tea-ti",
    storageBucket: "tea-ti.appspot.com",
    messagingSenderId: "291253739994",
    appId: "1:291253739994:web:98bbe2252b6db8f4dbe0e3"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export { db, firebase };
