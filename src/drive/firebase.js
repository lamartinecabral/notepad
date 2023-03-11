// @ts-check

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../config.js";
import { State } from "./state";

// Initialize Firebase
console.log(`init firebase (${State.docId})`);

const app = initializeApp(firebaseConfig, State.docId || '');

export const auth = getAuth(app);

export const storage = getStorage(app);
