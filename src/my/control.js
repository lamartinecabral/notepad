// @ts-check

import { elem, event } from "iuai";
import { Id } from "./enum";
import { docElem } from "./html";
import { Service } from "./service";
import { State } from "./state";

export function initStateListeners() {
  State.isLogged.sub(function (value) {
    if (typeof value !== "boolean") return;
    elem.get(Id.loginContainer).hidden = value;
    elem.get(Id.content).hidden = !value;
  });
  State.userEmail.sub(function (value) {
    elem.get(Id.userEmail).innerText = value;
  });
  State.signupMode.sub(function (value) {
    elem.get(Id.password2).hidden = !value;
    elem.get("input", Id.loginSubmit).value = value ? "Create" : "Login";
    elem.getParent(Id.signinMode).hidden = !value;
    elem.getParent(Id.signupMode).hidden = value;
    elem.getParent(Id.resetPassword).hidden = value;
    elem.get("form", Id.loginForm).reset();
  });
  State.message.sub(function (value) {
    elem.get(Id.message).innerText = value;
    elem.get(Id.message).hidden = !value;
    elem.getChild(Id.docList).hidden = !!value;
  });
}

export class Control {
  static addDoc(doc) {
    State.docs.push(doc);
    elem.getChild(Id.docList).append(docElem(doc));
    State.message.pub("");
  }
  static removeDoc(doc) {
    const message =
      "Are you sure? The note will be available for another user to claim it.";
    if (!confirm(message)) return;
    State.docs = State.docs.filter((d) => d.id !== doc.id);
    elem.get("tr_" + doc.id).remove();
    Service.drop(doc.id);
    if (!State.docs.length)
      State.message.pub("You have not claimed any notes yet.");
  }
  static setProtected(id, value) {
    const publ = elem.get("input", "cbpubl_" + id);
    const drop = elem.get("button", "bt_" + id);
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
    const list = elem.getChild(Id.docList);
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
  event(elem.get(Id.loginForm), "submit", (ev) => {
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

  event(elem.get(Id.claimButton), "click", () => {
    const docId = prompt("Note ID:");
    if (!docId) return;
    Service.claim(docId).catch((err) => {
      console.error(err);
      alert(
        "Failed. The note already has owner or is protected or does not exist."
      );
    });
  });

  event(elem.get(Id.logout), "click", () => {
    Service.logout();
  });

  event(elem.get(Id.resetPassword), "click", () => {
    const email = elem.get(Id.loginForm)[0].value;
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

  event(elem.get(Id.signinMode), "click", () => {
    State.signupMode.pub(false);
  });

  event(elem.get(Id.signupMode), "click", () => {
    State.signupMode.pub(true);
  });
}
