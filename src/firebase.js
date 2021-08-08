import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCrtTN0-47myhR9aRnJ8DY9dIRZvDgUmwI",
    authDomain: "iflomsproject.firebaseapp.com",
    databaseURL: "https://iflomsproject-default-rtdb.firebaseio.com",
    projectId: "iflomsproject",
    storageBucket: "iflomsproject.appspot.com",
    messagingSenderId: "398636414088",
 //   appId: "1:171473030702:web:b9c1d8c831f225ad1319bf",
 //   measurementId: "G-K41JYSL5DL"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
