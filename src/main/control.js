// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { Html } from "./html";
import { debounce } from "./utils";
import { Id } from "./enum";

export function initStateListeners() {
  State.protected.sub(function (value) {
    // @ts-ignore
    Html.get(Id.protected).checked = value;
    Html.getParent(Id.public).hidden = !value;
  });

  State.public.sub(function (value) {
    // @ts-ignore
    Html.get(Id.public).checked = value;
  });

  State.status.sub(function (value) {
    Html.getChild(Id.status).innerText = value;
  });

  State.isHidden.sub(function (value) {
    Html.get(Id.textarea).hidden = value;
    Html.get(Id.footer).hidden = value;
    if (!value) {
      // @ts-ignore
      Html.get(Id.markdown).href =
        location.origin + "/markdown/?" + State.docId;
    }
  });

  State.isLogged.sub(function (value) {
    Html.get(Id.password).hidden = value;
    Html.get(Id.options).hidden = !value;
  });

  State.nightMode.sub(function (value) {
    const theme = ["light", "dark"];
    Html.get(Id.app).className = theme[+value];
    Html.get(Id.theme).innerText = theme[+!value];
    if (localStorage) localStorage.setItem("nightMode", "" + value);
  });

  State.showPassword.sub(function (value) {
    Html.get(Id.backdrop).hidden = !value;
    Html.get(Id.passwordModal).hidden = !value;
    Html.get(Id.passwordInput).focus();
  });

  State.showOptions.sub(function (value) {
    Html.get(Id.backdrop).hidden = !value;
    Html.get(Id.optionsModal).hidden = !value;
    Html.get(Id.protected).focus();
  });
}

export function initEventListeners() {
  /** @type {{elemId: Id, event: keyof HTMLElementEventMap, handler: any}[]} */
  const eventHandlers = [
    {
      elemId: Id.app,
      event: "keyup",
      handler: function (/** @type {HTMLElementEventMap['keyup']} */ ev) {
        if (ev.key === "Escape" || ev.keyCode === 27) {
          State.showPassword.pub(false);
          State.showOptions.pub(false);
        }
      },
    },
    {
      elemId: Id.theme,
      event: "click",
      handler: function () {
        State.nightMode.pub(!State.nightMode.value);
      },
    },
    {
      elemId: Id.password,
      event: "click",
      handler: function () {
        State.showPassword.pub(true);
      },
    },
    {
      elemId: Id.options,
      event: "click",
      handler: function () {
        State.showOptions.pub(true);
      },
    },
    {
      elemId: Id.backdrop,
      event: "click",
      handler: function () {
        State.showPassword.pub(false);
        State.showOptions.pub(false);
      },
    },
    {
      elemId: Id.modal,
      event: "click",
      handler: function (ev) {
        ev.stopPropagation();
      },
    },
    {
      elemId: Id.protected,
      event: "change",
      handler: function () {
        Service.setProtected(!State.protected.value);
        Html.getParent(Id.public).hidden = State.protected.value;
      },
    },
    {
      elemId: Id.public,
      event: "change",
      handler: function () {
        Service.setPublic(!State.public.value);
      },
    },
    {
      elemId: Id.logout,
      event: "click",
      handler: function () {
        Service.logout();
        State.showOptions.pub(false);
      },
    },
    {
      elemId: Id.form,
      event: "submit",
      handler: function (/** @type {HTMLElementEventMap['submit']} */ ev) {
        ev.preventDefault();
        if (!ev.target) return;
        Service.login(ev.target[1].value);
        State.showPassword.pub(false);
        ev.target[1].value = "";
      },
    },
    {
      elemId: Id.textarea,
      event: "keydown",
      handler: function (/** @type {HTMLElementEventMap['keydown']} */ ev) {
        if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
        if (ev.keyCode === 9 || ev.key === "Tab") {
          ev.preventDefault();
          return document.execCommand("insertText", false, "\t");
        } else if (ev.keyCode === 13 || ev.key === "Enter") {
          ev.preventDefault();
          let ident = "";
          /** @type {HTMLTextAreaElement} */ // @ts-ignore
          const target = Html.get(Id.textarea);
          for (let j = target.selectionStart; j; ) {
            let char = target.value[--j];
            if (char === "\n") break;
            if (char === " " || char === "\t") ident = char + ident;
            else ident = "";
          }
          return document.execCommand("insertText", false, "\n" + ident);
        }
      },
    },
    {
      elemId: Id.textarea,
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

  eventHandlers.forEach(function (entry) {
    try {
      Html.get(entry.elemId).addEventListener(entry.event, entry.handler);
    } catch (err) {
      console.log("unable to add event listener", entry);
      throw err;
    }
  });
}
