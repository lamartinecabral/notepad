// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { delayLatest } from "../utils";
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
import { Html } from "./html";
import { parseLanguage as lang } from "./model";
import { format } from "./formatter";
import { Cache } from "../cache";

/** @type {import('../codemirror/codemirror')} */ // @ts-ignore
const { onChange, setLanguage, onModS } = window.codemirror;

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
    langSelect().hidden = value;
    Control.setPlayButton();
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
    Control.setPlayButton();
    setLanguage(value);
    /** @type {HTMLOptionElement[]} */ // @ts-ignore
    const options = [...langSelect().children];
    options.forEach((option) => {
      option.selected = option.value === value;
    });
    localStorage && localStorage.setItem(State.docId + "_lang", value);

    State.showPreview.pub(false);
  });

  State.nightMode.sub(
    function (value) {
      Cache.setNightMode(value);
      setTimeout(() => location.reload(), 0);
    },
    { latest: false },
  );

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

  static setPlayButton() {
    const language = State.language.value;
    const isHidden = State.isHidden.value;

    play().hidden =
      isHidden ||
      (language !== "html" &&
        language !== "markdown" &&
        language !== "javascript");

    const path =
      language === "markdown"
        ? "/markdown/?"
        : language === "javascript"
          ? "/script/?"
          : "/play/?";

    if (!isHidden) play().href = location.origin + path + State.docId;
  }

  static save() {
    State.status.pub("Saving...");
    Service.save()
      .then(() => {
        State.status.pub("");
      })
      .catch((err) => {
        console.error(err);
        State.status.pub("Protected");
      });
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
          "You will receive an e-mail with instructions to reset your password.",
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  });

  langSelect().addEventListener("change", () => {
    const selectedValue = langSelect().value;
    if (selectedValue === "theme-light") {
      State.nightMode.pub(false);
    } else if (selectedValue === "theme-dark") {
      State.nightMode.pub(true);
    } else State.language.pub(lang(selectedValue));
  });

  play().addEventListener("click", (ev) => {
    if (!ev.shiftKey) return;
    ev.preventDefault();
    State.showPreview.pub(!State.showPreview.value);
  });

  const delaySave = delayLatest(Control.save);

  let skipFirstChange = true;
  onChange(() => {
    if (skipFirstChange) return (skipFirstChange = false);
    State.showPreview.value ? delaySave(500) : delaySave(2000);
  });

  onModS(() => {
    format(Html.text, State.language.value).then((res) => {
      if (res === Html.text) return;
      Html.text = res;
      delaySave(0);
    });
  });
}
