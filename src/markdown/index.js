// @ts-check
import { marked } from "marked";
import Prism from "./prism";
import { State } from "./state";
import * as firebase from "../firebase";
import { Cache } from "../cache";

const { auth, db } = firebase.initApp(State.docId || "");
const { onAuthStateChanged } = firebase.auth;
const { doc, onSnapshot } = firebase.firestore;

var markdown = {
  /** @type {(id: string) => HTMLElement} */
  // @ts-ignore
  elem: (id) => document.getElementById(id),
  content: () => markdown.elem("content"),

  initApp: function () {
    console.log("initMarkdown");
    markdown.setMarkedOptions();
    if (!State.docId)
      markdown.setContent("# Marked in browser\n\nRendered by **marked**.");
    else {
      const text = Cache.getText();
      if (text !== null) markdown.setContent(text);
      markdown.liveContent(State.docId);
      markdown.liveAuth();
    }
  },

  /** @param {string} text */
  setContent: function (text) {
    markdown.content().innerHTML = marked.parse(text);
  },

  liveAuth: function () {
    onAuthStateChanged(auth, function (user) {
      if (user) {
        console.log("user logged");
      } else {
        console.log("No user.");
      }
    });
  },

  /** @type {() => void} */
  // @ts-ignore
  killLiveContent: null,
  liveContent: function (docId, col = "docs") {
    markdown.killLiveContent = onSnapshot(
      doc(db, col, docId),
      (res) => {
        if (res.metadata.hasPendingWrites) return;
        markdown.setContent(res.exists() ? res.data().text : "");
        if (State.hash) markdown.scrollToHash();
        if (Cache.getText() !== null) {
          Cache.setText(res.exists() ? res.data().text : "");
        }
      },
      (err) => {
        console.error(err);
        markdown.setContent(err.message);
      },
    );
  },

  scrollToHash: function () {
    setTimeout(() => {
      const elem = markdown.elem(State.hash);
      if (!elem) return;
      const y = elem.offsetTop;
      document.body.scrollTop = y;
      State.hash = "";
    }, 50);
  },

  setMarkedOptions: function () {
    marked.setOptions({
      breaks: true,
      highlight: function (code) {
        return Prism.highlight(code, Prism.languages.javascript, "javascript");
      },
    });
  },
};

markdown.initApp();
