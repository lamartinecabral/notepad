// @ts-check

import {
  status,
  header,
  theme,
  options,
  backdrop,
  modal,
  optionsModal,
  submitButton,
  textarea,
  app,
  secretName,
  remember,
} from "./refs";
import { elem } from "../iuai";
import { State } from "./state";

const elements = [
  elem(status, [elem("span", "Loading...")]),
  elem(header, [
    elem(theme, { href: "#" }, "dark"),
    " ",
    elem(options, { href: "#" }, "options"),
  ]),
  elem(backdrop, { hidden: true }, [
    elem(modal, [
      elem(optionsModal, { hidden: true }, [
        elem("div", [
          elem("div", [
            elem("label", { htmlFor: secretName.id }, [
              elem(
                "span",
                {
                  className: "withTooltip",
                },
                [
                  "⚠️",
                  elem(
                    "span",
                    { className: "tooltip" },
                    "Your note will be stored with strong encryption. Keep in mind that the note's name is the key to access the decrypted content. If you plan to keep sensitive data, consider choosing a complex name for your note.",
                  ),
                ],
              ),
              " secret note:",
            ]),
            elem(secretName, {
              rows: 1,
              value: State.docId,
            }),
          ]),
          elem("p", [elem(submitButton, "Submit")]),
          elem("div", [
            elem(remember, { type: "checkbox", checked: State.remember }),
            elem("label", { htmlFor: remember.id }, "remember in this device"),
          ]),
        ]),
      ]),
    ]),
  ]),
  // @ts-ignore
  elem(textarea, {
    autofocus: true,
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: false,
    hidden: true,
  }),
];

export class Html {
  static get text() {
    return textarea().value;
  }
  static set text(text) {
    const ta = textarea();
    const selectionStart = ta.selectionStart;
    const selectionEnd = ta.selectionEnd;
    ta.value = text;
    ta.selectionStart = selectionStart;
    ta.selectionEnd = selectionEnd;
  }
}

export function initHtml() {
  document.body.id = app.id;
  app().hidden = true;
  app().className = "light";
  for (const element of elements) app().appendChild(element);
}
