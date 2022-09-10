import { Modal } from "./modal.js";
import { Server } from "./server.js";
import { State } from "./state.js";

export const View = {
  status: {
    elem: () => document.getElementById("status"),
    /** @type {() => HTMLSpanElement} */
    span: () => View.status.elem().children[0],
  },

  textArea: {
    /** @type {() => HTMLTextAreaElement} */
    elem: () => document.getElementById("textarea"),

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
      document.getElementById("login").hidden = true;
      document.getElementById("options").hidden = false;
    } else {
      document.getElementById("login").hidden = false;
      document.getElementById("options").hidden = true;
    }
  },

  Action: {
    saveTimeoutID: null,
    save: function (ev) {
      clearTimeout(View.Action.saveTimeoutID);
      View.Action.saveTimeoutID = setTimeout(() => {
        console.log("updating...");
        View.status.elem().hidden = false;
        View.status.span().innerText = "Saving...";
        Server.setContent(View.textArea.get(), State.docId)
          .then(() => {
            document.getElementById("status").hidden = true;
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
      document.getElementById("theme").innerText = View.nightMode
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
