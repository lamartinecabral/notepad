// @ts-check
import QRCode from "qrcode/lib/browser.js";
import { State } from "./state";
import * as firebase from "../firebase";
import { elem, getElem, style } from "../iuai";
import { debounce } from "../utils";

const { auth, db } = firebase.initApp(State.docId || "");
const { onAuthStateChanged } = firebase.auth;
const { doc, onSnapshot, updateDoc, setDoc } = firebase.firestore;

var qrcode = {
  initApp: function () {
    if (!State.docId) return;
    console.log("init qrcode");

    style("*", { fontFamily: "monospace" });
    style("body", { margin: "0", padding: "0" });
    style("#content", {
      width: "min(100vw, 100vh)",
      height: "min(100vw, 100vh)",
    });
    style("#text", {
      width: "calc(min(100vw, 100vh) - 2rem)",
      height: "calc(100vh - 1rem)",
      padding: "0 1rem",
    });
    style("#text_input", { width: "100%", resize: "vertical" });

    document.body.append(
      ...[
        elem("div", { id: "content" }),
        elem("div", { id: "text" }, [
          elem("textarea", {
            id: "text_input",
            rows: 1,
            oninput: () => qrcode.handleInputChange(),
          }),
        ]),
      ],
    );

    qrcode.liveContent(State.docId);
    qrcode.liveAuth();
  },

  /** @param {string} text */
  setText: function (text) {
    getElem("content").firstElementChild?.remove();
    getElem("content").appendChild(
      elem("pre", { style: { whiteSpace: "normal", padding: "8px" } }, text),
    );
  },

  renderedText: "",
  /** @param {string} text */
  setQRCode: function (text) {
    const width = Math.min(screen.height, screen.width);

    QRCode.toDataURL(text, { errorCorrectionLevel: "H", width })
      .catch((_) =>
        QRCode.toDataURL(text, {
          errorCorrectionLevel: "L",
          width,
        }),
      )
      .then((dataUrl) => {
        getElem("content").firstElementChild?.remove();
        getElem("content").appendChild(
          elem("img", {
            src: dataUrl,
            style: { width: "100%" },
          }),
        );
        qrcode.renderedText = text;
      })
      .catch((err) => {
        console.error(err);
        qrcode.setText(String(err));
      });
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

  /** @type {() => void} */ // @ts-ignore
  killLiveContent: null,
  liveContent: function (docId, col = "docs") {
    qrcode.killLiveContent = onSnapshot(
      doc(db, col, docId),
      (res) => {
        if (res.metadata.hasPendingWrites) return;

        const text = res.exists() ? res.data().text : "";
        getElem("text_input", "textarea").value = text;
        qrcode.setQRCode(text);
      },
      (err) => {
        console.error(err);
        qrcode.setText(String(err));
      },
    );
  },

  save: function () {
    const text = getElem("text_input", "textarea").value;
    const docRef = doc(db, "docs", State.docId);
    return updateDoc(docRef, { text })
      .catch(() => setDoc(docRef, { text }))
      .then(() => {
        qrcode.setQRCode(text);
      })
      .catch(() => {
        getElem("text_input", "textarea").value = qrcode.renderedText;
      });
  },

  handleInputChange: debounce(() => qrcode.save(), 500),
};

qrcode.initApp();
