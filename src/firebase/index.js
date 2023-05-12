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
  deleteField,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "./config.js";

const app = { initializeApp };
const storage = {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
};
const firestore = {
  deleteField,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
};
const auth = {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
};
const config = firebaseConfig;

const firebase = {
  app,
  storage,
  firestore,
  auth,
  config,
};

// @ts-ignore
window.firebase = firebase;
export default firebase;
