import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBXZfUvEUcCSOdZBWbw_PMY2XCAEaS9Q94",
  authDomain: "remusic-cf7bd.firebaseapp.com",
  databaseURL: "https://remusic-cf7bd.firebaseio.com",
  projectId: "remusic-cf7bd",
  storageBucket: "remusic-cf7bd.appspot.com",
  messagingSenderId: "484094823628"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase
