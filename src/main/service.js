// @ts-check

import { State } from "./state";
import { Html } from "./html";

/** @type {import('../firebase')['default']} */ // @ts-ignore
const firebase = window.firebase;

const app = firebase.app.initializeApp(firebase.config, State.docId || "");
const auth = firebase.auth.getAuth(app);
const db = firebase.firestore.getFirestore(app);

const { doc, onSnapshot, updateDoc, setDoc, deleteField } = firebase.firestore;

const {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} = firebase.auth;

/** @type {any} */ let offSnapshot = null;
/** @type {any} */ let offAuthStateChanged = null;

export function initAuthListener() {
  if (offAuthStateChanged) offAuthStateChanged();
  offAuthStateChanged = onAuthStateChanged(auth, function (user) {
    if (user) {
      // @ts-ignore
      if (user.email.split("@")[0] === State.docId) {
        console.log("user logged");
        State.isLogged.pub(true);
      } else {
        console.log("user not logged");
        State.isLogged.pub(false);
      }
    } else {
      console.log("no user");
      State.isLogged.pub(false);
    }
  });
}

export function initDocListener() {
  if (offSnapshot) offSnapshot();
  offSnapshot = onSnapshot(
    doc(db, "docs", State.docId),
    function (res) {
      const data = res.data() || { text: "" };
      if (res.exists()) {
        State.protected.pub(data.protected !== undefined);
        State.public.pub(data.public !== undefined);
      } else {
        State.protected.pub(false);
        State.public.pub(false);
      }
      if (res.metadata.hasPendingWrites) return;
      State.isHidden.pub(false);
      State.status.pub("");
      Html.text = data.text;
    },
    function (err) {
      console.error(err);
      State.isHidden.pub(true);
      State.status.pub("Protected");
    }
  );
}

export const Service = class {
  static login(password) {
    const email = State.docId + "@notepade.web.app";
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User signed in");
        initDocListener();
      })
      .catch((err) => {
        if (err.code !== "auth/user-not-found") {
          alert(err.message);
          throw err;
        }
        return createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            console.log("User created");
            initDocListener();
          })
          .catch((err) => {
            alert(err.message);
            throw err;
          });
      });
  }

  static logout() {
    signOut(auth);
  }

  static save() {
    const docRef = doc(db, "docs", State.docId);
    return updateDoc(docRef, { text: Html.text }).catch(() =>
      setDoc(docRef, { text: Html.text })
    );
  }

  static update(obj) {
    return updateDoc(doc(db, "docs", State.docId), obj);
  }

  static setProtected(value = true) {
    if (value) {
      // @ts-ignore
      return Service.update({ protected: auth.currentUser.uid });
    } else {
      return Service.update({ public: deleteField() }).then(() =>
        Service.update({ protected: deleteField() })
      );
    }
  }
  static setPublic(value = true) {
    if (value) {
      return Service.update({ public: true });
    } else {
      return Service.update({ public: deleteField() });
    }
  }
};
