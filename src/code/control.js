// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { debounce } from "../utils";
import {
  protectedInput,
  publicInput,
  status,
  play,
  password,
  options,
  app,
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
  editor,
  langSelect,
  preview,
} from "./refs";
import { getElem, getChild, getParent } from "../iuai";

/** @type {import('../codemirror/codemirror')} */ // @ts-ignore
const { onChange, setLanguage } = window.codemirror;

export function initStateListeners() {
  State.protected.sub(function (value) {
    protectedInput().checked = value;
    getParent(publicInput.id).hidden = !value;
    Control.setClaimButton();
  });

  State.public.sub(function (value) {
    publicInput().checked = value;
  });

  State.status.sub(function (value) {
    getChild(status.id).innerText = value;
  });

  State.isHidden.sub(function (value) {
    editor().hidden = value;
    play().hidden =
      value ||
      (State.language.value !== "html" && State.language.value !== "markdown");
    langSelect().hidden = value;
    if (!value) Control.setPlayHref();
  });

  State.isLogged.sub(function (value) {
    password().hidden = value;
    options().hidden = !value;
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

  State.language.sub(function (value) {
    location.hash = value;
    play().hidden =
      State.isHidden.value || (value !== "html" && value !== "markdown");
    Control.setPlayHref();
    setLanguage(value);
    /** @type {HTMLOptionElement[]} */ // @ts-ignore
    const options = [...langSelect().children];
    options.forEach((option) => {
      option.selected = option.value === value;
    });
    localStorage && localStorage.setItem(State.docId + "_lang", value);

    State.showPreview.pub(false);
  });

  State.showPreview.sub(function (value) {
    preview().hidden = !value;
    getParent(editor.id).classList.toggle("sideBySide", value);
    preview().src = value ? play().href : "";
  });
}

class Control {
  static setClaimButton() {
    claim().hidden = State.hasOwner.value || State.protected.value;
    getChild(claim.id, "a").href =
      location.origin + "/my/?claim=" + State.docId;
  }

  static setPlayHref() {
    const path =
      State.language.value === "markdown" ? "/markdown/?" : "/play/?";
    play().href = location.origin + path + State.docId;
  }
}

export function initEventListeners() {
  app().addEventListener("keyup", (ev) => {
    if (ev.key === "Escape" || ev.keyCode === 27) {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    }
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
          "You will receive an e-mail with instructions to reset your password."
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  });

  langSelect().addEventListener("change", () => {
    State.language.pub(langSelect().value);
  });

  play().addEventListener("click", (ev) => {
    if (!ev.shiftKey) return;
    ev.preventDefault();
    State.showPreview.pub(!State.showPreview.value);
  });

  onChange(
    (() => {
      const save = () => {
        State.status.pub("Saving...");
        Service.save()
          .then(() => {
            State.status.pub("");
          })
          .catch((err) => {
            console.error(err);
            State.status.pub("Protected");
          });
      };
      const shortDebounced = debounce(save, 500);
      const longDebounced = debounce(save, 2000);
      return () =>
        State.showPreview.value ? shortDebounced() : longDebounced();
    })()
  );
}
