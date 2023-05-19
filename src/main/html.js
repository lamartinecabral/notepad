// @ts-check

import { Id } from "./enum";
import { elem } from "./utils";

const components = [
  elem("div", { id: Id.status }, [elem("span", {}, ["Loading..."])]),
  elem("div", { id: Id.header }, [
    elem("a", { id: Id.theme, href: "#" }, ["dark"]),
    elem("a", { id: Id.password, href: "#", hidden: true }, ["password"]),
    elem("a", { id: Id.options, href: "#", hidden: true }, ["options"]),
  ]),
  elem("div", { id: Id.github }, [
    elem("a", { href: "https://github.com/lamartinecabral/notepad" }, [
      elem("img", { src: "./assets/github.svg" }),
    ]),
  ]),
  elem("div", { id: Id.footer, hidden: true }, [
    elem("a", { id: Id.markdown, href: "#" }, ["markdown"]),
  ]),
  elem("div", { id: Id.backdrop, hidden: true }, [
    elem("div", { id: Id.modal }, [
      elem("div", { id: Id.optionsModal, hidden: true }, [
        elem("div", {}, [
          elem("input", {
            id: Id.protected,
            type: "checkbox",
            name: "protected",
          }),
          elem("label", { for: "protected", title: "Only you can edit" }, [
            "Protected",
          ]),
        ]),
        elem("div", {}, [
          elem("input", { id: Id.public, type: "checkbox", name: "public" }),
          elem("label", { for: "public", title: "Everyone can read" }, [
            "Public",
          ]),
        ]),
        elem("div", {}, [elem("button", { id: Id.logout }, ["logout"])]),
      ]),
      elem("div", { id: Id.passwordModal, hidden: true }, [
        elem("form", { id: Id.form }, [
          elem("input", { type: "text", name: "username", hidden: true }),
          elem("label", { for: "password" }, ["Password: "]),
          elem("input", {
            id: Id.passwordInput,
            type: "password",
            name: "password",
          }),
          elem("input", { type: "submit" }),
        ]),
      ]),
    ]),
  ]),
  elem("textarea", {
    name: "textarea",
    id: Id.textarea,
    autofocus: true,
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: "false",
    hidden: true,
  }),
];

export const Html = class {
  /** @type {(id: Id)=>HTMLElement} */
  static get(id) {
    // @ts-ignore
    return document.getElementById(id);
  }
  /** @type {(id: Id)=>HTMLElement} */
  static getChild(id) {
    // @ts-ignore
    return Html.get(id).children[0];
  }
  /** @type {(id: Id)=>HTMLElement} */
  static getParent(id) {
    // @ts-ignore
    return Html.get(id).parentElement;
  }
  /** @type {string} */
  static get text() {
    // @ts-ignore
    return Html.get(Id.textarea).value;
  }
  static set text(text) {
    /** @type {HTMLTextAreaElement} */ // @ts-ignore
    const textarea = Html.get(Id.textarea);
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    textarea.value = text;
    textarea.selectionStart = selectionStart;
    textarea.selectionEnd = selectionEnd;
  }
};

document.body.id = Id.app;
Html.get(Id.app).hidden = true;
Html.get(Id.app).append(...components);
