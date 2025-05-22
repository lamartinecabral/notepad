// @ts-check
import { State } from "./state";
import { elem, style, getElem } from "../iuai";
import * as firebase from "../firebase";

const { auth, storage } = firebase.initApp(State.docId || "");
const { onAuthStateChanged } = firebase.auth;
const { deleteObject, getDownloadURL, listAll, ref, uploadBytes } =
  firebase.storage;

const drive = {
  initApp: () => {
    console.log("initDrive");

    style("*", { fontFamily: "monospace" });
    style("#wait", { position: "absolute", background: "white" });
    document.body.appendChild(
      elem("div", [
        elem("div", { id: "wait", hidden: true }, "please wait..."),
        elem("button", { onclick: () => drive.selectFile() }, "upload"),
        elem("input", {
          id: "input",
          type: "file",
          hidden: true,
          onchange: (ev) => drive.upload(ev.target.files[0]),
        }),
        elem("div", [elem("table", { id: "table" })]),
      ]),
    );

    if (State.docId) {
      drive.liveAuth();
    }
  },

  liveAuth: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // @ts-ignore
        if (user.email.split("@")[0] === State.docId) {
          console.log("Logged");
        } else {
          console.log("Not logged");
        }
      } else {
        console.log("No user.");
      }
      drive.listAll();
    });
  },

  listAll: () => {
    drive.waiting = true;
    listAll(ref(storage, State.docId))
      .then((res) => {
        Promise.all(
          res.items
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .map((item) => getDownloadURL(item)),
        ).then((urls) => {
          for (var i = 0; i < urls.length; i++) {
            drive.addItem(res.items[i], urls[i]);
          }
          drive.waiting = false;
        });
      })
      .catch((err) => {
        drive.waiting = false;
        drive.clearList();
        drive.error(err);
      });
  },

  clearList: () => {
    const table = getElem("table");
    for (let i = table.children.length - 1; i >= 0; i--) {
      const tr = table.children[i];
      tr.remove();
    }
  },

  addItem: (itemRef, url) => {
    document.getElementById(itemRef.fullPath)?.remove();

    getElem("table").appendChild(
      elem("tr", { id: itemRef.fullPath }, [
        elem("td", [
          elem("a", {
            download: itemRef.name,
            innerText: itemRef.name,
            target: "_blank",
            href: url,
          }),
        ]),
        elem("td", [
          elem("button", {
            innerText: "delete",
            onclick: () => drive.delete(itemRef.fullPath),
          }),
        ]),
      ]),
    );
  },

  selectFile: () => {
    if (drive.waiting) return;
    getElem("input").click();
  },

  upload: (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return drive.error("size limit exceeded");
    const storageRef = ref(storage, State.docId + "/" + file.name);
    drive.waiting = true;
    uploadBytes(storageRef, file)
      .then(() => {
        drive.listAll();
      })
      .catch((err) => {
        drive.error(err);
        drive.waiting = false;
      });
  },

  delete: (fullPath) => {
    if (drive.waiting) return;
    drive.waiting = true;
    deleteObject(ref(storage, fullPath))
      .then(() => {
        document.getElementById(fullPath)?.remove();
        drive.waiting = false;
      })
      .catch((err) => {
        drive.error(err);
        drive.waiting = false;
      });
  },

  error: (err) => {
    alert(err.message || err);
    console.error(err);
  },

  get waiting() {
    return !getElem("wait").hidden;
  },

  set waiting(val) {
    getElem("wait").hidden = !val;
  },
};

// @ts-ignore
window.drive = drive;
drive.initApp();
