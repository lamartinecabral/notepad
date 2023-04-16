// @ts-check

import { State } from "./control";
import { Service } from "./service";
import { debounce } from "./utils";

const handlers = {
  handleKeydown: function (ev) {
    if (ev.keyCode !== 9 && ev.key !== "Tab") return;
    if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    /** @type {HTMLTextAreaElement} */ // @ts-ignore
    const target = ev.target;
    target.setRangeText(
      "\t",
      target.selectionStart,
      target.selectionEnd,
      "end"
    );
    target.dispatchEvent(new Event("input"));
  },
  handleInput: debounce(function () {
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
  handleThemeClick: function () {
    State.nightMode.pub(!State.nightMode.value);
  },
  handlePasswordClick: function () {
    State.showPassword.pub(true);
  },
  handleOptionsClick: function () {
    State.showOptions.pub(true);
  },
  handleBackdropClick: function () {
    State.showPassword.pub(false);
    State.showOptions.pub(false);
  },
  handleModalClick: function (ev) {
    ev.stopPropagation();
  },
  handleKeyup: function (ev) {
    if (ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27) {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    }
  },
  handleProtectedChange: function () {
    Service.setProtected(!State.protected.value);
  },
  handlePublicChange: function () {
    Service.setPublic(!State.public.value);
  },
  handleLogoutClick: function () {
    Service.logout();
    State.showOptions.pub(false);
  },
  handleSubmit: function (ev) {
    ev.preventDefault();
    Service.login(ev.target[1].value);
    State.showPassword.pub(false);
    ev.target[1].value = "";
  },
};

Object.assign(window, handlers);

Service.startLiveDoc();
Service.startLiveUser();

document.body.hidden = false;
document.body.addEventListener('keyup', handlers.handleKeyup);
