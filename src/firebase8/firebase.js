// @ts-check
import { firebaseConfig } from "../firebase/config.js";

/** @import {default as firebase} from '../../dist/assets/firebase@8.2.4' */
/** @import {DocumentSnapshot, QuerySnapshot} from 'firebase/firestore' */

/** @type {import('../../dist/assets/firebase@8.2.4').default} */ // @ts-ignore
const firebase = window.firebase;

/**
 * @param {string} [name]
 */
export const initApp = (name) => {
  const app = firebase.initializeApp(firebaseConfig, name);
  return {
    get db() {
      return app.firestore();
    },
    get auth() {
      return app.auth();
    },
    get storage() {
      return app.storage();
    },
  };
};

export const storage = {
  /** @param {firebase.storage.Reference} ref */
  deleteObject: (ref) => ref.delete(),
  /** @param {firebase.storage.Reference} ref */
  getDownloadURL: (ref) => ref.getDownloadURL(),
  /** @param {firebase.storage.Reference} ref */
  listAll: (ref) => ref.listAll(),
  /** @param {firebase.storage.Storage} storage */
  ref: (storage, path) => storage.ref(path),
  /**
   * @param {firebase.storage.Reference} ref
   * @param {Blob | Uint8Array | ArrayBuffer} data
   * */
  uploadBytes: (ref, data) => ref.put(data),
};
export const firestore = {
  /** @param {firebase.firestore.Firestore} db */
  collection: (db, ...path) => db.collection(path.join("/")),
  /** @param {firebase.firestore.DocumentReference} docRef */
  deleteDoc: (docRef) => docRef.delete(),
  deleteField: () => firebase.firestore.FieldValue.delete(),
  /** @param {firebase.firestore.Firestore} db */
  doc: (db, ...path) => db.doc(path.join("/")),
  /** @param {firebase.firestore.DocumentReference} docRef */
  getDoc: (docRef, options) => docRef.get(options).then(mapDoc),
  /**
   * @param {firebase.firestore.DocumentReference | firebase.firestore.Query} ref
   * @param {(snapshot: DocumentSnapshot | QuerySnapshot) => void} onNext
   * @param {(error: firebase.firestore.FirestoreError) => void} [onError]
   * @param {() => void} [onCompletion]
   */
  onSnapshot: (ref, onNext, onError, onCompletion) => {
    if ("id" in ref)
      return ref.onSnapshot(
        // @ts-ignore
        (doc) => onNext(mapDoc(doc)),
        onError,
        onCompletion,
      );
    else
      return ref.onSnapshot(
        // @ts-ignore
        (query) => onNext(mapQuery(query)),
        onError,
        onCompletion,
      );
  },
  /** @param {firebase.firestore.DocumentReference} docRef */
  setDoc: (docRef, data) => docRef.set(data),
  /** @param {firebase.firestore.DocumentReference} docRef */
  updateDoc: (docRef, data) => docRef.update(data),
  /** @param {firebase.firestore.Query} query */
  getDocs: (query, options) => query.get(options),
  /**
   * @param {firebase.firestore.CollectionReference} colRef
   * @param {[string | firebase.firestore.FieldPath, firebase.firestore.WhereFilterOp, any]} where
   * */
  query: (colRef, where) => colRef.where(...where),
  /**
   * @param {string | firebase.firestore.FieldPath} fieldPath
   * @param {firebase.firestore.WhereFilterOp} opStr
   * @returns {[string | firebase.firestore.FieldPath, firebase.firestore.WhereFilterOp, any]}
   * */
  where: (fieldPath, opStr, value) => [fieldPath, opStr, value],
};
export const auth = {
  /** @param {firebase.auth.Auth} auth */
  createUserWithEmailAndPassword: (auth, email, password) =>
    auth.signInWithEmailAndPassword(email, password),
  /**
   * @param {firebase.auth.Auth} auth
   * @param {Parameters<firebase.auth.Auth['onAuthStateChanged']>[0]} nextOrObserver
   * @param {Parameters<firebase.auth.Auth['onAuthStateChanged']>[1]} [error]
   * */
  onAuthStateChanged: (auth, nextOrObserver, error) =>
    auth.onAuthStateChanged(nextOrObserver, error),
  /** @param {firebase.User} user */
  sendEmailVerification: (user) => user.sendEmailVerification(),
  /** @param {firebase.auth.Auth} auth */
  sendPasswordResetEmail: (auth, email) => auth.sendPasswordResetEmail(email),
  /** @param {firebase.auth.Auth} auth */
  signInWithEmailAndPassword: (auth, email, password) =>
    auth.signInWithEmailAndPassword(email, password),
  /** @param {firebase.auth.Auth} auth */
  signOut: (auth) => auth.signOut(),
};

/** @type {(doc: firebase.firestore.DocumentSnapshot) => DocumentSnapshot} */
const mapDoc = (doc) => ({
  data: () => (doc.exists ? doc.data() : undefined),
  // @ts-ignore
  exists: () => {
    return doc.exists;
  },
  get id() {
    return doc.id;
  },
  get metadata() {
    return doc.metadata;
  },
});

/** @type {(query: firebase.firestore.QuerySnapshot) => QuerySnapshot} */
const mapQuery = (query) => ({
  get docs() {
    return query.docs.map(mapDoc);
  },
  get size() {
    return query.size;
  },
  get empty() {
    return query.empty;
  },
  metadata: query.metadata,
  docChanges: undefined,
  forEach: undefined,
  query: undefined,
});
