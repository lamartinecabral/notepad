// @ts-check

import { State } from "./state";

/** @type {import('../firebase')['default']} */ // @ts-ignore
const firebase = window.firebase;

const app = firebase.app.initializeApp(firebase.config);
const auth = firebase.auth.getAuth(app);
const db = firebase.firestore.getFirestore(app);

const { collection, query, where, getDocs, setDoc, doc, deleteDoc } =
  firebase.firestore;

const {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} = firebase.auth;

/** @type {any} */ let offAuthStateChanged = null;

export function initAuthListener() {
  if (offAuthStateChanged) offAuthStateChanged();
  offAuthStateChanged = onAuthStateChanged(auth, function (user) {
    if (user) {
      if (!user.emailVerified) {
        Service.sendEmailVerification().then(() => {
          alert("Check your mailbox to verify your e-mail.");
          State.signupMode.pub(false);
          auth.signOut();
        });
      } else {
        console.log("user signed in:", user.email);
        State.isLogged.pub(true);
        listDocs();
      }
    } else {
      console.log("no user");
      State.isLogged.pub(false);
    }
  });
}

export function listDocs() {
  return getDocs(
    query(
      collection(db, "ownerships"),
      where("owner", "==", (auth.currentUser || {}).uid)
    )
  )
    .then(function (res) {
      if (res.metadata.hasPendingWrites) return;
      State.docs.pub(res.docs.map((doc) => doc.id));
    })
    .catch(function (err) {
      console.error(err);
      State.docs.pub([]);
    });
}

export class Service {
  static createUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  static sendEmailVerification() {
    if (!auth.currentUser) throw new Error("no user");
    return sendEmailVerification(auth.currentUser);
  }

  static login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).catch((err) => {
      alert(err.message);
      throw err;
    });
  }

  static logout() {
    return signOut(auth);
  }

  static claim(docId) {
    return setDoc(doc(db, "ownerships", docId), {
      owner: (auth.currentUser || {}).uid,
    }).then(() => listDocs());
  }

  static drop(docId) {
    return deleteDoc(doc(db, "ownerships", docId)).then(() => listDocs());
  }

  static resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
}
