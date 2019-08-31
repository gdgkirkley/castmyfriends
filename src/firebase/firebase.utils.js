import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDkfz2yfBLWjbR2cHT1BrlF9CwqAmuj4DQ",
  authDomain: "cast-my-friends.firebaseapp.com",
  databaseURL: "https://cast-my-friends.firebaseio.com",
  projectId: "cast-my-friends",
  storageBucket: "",
  messagingSenderId: "941169461611",
  appId: "1:941169461611:web:915e19c0023a7033",
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
