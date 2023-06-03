// @ts-check

import { Service } from "./service";
import { State } from "./state";
import { Html } from "./html";
import { debounce } from "../utils";
import { Id } from "./enum";
import { Events, Tag } from "../iuai";

export function initStateListeners() {
  State.protected.sub(function (value) {
    Tag.get("input", Id.protected).checked = value;
    Html.getParent(Id.public).hidden = !value;
    Control.setClaimButton();
  });

  State.public.sub(function (value) {
    Tag.get("input", Id.public).checked = value;
  });

  State.status.sub(function (value) {
    Html.getChild(Id.status).innerText = value;
  });

  State.isHidden.sub(function (value) {
    Html.get(Id.textarea).hidden = value;
    Html.get(Id.footer).hidden = value;
    if (!value) {
      Tag.get("a", Id.markdown).href =
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
    Html.get(State.hasOwner.value ? Id.emailInput : Id.passwordInput).focus();
  });

  State.showOptions.sub(function (value) {
    Html.get(Id.backdrop).hidden = !value;
    Html.get(Id.optionsModal).hidden = !value;
    Html.get(Id.protected).focus();
  });

  State.hasOwner.sub(function (value) {
    Html.get(Id.email).hidden = !value;
    Html.get(Id.resetPassword).hidden = !value;
    Control.setClaimButton();
  });
}

class Control {
  static setClaimButton() {
    Html.get(Id.claim).hidden = State.hasOwner.value || State.protected.value;
    Tag.getChild("a", Id.claim).href =
      location.origin + "/my/?claim=" + State.docId;
  }
}

export function initEventListeners() {
  Events.listen(Html.get(Id.app), "keyup", (ev) => {
    if (ev.key === "Escape" || ev.keyCode === 27) {
      State.showPassword.pub(false);
      State.showOptions.pub(false);
    }
  });

  Events.listen(Html.get(Id.theme), "click", () => {
    State.nightMode.pub(!State.nightMode.value);
  });

  Events.listen(Html.get(Id.password), "click", () => {
    State.showPassword.pub(true);
  });

  Events.listen(Html.get(Id.options), "click", () => {
    State.showOptions.pub(true);
  });

  Events.listen(Html.get(Id.backdrop), "click", () => {
    State.showPassword.pub(false);
    State.showOptions.pub(false);
  });

  Events.listen(Html.get(Id.modal), "click", (ev) => {
    ev.stopPropagation();
  });

  Events.listen(Html.get(Id.protected), "change", () => {
    Service.setProtected(!State.protected.value);
    Html.getParent(Id.public).hidden = State.protected.value;
  });

  Events.listen(Html.get(Id.public), "change", () => {
    Service.setPublic(!State.public.value);
  });

  Events.listen(Html.get(Id.logout), "click", () => {
    Service.logout();
    State.showOptions.pub(false);
  });

  Events.listen(Html.get(Id.form), "submit", (ev) => {
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

  Events.listen(Html.get(Id.resetPassword), "click", () => {
    const email = Html.get(Id.form)[0].value;
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

  Events.listen(Html.get(Id.textarea), "keydown", (ev) => {
    if (ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (ev.keyCode === 9 || ev.key === "Tab") {
      ev.preventDefault();
      return document.execCommand("insertText", false, "\t");
    } else if (ev.keyCode === 13 || ev.key === "Enter") {
      ev.preventDefault();
      let ident = "";
      const target = Tag.get("textarea", Id.textarea);
      for (let j = target.selectionStart; j; ) {
        let char = target.value[--j];
        if (char === "\n") break;
        if (char === " " || char === "\t") ident = char + ident;
        else ident = "";
      }
      return document.execCommand("insertText", false, "\n" + ident);
    }
  });

  Events.listen(
    Html.get(Id.textarea),
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
