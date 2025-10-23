// @ts-check

import { State } from "./state";
import { Html } from "./html";
import * as firebase from "../firebase";
import { Cache } from "../cache";

const { auth, db } = firebase.initApp(State.docId || "");

const { doc, getDoc, onSnapshot, updateDoc, setDoc, deleteField } =
  firebase.firestore;

const {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} = firebase.auth;

/** @type {any} */ let offSnapshot = null;
/** @type {any} */ let offAuthStateChanged = null;

export function initAuthListener() {
  if (offAuthStateChanged) offAuthStateChanged();
  offAuthStateChanged = onAuthStateChanged(auth, function (user) {
    Service.isLogged().then((value) => {
      if (!value) Cache.setText(null);
      else if (Cache.getText() === null) Cache.setText(Html.text);
      State.isLogged.pub(value);
    });
  });
}

export function initCache() {
  const text = Cache.getText();
  if (!text) return;
  Html.text = text;
  State.isHidden.pub(false);
  State.status.pub("");
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
    },
  );
}

export const Service = class {
  static login(email, password) {
    const isOwnerLogin = email !== State.docId + "@notepade.web.app";
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        initDocListener();
        return "user signed in";
      })
      .catch((err) => {
        if (isOwnerLogin || err.code !== "auth/user-not-found") {
          alert(err.message);
          throw err;
        }
        return createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            initDocListener();
            return "user created";
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
    if (State.isLogged.value) Cache.setText(Html.text);
    const docRef = doc(db, "docs", State.docId);
    return updateDoc(docRef, { text: Html.text }).catch(() =>
      setDoc(docRef, { text: Html.text }),
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
        Service.update({ protected: deleteField() }),
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

  static checkOwnership() {
    const docRef = doc(db, "ownerships", State.docId);
    return getDoc(docRef)
      .then((value) => {
        const hasOwner = value.exists();
        const isOwner =
          hasOwner && value.data().owner === (auth.currentUser || {}).uid;
        return { hasOwner, isOwner };
      })
      .catch(() => ({
        hasOwner: true,
        isOwner: false,
      }))
      .then((result) => {
        State.hasOwner.pub(result.hasOwner);
        return result;
      });
  }
  static isLogged() {
    return Service.checkOwnership().then((details) => {
      const user = auth.currentUser;
      if (user)
        return details.hasOwner
          ? details.isOwner
          : (user.email || "").split("@")[0] === State.docId;
      else return false;
    });
  }

  static resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
};
