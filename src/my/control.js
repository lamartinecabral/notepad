// @ts-check

import { Html } from "../iuai";
import { Id } from "./enum";
import { makeDoc } from "./html";
import { Service } from "./service";
import { State } from "./state";

export function initStateListeners() {
  State.isLogged.sub(function (value) {
    if (typeof value !== "boolean") return;
    Html.get(Id.loginContainer).hidden = value;
    Html.get(Id.content).hidden = !value;
  });
  State.signupMode.sub(function (value) {
    Html.get(Id.password2).hidden = !value;
    // @ts-ignore
    Html.get(Id.loginSubmit).value = value ? "Create" : "Login";
    Html.getParent(Id.signinMode).hidden = !value;
    Html.getParent(Id.signupMode).hidden = value;
    Html.getParent(Id.resetPassword).hidden = value;
    // @ts-ignore
    Html.get(Id.loginForm).reset();
  });
  State.message.sub(function (value) {
    Html.get(Id.message).innerText = value;
    Html.get(Id.message).hidden = !value;
    Html.getChild(Id.docList).hidden = !!value;
  });
}

export class Control {
  static addDoc(doc) {
    State.docs.push(doc);
    Html.getChild(Id.docList).append(makeDoc(doc));
    State.message.pub("");
  }
  static removeDoc(doc) {
    const message =
      "Are you sure? The note will be available for another user to claim it.";
    if (!confirm(message)) return;
    State.docs = State.docs.filter((d) => d.id !== doc.id);
    Html.get("tr_" + doc.id).remove();
    Service.drop(doc.id);
    if (!State.docs.length)
      State.message.pub("You have not claimed any notes yet.");
  }
  static setProtected(id, value) {
    /** @type {HTMLInputElement} */ // @ts-ignore
    const publ = Html.get("cbpubl_" + id);
    /** @type {HTMLButtonElement} */ // @ts-ignore
    const drop = Html.get("bt_" + id);
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
    const list = Html.getChild(Id.docList);
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
  /** @type {{elemId: Id, event: keyof HTMLElementEventMap, handler: any}[]} */
  const eventHandlers = [
    {
      elemId: Id.loginForm,
      event: "submit",
      handler: function (/** @type {HTMLElementEventMap['submit']} */ ev) {
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
      },
    },
    {
      elemId: Id.claimButton,
      event: "click",
      handler: function () {
        const docId = prompt("Note ID:");
        if (!docId) return;
        /** @type {HTMLInputElement} */ // @ts-ignore
        Service.claim(docId).catch((err) => {
          console.error(err);
          alert(
            "Failed. The note already has owner or is protected or does not exist."
          );
        });
      },
    },
    {
      elemId: Id.logout,
      event: "click",
      handler: function () {
        Service.logout();
      },
    },
    {
      elemId: Id.resetPassword,
      event: "click",
      handler: function () {
        const email = Html.get(Id.loginForm)[0].value;
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
      },
    },
    {
      elemId: Id.signinMode,
      event: "click",
      handler: function (ev) {
        State.signupMode.pub(false);
      },
    },
    {
      elemId: Id.signupMode,
      event: "click",
      handler: function (ev) {
        State.signupMode.pub(true);
      },
    },
  ];

  eventHandlers.forEach(function (entry) {
    try {
      Html.get(entry.elemId).addEventListener(entry.event, entry.handler);
    } catch (err) {
      console.log("unable to add event listener", entry);
      throw err;
    }
  });
}
