// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { debounce } from "../utils";
import { Id } from "./enum";
import { elem, handle } from "iuai";

export function initStateListeners() {
  State.protected.sub(function (value) {
    elem.get("input", Id.protected).checked = value;
    elem.getParent(Id.public).hidden = !value;
    Control.setClaimButton();
  });

  State.public.sub(function (value) {
    elem.get("input", Id.public).checked = value;
  });

  State.status.sub(function (value) {
    elem.getChild(Id.status).innerText = value;
  });

  State.isHidden.sub(function (value) {
    elem.get(Id.textarea).hidden = value;
    elem.get(Id.footer).hidden = value;
    if (!value) {
      elem.get("a", Id.markdown).href =
        location.origin + "/markdown/?" + State.docId;
    }
  });

  State.isLogged.sub(function (value) {
    elem.get(Id.password).hidden = value;
    elem.get(Id.options).hidden = !value;
  });

  State.nightMode.sub(function (value) {
    const theme = ["light", "dark"];
    elem.get(Id.app).className = theme[+value];
    elem.get(Id.theme).innerText = theme[+!value];
    if (localStorage) localStorage.setItem("nightMode", "" + value);
  });

  State.showPassword.sub(function (value) {
    elem.get(Id.backdrop).hidden = !value;
    elem.get(Id.passwordModal).hidden = !value;
    elem.get(Id.passwordInput).focus();
    elem.get(State.hasOwner.value ? Id.emailInput : Id.passwordInput).focus();
  });

  State.showOptions.sub(function (value) {
    elem.get(Id.backdrop).hidden = !value;
    elem.get(Id.optionsModal).hidden = !value;
    elem.get(Id.protected).focus();
  });

  State.hasOwner.sub(function (value) {
    elem.get(Id.email).hidden = !value;
    elem.get(Id.resetPassword).hidden = !value;
    Control.setClaimButton();
  });
}

class Control {
  static setClaimButton() {
    elem.get(Id.claim).hidden = State.hasOwner.value || State.protected.value;
    elem.getChild("a", Id.claim).href =
      location.origin + "/my/?claim=" + State.docId;
  }
}

export function initEventListeners() {
  handle(elem.get(Id.app), "keyup", (ev) => {
    if (ev.key === "Escape" || ev.keyCode === 27) {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    }
  });

  handle(elem.get(Id.theme), "click", () => {
    State.nightMode.pub(!State.nightMode.value);
  });

  handle(elem.get(Id.password), "click", () => {
    State.showPassword.pub(true);
  });

  handle(elem.get(Id.options), "click", () => {
    State.showOptions.pub(true);
  });

  handle(elem.get(Id.backdrop), "click", () => {
    State.showPassword.pub(false);
    State.showOptions.pub(false);
  });

  handle(elem.get(Id.modal), "click", (ev) => {
    ev.stopPropagation();
  });

  handle(elem.get(Id.protected), "change", () => {
    Service.setProtected(!State.protected.value);
    elem.getParent(Id.public).hidden = State.protected.value;
  });

  handle(elem.get(Id.public), "change", () => {
    Service.setPublic(!State.public.value);
  });

  handle(elem.get(Id.logout), "click", () => {
    Service.logout();
    State.showOptions.pub(false);
  });

  handle(elem.get(Id.form), "submit", (ev) => {
    ev.preventDefault();
    if (!ev.target) return;
    const email = State.hasOwner.value
      ? ev.target[0].value
      : State.docId + "@notepade.web.app";
    const password = ev.target[1].value;
    Service.login(email, password);
    State.showPassword.pub(false);
    // @ts-ignore
    ev.target.reset();
  });

  handle(elem.get(Id.resetPassword), "click", () => {
    const email = elem.get(Id.form)[0].value;
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

  handle(elem.get(Id.textarea), "keydown", (ev) => {
    if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (ev.keyCode === 9 || ev.key === "Tab") {
      ev.preventDefault();
      return document.execCommand("insertText", false, "\t");
    } else if (ev.keyCode === 13 || ev.key === "Enter") {
      ev.preventDefault();
      let ident = "";
      const target = elem.get("textarea", Id.textarea);
      for (let j = target.selectionStart; j; ) {
        let char = target.value[--j];
        if (char === "\n") break;
        if (char === " " || char === "\t") ident = char + ident;
        else ident = "";
      }
      return document.execCommand("insertText", false, "\n" + ident);
    }
  });

  handle(
    elem.get(Id.textarea),
    "input",
    debounce(function () {
      State.status.pub("Saving...");
      Service.save()
        .then(() => {
          State.status.pub("");
        })
        .catch((err) => {
          console.error(err);
          State.status.pub("Protected");
        });
    }, 500)
  );
}
