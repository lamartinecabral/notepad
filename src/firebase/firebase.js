// @ts-check
import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "./config.js";

/**
 * @param {string} [name]
 */
export const initApp = (name) => {
  const app = initializeApp(firebaseConfig, name);
  return {
    get db() {
      return getFirestore(app);
    },
    get auth() {
      return getAuth(app);
    },
  };
};

export const firestore = {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
};
export const auth = {
  createUserWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
};
