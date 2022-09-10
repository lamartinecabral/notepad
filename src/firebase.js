// @ts-check

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { State } from "./state.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiYQovHXW5g4nRWx2Cd-OfxJ81bHpLWk0",
  authDomain: "lamart-notepad.firebaseapp.com",
  projectId: "lamart-notepad",
  storageBucket: "lamart-notepad.appspot.com",
  messagingSenderId: "484168964554",
  appId: "1:484168964554:web:79aaa5146d601e6df8d733",
};
// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(firebaseConfig, State.docId || '');

export const auth = getAuth(app);

export const db = getFirestore(app);
