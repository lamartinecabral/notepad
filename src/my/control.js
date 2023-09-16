// @ts-check

import { getChild, getElem, getParent } from "../iuai";
import {
  loginContainer,
  content,
  userEmail,
  password2,
  loginSubmit,
  signinMode,
  signupMode,
  resetPassword,
  loginForm,
  message,
  docList,
  claimButton,
  logout,
} from "./refs";
import { docElem } from "./html";
import { Service } from "./service";
import { State } from "./state";

export function initStateListeners() {
  State.isLogged.sub(function (value) {
    if (typeof value !== "boolean") return;
    loginContainer().hidden = value;
    content().hidden = !value;
  });
  State.userEmail.sub(function (value) {
    userEmail().innerText = value;
  });
  State.signupMode.sub(function (value) {
    password2().hidden = !value;
    loginSubmit().value = value ? "Create" : "Login";
    getParent(signinMode.id).hidden = !value;
    getParent(signupMode.id).hidden = value;
    getParent(resetPassword.id).hidden = value;
    loginForm().reset();
  });
  State.message.sub(function (value) {
    message().innerText = value;
    message().hidden = !value;
    getChild(docList.id).hidden = !!value;
  });
}

export class Control {
  static addDoc(doc) {
    State.docs.push(doc);
    getChild(docList.id).append(docElem(doc));
    State.message.pub("");
  }
  static removeDoc(doc) {
    const message =
      "Are you sure? The note will be available for another user to claim it.";
    if (!confirm(message)) return;
    State.docs = State.docs.filter((d) => d.id !== doc.id);
    getElem("tr_" + doc.id).remove();
    Service.drop(doc.id);
    if (!State.docs.length)
      State.message.pub("You have not claimed any notes yet.");
  }
  static setProtected(id, value) {
    const publ = getElem("cbpubl_" + id, "input");
    const drop = getElem("bt_" + id, "button");
    if (!value) publ.checked = false;
    publ.disabled = !value;
    drop.disabled = value;
    Service.setProtected(id, value);
  }
  static setPublic(id, value) {
    Service.setPublic(id, value);
  }
  static clear() {
    State.docs = [];
    const list = getChild(docList.id);
    for (let i = list.children.length - 1; i >= 1; --i)
      list.children[i].remove();
  }

  static checkUrlParams() {
    const url = new URL(location.href);
    const docId = new URL(location.href).searchParams.get("claim");
    if (!docId) return;
    Service.claim(docId)
      .catch((err) => {
        console.error(err);
        alert(
          "Failed. The note already has owner or is protected or does not exist."
        );
      })
      .then(() => {
        url.searchParams.delete("claim");
        history.replaceState({}, "", url.href);
      });
  }
}

export function initEventListeners() {
  getElem(loginForm.id).addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!ev.target) return;
    const email = ev.target[0].value;
    const password = ev.target[1].value;
    if (!State.signupMode.value)
      // @ts-ignore
      return Service.login(email, password).then(() => ev.target.reset());
    const password2 = ev.target[2].value;
    if (password !== password2) return alert("passwords do not match");
    Service.createUser(email, password).catch((err) => {
      console.error(err);
      alert(err.message);
    });
  });

  getElem(claimButton.id).addEventListener("click", () => {
    const docId = prompt("Note ID:");
    if (!docId) return;
    Service.claim(docId).catch((err) => {
      console.error(err);
      alert(
        "Failed. The note already has owner or is protected or does not exist."
      );
    });
  });

  getElem(logout.id).addEventListener("click", () => {
    Service.logout();
  });

  getElem(resetPassword.id).addEventListener("click", () => {
    const email = getElem(loginForm.id)[0].value;
    Service.resetPassword(email)
      .then(() => {
        alert(
          "You will receive an e-mail with instructions to reset your password."
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  });

  getElem(signinMode.id).addEventListener("click", () => {
    State.signupMode.pub(false);
  });

  getElem(signupMode.id).addEventListener("click", () => {
    State.signupMode.pub(true);
  });
}
