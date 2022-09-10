// @ts-check

import { Modal } from "./modal.js";
import { Server } from "./server.js";
import { State } from "./state.js";

export const View = {
  /** @returns {HTMLElement | any} */
  // @ts-ignore
  getById: (id) => View.getById(id),

  status: {
    elem: () => View.getById("status"),
    /** @type {() => HTMLSpanElement} */
    span: () => View.status.elem().children[0],
  },

  textArea: {
    /** @type {() => HTMLTextAreaElement} */
    elem: () => View.getById("textarea"),

    /** @param {string} text */
    set: function (text) {
      const selectionStart = View.textArea.elem().selectionStart;
      const selectionEnd = View.textArea.elem().selectionEnd;
      View.textArea.elem().value = text;
      View.textArea.elem().selectionStart = selectionStart;
      View.textArea.elem().selectionEnd = selectionEnd;
    },

    /** @returns {string} */
    get: function () {
      return View.textArea.elem().value;
    },

    /** @param {KeyboardEvent} ev */
    tabinput: function (ev) {
      if (ev.keyCode !== 9 && ev.key !== "Tab") return;
      if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      document.execCommand("insertText", false, "\t");
    },
  },

  updateButtons: function () {
    if (State.obj.login) {
      View.getById("login").hidden = true;
      View.getById("options").hidden = false;
    } else {
      View.getById("login").hidden = false;
      View.getById("options").hidden = true;
    }
  },

  Action: {
    /** @type {NodeJS.Timeout} */
    // @ts-ignore
    saveTimeoutID: null,
    save: function (ev) {
      clearTimeout(View.Action.saveTimeoutID);
      View.Action.saveTimeoutID = setTimeout(() => {
        console.log("updating...");
        View.status.elem().hidden = false;
        View.status.span().innerText = "Saving...";
        Server.setContent(View.textArea.get(), State.docId)
          .then(() => {
            View.getById("status").hidden = true;
            console.log("updated");
          })
          .catch((err) => {
            console.error(err);
            View.status.span().innerText = "Protected";
          });
      }, 500);
    },

    theme: function (toggle = false) {
      if (localStorage && localStorage.getItem("nightMode") !== null)
        View.nightMode = localStorage.getItem("nightMode") === "true";
      if (toggle) View.nightMode = !View.nightMode;
      document.body.style.cssText =
        `--background: var(--${View.nightMode ? "dark" : "light"}); ` +
        `--color: var(--${!View.nightMode ? "dark" : "light"});`;
      View.getById("theme").innerText = View.nightMode
        ? "light"
        : "dark";
      if (localStorage) localStorage.setItem("nightMode", "" + View.nightMode);
    },

    password: function () {
      if (State.obj.login) Server.logout();
      else
        Modal.password().then((pwd) => {
          Server.login(pwd).catch((err) => alert(err.message));
        });
    },

    options: function () {
      Modal.options();
    },
  },

  isHidden: true,
  nightMode: false,
};
