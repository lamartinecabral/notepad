// @ts-check

import { Html } from "../utils";
import { Id } from "./enum";
import { makeList } from "./html";
import { Service } from "./service";
import { State } from "./state";

export function initStateListeners() {
  State.isLogged.sub(function (value) {
    if (typeof value !== "boolean") return;
    Html.get(Id.loginContainer).hidden = value;
    Html.get(Id.content).hidden = !value;
  });
  State.docs.sub(function (value) {
    const ul = Html.getChild(Id.docList);
    if (ul) ul.remove();
    Html.get(Id.docList).append(makeList(value));
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
        /** @type {HTMLInputElement} */ // @ts-ignore
        const input = Html.get(Id.claimInput);
        const docId = input.value;
        Service.claim(docId)
          .then(() => {
            input.value = "";
          })
          .catch((err) => {
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
