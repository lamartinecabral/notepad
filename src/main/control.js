// @ts-check

import { randomString, Subject } from "./utils";

export const State = {
  docId: (document.URL.split("?")[1] || "").split("#")[0],
  public: new Subject(false),
  protected: new Subject(false),
  status: new Subject("loading..."),
  isLogged: new Subject(false),
  isHidden: new Subject(true),
  nightMode: new Subject(
    localStorage && localStorage.getItem("nightMode") === "true"
  ),
  showOptions: new Subject(false),
  showPassword: new Subject(false),
};
if (!State.docId) location.replace("?" + randomString(6));
else State.docId = State.docId.toLowerCase();

export const Dom = class {
  /** @type {(id: string)=>HTMLElement} */
  static get(id) {
    // @ts-ignore
    return document.getElementById(id);
  }
  /** @type {(id: string)=>HTMLElement} */
  static getChild(id) {
    // @ts-ignore
    return Dom.get(id).children[0];
  }
  /** @type {string} */
  static get text() {
    // @ts-ignore
    return Dom.get("textarea").value;
  }
  static set text(text) {
    /** @type {HTMLTextAreaElement} */ // @ts-ignore
    const textarea = Dom.get("textarea");
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    textarea.value = text;
    textarea.selectionStart = selectionStart;
    textarea.selectionEnd = selectionEnd;
  }
};

State.protected.sub(function (value) {
  // @ts-ignore
  Dom.get("protected").checked = value;
});

State.public.sub(function (value) {
  // @ts-ignore
  Dom.get("public").checked = value;
});

State.status.sub(function (value) {
  Dom.getChild("status").innerText = value;
});

State.isHidden.sub(function (value) {
  Dom.get("textarea").hidden = value;
  Dom.get("markdown").hidden = value;
  if (!value) {
    // @ts-ignore
    Dom.getChild("markdown").href =
      location.origin + "/markdown/?" + State.docId;
  }
});

State.isLogged.sub(function (value) {
  Dom.get("password").hidden = value;
  Dom.get("options").hidden = !value;
});

State.nightMode.sub(function (value) {
  document.body.style.cssText =
    `--background: var(--${value ? "dark" : "light"}); ` +
    `--color: var(--${!value ? "dark" : "light"});`;
  Dom.get("theme").innerText = value ? "light" : "dark";
  if (localStorage) localStorage.setItem("nightMode", "" + value);
});

State.showPassword.sub(function (value) {
  Dom.get("backdrop").hidden = !value;
  Dom.get("password-modal").hidden = !value;
});

State.showOptions.sub(function (value) {
  Dom.get("backdrop").hidden = !value;
  Dom.get("options-modal").hidden = !value;
});
