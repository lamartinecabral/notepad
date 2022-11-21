// @ts-check

import { State } from "./state.js";
import { View } from "./view.js";
import {
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase.js";

export const Server = {
  /** @type {import("firebase/auth").Unsubscribe} */
  // @ts-ignore
  killLiveContent: null,
  liveContent: function (docId, colId = "docs") {
    Server.killLiveContent = onSnapshot(
      doc(db, colId, docId),
      (res) => {
        if (res.exists()) {
          State.obj.protected = res.data().protected !== undefined;
          State.obj.public = res.data().public !== undefined;
        } else {
          State.obj.protected = false;
          State.obj.public = false;
        }
        if (State.diff()) View.updateButtons();

        if (res.metadata.hasPendingWrites) return;
        if (View.isHidden) {
          View.isHidden = false;
          View.textArea.elem().hidden = View.isHidden;
          View.status.elem().hidden = true;
          View.status.span().innerText = "Saving...";
          View.markdown.a().href = `${location.origin}/markdown/?${State.docId}`;
          View.markdown.elem().hidden = false;
        }
        View.textArea.set(res.exists() ? res.data().text : "");
      },
      (err) => {
        console.error(err);
        View.isHidden = true;
        View.textArea.elem().hidden = View.isHidden;
        View.status.elem().hidden = false;
        View.status.span().innerText = "Protected";
        View.markdown.elem().hidden = true;
      }
    );
  },

  liveAuth: function () {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // @ts-ignore
        if (user.email.split("@")[0] === State.docId) {
          console.log("Logged");
          State.obj.login = true;
        } else {
          console.log("Not logged");
          State.obj.login = false;
        }
      } else {
        console.log("No user.");
        State.obj.login = false;
      }
      if (State.diff()) View.updateButtons();
    });
  },

  /**
   * @param {string} text
   * @param {string} docId
   * @param {string} colId
   */
  setContent: async function (text, docId, colId = "docs") {
    if (!docId) return;
    const docRef = doc(db, colId, docId);
    return await updateDoc(docRef, { text })
      .catch(() => setDoc(docRef, { text }))
  },

  /** @param {string} password */
  login: function (password) {
    return new Promise((resolve, reject) => {
      let email = State.docId + "@notepade.web.app";
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("User signed in");
          if (Server.killLiveContent) Server.killLiveContent();
          Server.liveContent(State.docId);
          resolve("");
        })
        .catch((err) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              console.log("User created");
              if (Server.killLiveContent) Server.killLiveContent();
              Server.liveContent(State.docId);
              resolve("");
            })
            .catch(() => {
              console.error(err);
              reject(err);
            });
        });
    });
  },

  logout: function () {
    signOut(auth);
  },

  currentUser: function () {
    return auth.currentUser;
  },

  _update: function (obj, msg) {
    const docRef = doc(db, "docs", State.docId);
    return updateDoc(docRef, obj)
      .then(() => {
        console.log(msg);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  protect: function (flag = true) {
    if (flag) {
      Server._update(
        { protected: Server.currentUser()?.uid || "" },
        "This doc is now protected"
      );
    } else {
      Server._update(
        { public: deleteField() },
        "'public' attribute removed"
      ).then(() => {
        Server._update(
          { protected: deleteField() },
          "This doc is not protected anymore"
        ).then(() => {
          // firebase.auth().currentUser.delete().then(()=>{
          // 	console.log("User deleted");
          // })
        });
      });
    }
  },

  public: function (flag = true) {
    if (flag) {
      Server._update({ public: true }, "This doc is now public");
    } else {
      Server._update(
        { public: deleteField() },
        "'public' attribute removed"
      );
    }
  },

  unprotect: function () {
    return Server.protect(false);
  },

  unpublic: function () {
    return Server.public(false);
  },
};
