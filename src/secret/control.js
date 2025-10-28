// @ts-check

import { initDocListener, Service } from "./service";
import { State } from "./state";
import { debounce } from "../utils";
import {
  status,
  textarea,
  app,
  theme,
  options,
  optionsModal,
  backdrop,
  modal,
  submitButton,
  secretName,
} from "./refs";
import { getChild } from "../iuai";
import { Cache } from "../cache";

export function initStateListeners() {
  State.status.sub(function (value) {
    getChild(status.id).innerText = value;
  });

  State.isHidden.sub(function (value) {
    textarea().hidden = value;
  });

  State.showOptions.sub(function (value) {
    backdrop().hidden = !value;
    optionsModal().hidden = !value;
  });

  State.nightMode.sub(function (value) {
    const themes = ["light", "dark"];
    app().className = themes[+value];
    theme().innerText = themes[+!value];
    Cache.setNightMode(value);
  });
}

export function initEventListeners() {
  app().addEventListener("keyup", (ev) => {
    if (ev.key === "Escape" || ev.keyCode === 27) {
      State.showOptions.pub(false);
    }
  });

  theme().addEventListener("click", () => {
    State.nightMode.pub(!State.nightMode.value);
  });

  options().addEventListener("click", () => {
    State.showOptions.pub(true);
  });

  backdrop().addEventListener("click", () => {
    State.showOptions.pub(false);
  });

  modal().addEventListener("click", (ev) => {
    ev.stopPropagation();
  });

  submitButton().addEventListener("click", () => {
    State.docId = secretName().value;
    State.showOptions.pub(false);
    State.isHidden.pub(true);
    State.status.pub("loading...");
    initDocListener();
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
