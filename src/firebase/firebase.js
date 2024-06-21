// @ts-check
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
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
 * @overload
 * @param {import('firebase/app').FirebaseOptions} [options]
 * @param {string} [name]
 * @return {import('firebase/app').FirebaseApp}
 */

/**
 * @overload
 * @param {import('firebase/app').FirebaseOptions} [options]
 * @param {import('firebase/app').FirebaseAppSettings} [settings]
 * @return {import('firebase/app').FirebaseApp}
 */

/**
 * @overload
 * @param {string} [name]
 * @return {import('firebase/app').FirebaseApp}
 */

function initApp(...args) {
  if (args.length === 0) return initializeApp(firebaseConfig);
  if (typeof args[0] === "string")
    return initializeApp(firebaseConfig, args[0]);
  // @ts-ignore
  return initializeApp(...args);
}

export const app = { initializeApp: initApp };
export const storage = {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
};
export const firestore = {
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
};
export const auth = {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
};
