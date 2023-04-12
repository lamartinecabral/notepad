// @ts-check
import { State } from "./state.js";

/** @type {import('../firebase')['default']} */
// @ts-ignore
const firebase = window.firebase

const { initializeApp } = firebase.app;
const { getFirestore } = firebase.firestore;
const { getAuth } = firebase.auth;
const firebaseConfig = firebase.config;

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(firebaseConfig, State.docId || "");

export const auth = getAuth(app);

export const db = getFirestore(app);
