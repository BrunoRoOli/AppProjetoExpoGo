import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';


let firebaseConfig = {
    apiKey: "AIzaSyD6QUF2sjQwjRuTkIR5aL8Bn3W6YHHLt60",
    authDomain: "mygamelist-206fd.firebaseapp.com",
    projectId: "mygamelist-206fd",
    storageBucket: "mygamelist-206fd.firebasestorage.app",
    messagingSenderId: "1085914016932",
    appId: "1:1085914016932:web:dbb892747d6a3536774a31",
    measurementId: "G-Z43250SZEG",
    baseUrl:"https://mygamelist-206fd-default-rtdb.firebaseio.com/"
  };

  if(!firebase.apps.length){
    //initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  
  export default firebase;