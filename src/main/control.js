// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { debounce } from "../utils";
import { Id } from "./refs";
import { elem } from "iuai";

export function initStateListeners() {
  State.protected.sub(function (value) {
    elem.get(Id.protected, "input").checked = value;
    elem.getParent(Id.public).hidden = !value;
    Control.setClaimButton();
  });

  State.public.sub(function (value) {
    elem.get(Id.public, "input").checked = value;
  });

  State.status.sub(function (value) {
    elem.getChild(Id.status).innerText = value;
  });

  State.isHidden.sub(function (value) {
    elem.get(Id.textarea).hidden = value;
    elem.get(Id.footer).hidden = value;
    if (!value) {
      elem.get(Id.markdown, "a").href =
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
    elem.getChild(Id.claim, "a").href =
      location.origin + "/my/?claim=" + State.docId;
  }
}

export function initEventListeners() {
  elem.get(Id.app).addEventListener("keyup", (ev) => {
    if (ev.key === "Escape" || ev.keyCode === 27) {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    }
  });

  elem.get(Id.theme).addEventListener("click", () => {
    State.nightMode.pub(!State.nightMode.value);
  });

  elem.get(Id.password).addEventListener("click", () => {
    State.showPassword.pub(true);
  });

  elem.get(Id.options).addEventListener("click", () => {
    State.showOptions.pub(true);
  });

  elem.get(Id.backdrop).addEventListener("click", () => {
    State.showPassword.pub(false);
    State.showOptions.pub(false);
  });

  elem.get(Id.modal).addEventListener("click", (ev) => {
    ev.stopPropagation();
  });

  elem.get(Id.protected).addEventListener("change", () => {
    Service.setProtected(!State.protected.value);
    elem.getParent(Id.public).hidden = State.protected.value;
  });

  elem.get(Id.public).addEventListener("change", () => {
    Service.setPublic(!State.public.value);
  });

  elem.get(Id.logout).addEventListener("click", () => {
    Service.logout();
    State.showOptions.pub(false);
  });

  elem.get(Id.form).addEventListener("submit", (ev) => {
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

  elem.get(Id.resetPassword).addEventListener("click", () => {
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

  elem.get(Id.textarea).addEventListener("keydown", (ev) => {
    if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (ev.keyCode === 9 || ev.key === "Tab") {
      ev.preventDefault();
      return document.execCommand("insertText", false, "\t");
    } else if (ev.keyCode === 13 || ev.key === "Enter") {
      ev.preventDefault();
      let ident = "";
      const target = elem.get(Id.textarea, "textarea");
      for (let j = target.selectionStart; j; ) {
        let char = target.value[--j];
        if (char === "\n") break;
        if (char === " " || char === "\t") ident = char + ident;
        else ident = "";
      }
      return document.execCommand("insertText", false, "\n" + ident);
    }
  });

  elem.get(Id.textarea).addEventListener(
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
