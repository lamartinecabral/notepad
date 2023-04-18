// @ts-check

import { Dom, State } from "./control";
import { Service } from "./service";
import { debounce } from "./utils";

const handlers = [
  {
    elemId: "body",
    event: "keyup",
    handler: function (ev) {
      if (ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27) {
        State.showPassword.pub(false);
        State.showOptions.pub(false);
      }
    },
  },
  {
    elemId: "theme-menu",
    event: "click",
    handler: function () {
      State.nightMode.pub(!State.nightMode.value);
    },
  },
  {
    elemId: "password-menu",
    event: "click",
    handler: function () {
      State.showPassword.pub(true);
    },
  },
  {
    elemId: "options-menu",
    event: "click",
    handler: function () {
      State.showOptions.pub(true);
    },
  },
  {
    elemId: "backdrop",
    event: "click",
    handler: function () {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    },
  },
  {
    elemId: "modal",
    event: "click",
    handler: function (ev) {
      ev.stopPropagation();
    },
  },
  {
    elemId: "protected",
    event: "change",
    handler: function () {
      Service.setProtected(!State.protected.value);
    },
  },
  {
    elemId: "public",
    event: "change",
    handler: function () {
      Service.setPublic(!State.public.value);
    },
  },
  {
    elemId: "logout",
    event: "click",
    handler: function () {
      Service.logout();
      State.showOptions.pub(false);
    },
  },
  {
    elemId: "form",
    event: "submit",
    handler: function (ev) {
      ev.preventDefault();
      Service.login(ev.target[1].value);
      State.showPassword.pub(false);
      ev.target[1].value = "";
    },
  },
  {
    elemId: "textarea",
    event: "keydown",
    handler: function (ev) {
      if (ev.keyCode !== 9 && ev.key !== "Tab") return;
      if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      document.execCommand("insertText", false, "\t");
    },
  },
  {
    elemId: "textarea",
    event: "input",
    handler: debounce(function () {
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
  },
];

handlers.forEach(function(entry){
  Dom.get(entry.elemId).addEventListener(entry.event, entry.handler);
})

Service.startLiveDoc();
Service.startLiveUser();

document.body.hidden = false;
