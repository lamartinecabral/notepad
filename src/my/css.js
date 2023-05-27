// @ts-check

import { createStyle, css } from "../utils";
import { Id } from "./enum";

const rules = [
  css("*", {
    fontFamily: "monospace",
  }),
  css(".margin", {
    margin: "1em",
  }),
  css(".center", {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }),
  css(`#${Id.loginContainer}`, {
    padding: "2em",
  }),
  css(`#${Id.content} table`, {
    margin: "auto",
  }),
];

export function initCss() {
  const style = createStyle();
  rules.forEach((rule) => style.insertRule(rule));
}
