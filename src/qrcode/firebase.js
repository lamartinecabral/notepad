// @ts-check
import { State } from "./state";

/** @type {import('../firebase/firebase')} */
// @ts-ignore
const firebase = window.firebase;

const { initializeApp } = firebase.app;
const { getAuth } = firebase.auth;
const { getFirestore } = firebase.firestore;
const firebaseConfig = firebase.config;

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(firebaseConfig, State.docId || "");

export const auth = getAuth(app);

export const db = getFirestore(app);
