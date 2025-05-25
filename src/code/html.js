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
  preview,
  previewButton,
} from "./refs";
import { elem, style } from "../iuai";
import { Languages } from "./model";
import { State } from "./state";

/** @type {import('../codemirror/codemirror')} */ // @ts-ignore
const { getValue, setValue, initEditor, getCursor } = window.codemirror;

const btn = (() => {
  style(".btn", {
    cursor: "pointer",
    textDecoration: "underline",
    background: "var(--background)",
  });
  return (attributes, children) => {
    const className = "btn " + (attributes.className || "");
    return elem("span", { ...attributes, className, tabindex: "0" }, children);
  };
})();

const elements = [
  elem("div", [
    elem(status, [elem("span", "Loading...")]),
    elem(header, [
      elem(langSelect, [
        ...Object.values(Languages).map(({ label, value }) =>
          elem("option", { value }, label),
        ),
        elem("optgroup", { label: "# editor theme" }, [
          elem(
            "option",
            { value: "theme-light", disabled: !State.nightMode.value },
            "light",
          ),
          elem(
            "option",
            { value: "theme-dark", disabled: State.nightMode.value },
            "dark",
          ),
        ]),
      ]),
      " ",
      elem(
        play,
        {
          href: "#",
          title: "shift+click to toggle a preview frame",
          hidden: !State.isMobile.value,
        },
        "play",
      ),
      elem(
        previewButton,
        {
          href: "#",
          title: "click to toggle a preview frame",
          hidden: State.isMobile.value,
        },
        "preview",
      ),
      " ",
      btn({ id: password.id, hidden: true }, "password"),
      btn({ id: options.id, hidden: true }, "options"),
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
              "Protected",
            ),
          ]),
          elem("div", [
            elem(publicInput, { type: "checkbox" }),
            elem(
              "label",
              { htmlFor: publicInput.id, title: "Everyone can read" },
              "Public",
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
            elem(resetPassword, { hidden: true }, [btn({}, "reset password")]),
          ]),
        ]),
      ]),
    ]),
    elem(editor),
  ]),
  elem(preview),
];

export class Html {
  static get text() {
    return getValue();
  }
  static set text(text) {
    setValue(text);
  }
  static setText(text, cursor) {
    setValue(text, cursor);
  }
  static get cursor() {
    return getCursor();
  }
}

export function initHtml() {
  document.body.id = app.id;
  app().hidden = true;
  app().className = State.nightMode.value ? "dark" : "light";
  app().append(...elements);
  preview().src = "./preview.html?" + State.docId;
  initEditor(editor(), { nightMode: State.nightMode.value });
}
