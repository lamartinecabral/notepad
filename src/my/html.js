// @ts-check

import { elem, Html } from "../utils";
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
    elem("div", { id: Id.docList, className: "margin" }),
    elem("div", { className: "margin" }, [
      elem("label", { for: "docId" }, ["Note id: "]),
      elem("input", { id: Id.claimInput, type: "text", name: "docId" }),
      elem("button", { id: Id.claimButton }, ["claim"]),
    ]),
    elem("button", { id: Id.logout, type: "button", className: "margin" }, [
      "Logout",
    ]),
  ]),
];

/** @param {string[]} list */
export function makeList(list) {
  return elem("table", {}, [
    elem("tr", {}, [elem("th", { colSpan: 2 }, ["My notes"])]),
    ...(list.length
      ? list.map((doc) =>
          elem("tr", {}, [
            elem("td", {}, [
              elem("a", { href: location.origin + "/?" + doc }, [doc]),
            ]),
            elem("td", {}, [
              elem(
                "button",
                {
                  onclick: () =>
                    Service.drop(doc).catch(() => {
                      alert(
                        "Remove the protection of the note then try again."
                      );
                    }),
                },
                ["drop"]
              ),
            ]),
          ])
        )
      : ["you have not claimed any notes yet"]),
  ]);
}

export function initHtml() {
  document.body.id = Id.app;
  Html.get(Id.app).append(...components);
}
