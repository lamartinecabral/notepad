// @ts-check

import { elem, Html, trunc } from "../utils";
import { Control } from "./control";
import { Id } from "./enum";
import { Service } from "./service";

const components = [
  elem("div", { id: Id.loginContainer, className: "center", hidden: true }, [
    elem("form", { id: Id.loginForm }, [
      elem("table", {}, [
        elem("tr", {}, [
          elem("td", {}, [elem("label", { for: "username" }, [" E-mail: "])]),
          elem("td", {}, [elem("input", { type: "text", name: "username" })]),
        ]),
        elem("tr", {}, [
          elem("td", {}, [elem("label", { for: "password" }, [" Password: "])]),
          elem("td", {}, [
            elem("input", {
              type: "password",
              name: "password",
            }),
          ]),
        ]),
        elem("tr", { id: Id.password2, hidden: true }, [
          elem("td", {}, [
            elem("label", { for: "password2" }, [" Repeat the password: "]),
          ]),
          elem("td", {}, [
            elem("input", {
              type: "password",
              name: "password2",
            }),
          ]),
        ]),
      ]),
      elem("input", {
        id: Id.loginSubmit,
        type: "submit",
        className: "margin",
        value: "Login",
      }),
    ]),
    elem("div", { className: "margin", hidden: true }, [
      elem("a", { id: Id.signinMode, href: "#" }, ["Log in"]),
    ]),
    elem("div", { className: "margin" }, [
      elem("a", { id: Id.signupMode, href: "#" }, ["create account"]),
    ]),
    elem("div", { className: "margin" }, [
      elem("a", { id: Id.resetPassword, href: "#" }, ["reset password"]),
    ]),
  ]),
  elem("div", { id: Id.content, className: "center", hidden: true }, [
    elem("div", { id: Id.docList, className: "margin" }, [
      elem("table", {}, [
        elem("tr", {}, [
          elem("th"),
          elem("th", { title: "Only you can edit" }, ["Protected"]),
          elem("th", { title: "Everyone can read", className: "hpadding" }, [
            "Public",
          ]),
        ]),
      ]),
    ]),
    elem("div", { className: "margin" }, [
      elem("button", { id: Id.claimButton, className: "margin" }, ["claim"]),
      elem("button", { id: Id.logout, type: "button", className: "margin" }, [
        "Logout",
      ]),
    ]),
  ]),
];

/** @param {import("./state").Doc} doc */
export function makeDoc(doc) {
  return elem("tr", { id: "tr_" + doc.id }, [
    elem("td", {}, [
      elem(
        "a",
        {
          id: "a_" + doc.id,
          href: location.origin + "/?" + doc.id,
          title: trunc(doc.text, 280),
        },
        [doc.id]
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
    elem("td", {}, [
      elem(
        "button",
        {
          id: "bt_" + doc.id,
          disabled: !!doc.protected,
          onclick: () => Control.removeDoc(doc),
        },
        ["drop"]
      ),
    ]),
  ]);
}

export function initHtml() {
  document.body.id = Id.app;
  Html.get(Id.app).append(...components);
}
