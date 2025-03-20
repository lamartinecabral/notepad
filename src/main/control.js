// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { debounce } from "../utils";
import {
  protectedInput,
  publicInput,
  status,
  textarea,
  footer,
  markdown,
  password,
  options,
  app,
  theme,
  backdrop,
  passwordModal,
  passwordInput,
  emailInput,
  optionsModal,
  email,
  resetPassword,
  claim,
  modal,
  logout,
  form,
  code,
} from "./refs";
import { getElem, getChild, getParent } from "../iuai";
import { Cache } from "../cache";

export function initStateListeners() {
  State.protected.sub(function (value) {
    protectedInput().checked = value;
    getParent(publicInput.id).hidden = !value;
    Control.setClaimButton();
  });

  State.public.sub(function (value) {
    publicInput().checked = value;
    Control.setReadonly();
  });

  State.status.sub(function (value) {
    getChild(status.id).innerText = value;
  });

  State.isHidden.sub(function (value) {
    textarea().hidden = value;
    footer().hidden = value;
    if (!value) {
      code().href = location.origin + "/code/?" + State.docId;
      markdown().href = location.origin + "/markdown/?" + State.docId;
    }
  });

  State.isLogged.sub(function (value) {
    password().hidden = value;
    options().hidden = !value;
    Control.setReadonly();
  });

  State.nightMode.sub(function (value) {
    const themes = ["light", "dark"];
    app().className = themes[+value];
    theme().innerText = themes[+!value];
    Cache.setNightMode(value);
  });

  State.showPassword.sub(function (value) {
    backdrop().hidden = !value;
    passwordModal().hidden = !value;
    passwordInput().focus();
    (State.hasOwner.value ? emailInput() : passwordInput()).focus();
  });

  State.showOptions.sub(function (value) {
    backdrop().hidden = !value;
    optionsModal().hidden = !value;
    protectedInput().focus();
  });

  State.hasOwner.sub(function (value) {
    email().hidden = !value;
    resetPassword().hidden = !value;
    Control.setClaimButton();
  });
}

class Control {
  static setClaimButton() {
    claim().hidden = State.hasOwner.value || State.protected.value;
    getChild(claim.id, "a").href =
      location.origin + "/my/?claim=" + State.docId;
  }
  static setReadonly() {
    textarea().readOnly = State.public.value && !State.isLogged.value;
  }
}

export function initEventListeners() {
  app().addEventListener("keyup", (ev) => {
    if (ev.key === "Escape" || ev.keyCode === 27) {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    }
  });

  theme().addEventListener("click", () => {
    State.nightMode.pub(!State.nightMode.value);
  });

  password().addEventListener("click", () => {
    State.showPassword.pub(true);
  });

  options().addEventListener("click", () => {
    State.showOptions.pub(true);
  });

  backdrop().addEventListener("click", () => {
    State.showPassword.pub(false);
    State.showOptions.pub(false);
  });

  modal().addEventListener("click", (ev) => {
    ev.stopPropagation();
  });

  protectedInput().addEventListener("change", () => {
    Service.setProtected(!State.protected.value);
    getParent(publicInput.id).hidden = State.protected.value;
  });

  publicInput().addEventListener("change", () => {
    Service.setPublic(!State.public.value);
  });

  logout().addEventListener("click", () => {
    Service.logout();
    State.showOptions.pub(false);
  });

  form().addEventListener("submit", (ev) => {
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

  resetPassword().addEventListener("click", () => {
    const email = getElem(form.id)[0].value;
    Service.resetPassword(email)
      .then(() => {
        alert(
          "You will receive an e-mail with instructions to reset your password.",
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  });

  textarea().addEventListener("keydown", (ev) => {
    if (State.isIE || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (ev.keyCode === 9 || ev.key === "Tab") {
      ev.preventDefault();
      return document.execCommand("insertText", false, "\t");
    } else if (ev.keyCode === 13 || ev.key === "Enter") {
      ev.preventDefault();
      let ident = "";
      const target = textarea();
      for (let j = target.selectionStart; j; ) {
        let char = target.value[--j];
        if (char === "\n") break;
        if (char === " " || char === "\t") ident = char + ident;
        else ident = "";
      }
      return document.execCommand("insertText", false, "\n" + ident);
    }
  });

  textarea().addEventListener(
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
    }, 500),
  );
}
