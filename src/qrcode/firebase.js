// @ts-check
import { State } from "./state";

/** @type {import('../firebase/firebase')} */
// @ts-ignore
const firebase = window.firebase;

const { initializeApp } = firebase.app;
const { getAuth } = firebase.auth;
const { getFirestore } = firebase.firestore;

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(State.docId || "");

export const auth = getAuth(app);

export const db = getFirestore(app);
