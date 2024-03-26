// @ts-check
import { QRCode } from "./qrcode";
import { auth, db } from "./firebase";
import { State } from "./state";

/** @type {import('../firebase/firebase')} */
// @ts-ignore
const firebase = window.firebase;

const { onAuthStateChanged } = firebase.auth;
const { doc, onSnapshot } = firebase.firestore;

var qrcode = {
  /** @type {(id: string) => HTMLElement} */
  // @ts-ignore
  elem: (id) => document.getElementById(id),
  content: () => qrcode.elem("content"),

  initApp: function () {
    console.log("init qrcode");
    if (!State.docId) qrcode.setContent("lorem ipsum");
    else {
      qrcode.liveContent(State.docId);
      qrcode.liveAuth();
    }
  },

  /** @param {string} text */
  setContent: function (text) {
    const width = Math.min(screen.height, screen.width);

    QRCode.toDataURL(text, { errorCorrectionLevel: "H", width })
      .catch((_) =>
        QRCode.toDataURL(text, {
          errorCorrectionLevel: "L",
          width,
        })
      )
      .then((dataUrl) => {
        const img = document.createElement("img");
        img.src = dataUrl;
        img.style.width = "100%";
        qrcode.content().innerHTML = img.outerHTML;
      })
      .catch((err) => {
        const pre = document.createElement("pre");
        pre.innerText = String(err);
        pre.style.whiteSpace = "normal";
        pre.style.padding = "8px";
        qrcode.content().innerHTML = pre.outerHTML;
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

  /** @type {() => void} */
  // @ts-ignore
  killLiveContent: null,
  liveContent: function (docId, col = "docs") {
    qrcode.killLiveContent = onSnapshot(
      doc(db, col, docId),
      (res) => {
        if (res.metadata.hasPendingWrites) return;
        qrcode.setContent(res.exists() ? res.data().text : "");
      },
      (err) => {
        console.error(err);
        qrcode.setContent(err.message);
      }
    );
  },
};

qrcode.initApp();
