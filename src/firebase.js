import firebase from "firebase";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  apiKey: "AIzaSyDVr8UakN2dxtyNFpXP1iKoCLQHrdtf5lI",
  authDomain: "final-309503.firebaseapp.com",
  databaseURL: "https://final-309503-default-rtdb.firebaseio.com",
  projectId: "final-309503",
  storageBucket: "final-309503.appspot.com",
  messagingSenderId: "15980661119",
  appId: "1:15980661119:web:8d1c06dcdf00b1bf8eb24a",
  measurementId: "G-ML5SGR56GV"
};

// Initialize Firebase
let ms;
try {
  ms = firebase.initializeApp(firebaseConfig);
} catch (err) {}

const fireDb = ms.database();

const fireAuth = firebase.auth();

export { fireDb, fireAuth };
