import firebase from './firebase';

// Sign Up
export const signUp = (email, password) =>
    firebase.auth().createUserWithEmailAndPassword(email, password);

// Log In
export const logIn = (email, password) =>
    firebase.auth.signInWithEmailAndPassword(email, password);

// Sign out
export const signOut = () =>
    firebase.auth.signOut();

// Password Reset
export const passwordReset = (email) =>
    firebase.auth.sendPasswordResetEmail(email);

// Password Change
export const passwordUpdate = (password) =>
    firebase.auth.currentUser.updatePassword(password);