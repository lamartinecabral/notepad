// @ts-check

import { State } from "./state";
import { Html } from "./html";
import * as firebase from "../firebase";

/** @type {import("crytop")} */
const Crytop = globalThis.Crytop;

const _db = {};
function getDb() {
  if (_db[State.docId]) return _db[State.docId];
  const { db } = firebase.initApp(State.docId || undefined);
  return (_db[State.docId] = db);
}

function getDocId() {
  return Crytop.encrypt(State.docId, State.docId).then((docId) =>
    docId.replace(/\//g, "-"),
  );
}

const { doc, onSnapshot, updateDoc, setDoc } = firebase.firestore;

/** @type {any} */ let offSnapshot = null;

export async function initDocListener() {
  if (!State.docId) return;
  const docId = await getDocId();
  if (offSnapshot) offSnapshot();
  offSnapshot = onSnapshot(
    doc(getDb(), "docs", docId),
    async function (res) {
      const data = res.data() || { text: "" };
      if (res.metadata.hasPendingWrites) return;
      const text = await (data.text
        ? Crytop.decrypt(data.text, State.docId)
        : "");
      State.isHidden.pub(false);
      State.status.pub("");
      Html.text = text;
    },
    function (err) {
      console.error(err);
      State.isHidden.pub(true);
      State.status.pub("Protected");
    },
  );
}

export const Service = class {
  static async save() {
    const [text, docId] = await Promise.all([
      Html.text ? Crytop.encrypt(Html.text, State.docId) : "",
      getDocId(),
    ]);
    const docRef = doc(getDb(), "docs", docId);
    return updateDoc(docRef, { text }).catch(() => setDoc(docRef, { text }));
  }
};
