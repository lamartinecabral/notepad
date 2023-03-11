// @ts-check

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../config.js";
import { State } from "./state";

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(firebaseConfig, State.docId || '');

export const auth = getAuth(app);

export const db = getFirestore(app);
