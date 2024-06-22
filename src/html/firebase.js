// @ts-check

import { State } from "./state";

/** @type {import('../firebase/firebase')} */ // @ts-ignore
const firebase = window.firebase;

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

export const { auth, db } = firebase.initApp(State.docId || "");
