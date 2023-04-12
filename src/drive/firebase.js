// @ts-check

import { State } from "./state";

/** @type {import('../firebase')['default']} */
// @ts-ignore
const firebase = window.firebase

const { initializeApp } = firebase.app;
const { getStorage } = firebase.storage;
const { getAuth } = firebase.auth;
const firebaseConfig = firebase.config;

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(firebaseConfig, State.docId || '');

export const auth = getAuth(app);

export const storage = getStorage(app);
