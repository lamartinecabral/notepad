// @ts-check

import { Id } from "./enum";
import { elem, Html as HtmlBase } from "../iuai";

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
          elem("label", { htmlFor: "protected", title: "Only you can edit" }, [
            "Protected",
          ]),
        ]),
        elem("div", {}, [
          elem("input", { id: Id.public, type: "checkbox", name: "public" }),
          elem("label", { htmlFor: "public", title: "Everyone can read" }, [
            "Public",
          ]),
        ]),
        elem("div", {}, [elem("button", { id: Id.logout }, ["logout"])]),
      ]),
      elem("div", { id: Id.passwordModal, hidden: true }, [
        elem("div", { id: Id.claim, hidden: true }, [
          elem("a", {}, ["claim this note"]),
        ]),
        elem("form", { id: Id.form }, [
          elem("table", {}, [
            elem("tr", { id: Id.email, hidden: true }, [
              elem("td", {}, [
                elem("label", { htmlFor: "username" }, [" E-mail: "]),
              ]),
              elem("td", {}, [
                elem("input", {
                  id: Id.emailInput,
                  type: "text",
                  name: "username",
                }),
              ]),
            ]),
            elem("tr", {}, [
              elem("td", {}, [
                elem("label", { htmlFor: "password" }, [" Password: "]),
              ]),
              elem("td", {}, [
                elem("input", {
                  id: Id.passwordInput,
                  type: "password",
                  name: "password",
                }),
              ]),
            ]),
          ]),
          elem("div", { id: Id.submitButton }, [
            elem("input", { type: "submit", value: "Submit" }),
          ]),
          elem("div", { id: Id.resetPassword, hidden: true }, [
            elem("a", { href: "#" }, ["reset password"]),
          ]),
        ]),
      ]),
    ]),
  ]),
  elem("textarea", {
    name: "textarea",
    id: Id.textarea,
    autofocus: true,
    autocomplete: "off",
    // @ts-ignore
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: false,
    hidden: true,
  }),
];

export class Html extends HtmlBase {
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
}

export function initHtml() {
  document.body.id = Id.app;
  Html.get(Id.app).hidden = true;
  Html.get(Id.app).className = "light";
  Html.get(Id.app).append(...components);
}
