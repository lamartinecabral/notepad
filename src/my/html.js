// @ts-check

import { trunc } from "../utils";
import { Control } from "./control";
import {
  loginContainer,
  loginForm,
  usernameInput,
  passwordInput,
  password2,
  passwordInput2,
  loginSubmit,
  signinMode,
  signupMode,
  resetPassword,
  content,
  userEmail,
  docList,
  message,
  claimButton,
  logout,
  app,
} from "./refs";
import { elem } from "iuai";

const elements = [
  elem(loginContainer, { className: "center", hidden: true }, [
    elem(loginForm, [
      elem("table", [
        elem("tr", [
          elem("td", [
            elem("label", { htmlFor: usernameInput.id }, " E-mail: "),
          ]),
          elem("td", [
            elem(usernameInput, {
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
        elem(password2, { hidden: true }, [
          elem("td", [
            elem(
              "label",
              { htmlFor: passwordInput2.id },
              " Repeat the password: "
            ),
          ]),
          elem("td", [
            elem(passwordInput2, {
              type: "password",
            }),
          ]),
        ]),
      ]),
      elem(loginSubmit, {
        type: "submit",
        className: "margin",
        value: "Login",
      }),
    ]),
    elem("div", { className: "margin", hidden: true }, [
      elem(signinMode, { href: "#" }, "Log in"),
    ]),
    elem("div", { className: "margin" }, [
      elem(signupMode, { href: "#" }, "create account"),
    ]),
    elem("div", { className: "margin" }, [
      elem(resetPassword, { href: "#" }, "reset password"),
    ]),
  ]),
  elem(content, { className: "center", hidden: true }, [
    elem(userEmail),
    elem(docList, { className: "margin" }, [
      elem("table", [
        elem("tr", [
          elem("th"),
          elem("th", { title: "Only you can edit" }, "Protected"),
          elem("th", { title: "Everyone can read" }, "Public"),
        ]),
      ]),
      elem(message, "Loading..."),
    ]),
    elem("div", { className: "margin" }, [
      elem(claimButton, { className: "margin" }, ["claim"]),
      elem(logout, { type: "button", className: "margin" }, "Logout"),
    ]),
  ]),
];

/** @param {import("./state").Doc} doc */
export function docElem(doc) {
  return elem("tr", { id: "tr_" + doc.id }, [
    elem("td", [
      elem(
        "a",
        {
          id: "a_" + doc.id,
          href: location.origin + "/?" + doc.id,
          title: trunc(doc.text, 280),
        },
        doc.id
      ),
    ]),
    elem("td", { className: "checkbox" }, [
      elem("input", {
        id: "cbprot_" + doc.id,
        type: "checkbox",
        checked: !!doc.protected,
        onchange: (/** @type {any} */ ev) => {
          Control.setProtected(doc.id, ev.target.checked);
        },
      }),
    ]),
    elem("td", { className: "checkbox" }, [
      elem("input", {
        id: "cbpubl_" + doc.id,
        type: "checkbox",
        disabled: !doc.protected,
        checked: !!doc.public,
        onchange: (/** @type {any} */ ev) => {
          Control.setPublic(doc.id, ev.target.checked);
        },
      }),
    ]),
    elem("td", { style: { whiteSpace: "nowrap" } }, [
      elem("a", { href: location.origin + "/markdown/?" + doc.id }, "MD"),
      " ",
      elem("a", { href: location.origin + "/play/?" + doc.id }, "</>"),
      " ",
      elem(
        "a",
        { href: "https://notepadi.netlify.app/api/?id=" + doc.id },
        "raw"
      ),
      " ",
      elem(
        "button",
        {
          id: "bt_" + doc.id,
          disabled: !!doc.protected,
          onclick: () => Control.removeDoc(doc),
        },
        "drop"
      ),
    ]),
  ]);
}

export function initHtml() {
  document.body.id = app.id;
  app().append(...elements);
}
