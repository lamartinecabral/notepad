// @ts-check

import {
  status,
  header,
  password,
  options,
  play,
  backdrop,
  modal,
  optionsModal,
  protectedInput,
  publicInput,
  logout,
  passwordModal,
  claim,
  form,
  email,
  emailInput,
  passwordInput,
  submitButton,
  resetPassword,
  app,
  editor,
  langSelect,
} from "./refs";
import { elem } from "iuai";

/** @type {import('../codemirror')['default']} */ // @ts-ignore
const { getValue, setValue, initEditor, setLanguage } = window.codemirror;

const elements = [
  elem(status, [elem("span", "Loading...")]),
  elem(header, [
    elem(langSelect, [
      elem("option", { value: "html", selected: true }, "html"),
      elem("option", { value: "css" }, "css"),
      elem("option", { value: "javascript" }, "javascript"),
    ]),
    " ",
    elem(play, { href: "#" }, "play"),
    " ",
    elem(password, { href: "#", hidden: true }, "password"),
    elem(options, { href: "#", hidden: true }, "options"),
  ]),
  elem(backdrop, { hidden: true }, [
    elem(modal, [
      elem(optionsModal, { hidden: true }, [
        elem("div", [
          elem(protectedInput, {
            type: "checkbox",
          }),
          elem(
            "label",
            { htmlFor: protectedInput.id, title: "Only you can edit" },
            "Protected"
          ),
        ]),
        elem("div", [
          elem(publicInput, { type: "checkbox" }),
          elem(
            "label",
            { htmlFor: publicInput.id, title: "Everyone can read" },
            "Public"
          ),
        ]),
        elem("div", [elem(logout, "logout")]),
      ]),
      elem(passwordModal, { hidden: true }, [
        elem(claim, { hidden: true }, [elem("a", "claim this note")]),
        elem(form, [
          elem("table", [
            elem(email, { hidden: true }, [
              elem("td", [
                elem("label", { htmlFor: emailInput.id }, " E-mail: "),
              ]),
              elem("td", [
                elem(emailInput, {
                  type: "text",
                  name: "email",
                  autocomplete: "email",
                }),
              ]),
            ]),
            elem("tr", [
              elem("td", [
                elem("label", { htmlFor: passwordInput.id }, " Password: "),
              ]),
              elem("td", [
                elem(passwordInput, {
                  type: "password",
                  name: "password",
                }),
              ]),
            ]),
          ]),
          elem(submitButton, [
            elem("input", { type: "submit", value: "Submit" }),
          ]),
          elem(resetPassword, { hidden: true }, [
            elem("a", { href: "#" }, "reset password"),
          ]),
        ]),
      ]),
    ]),
  ]),
  elem(editor),
];

export class Html {
  static get text() {
    return getValue();
  }
  static set text(text) {
    setValue(text);
  }
}

export function initHtml() {
  document.body.id = app.id;
  app().hidden = true;
  app().className = "light";
  app().append(...elements);
  initEditor(editor());
}
