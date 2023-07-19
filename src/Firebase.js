import firebase from "firebase";
var firebaseConfig = {};

firebaseConfig = {
  apiKey: "AIzaSyAON2Pnhew8ndZ876Vaq_fi0r07MSuHo7I",
  authDomain: "annapurna-343c3.firebaseapp.com",
  projectId: "annapurna-343c3",
  storageBucket: "annapurna-343c3.appspot.com",
  messagingSenderId: "89470090787",
  appId: "1:89470090787:web:37f55cc4b02e381bbdbb96",
  measurementId: "G-4KREJBL28W"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { auth };
export default db;
