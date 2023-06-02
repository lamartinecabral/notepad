// @ts-check

import { createStyle, css } from "../iuai";
import { Id } from "./enum";

const rules = [
  css("*", {
    fontFamily: "monospace",
  }),
  css(".margin", {
    margin: "1em",
  }),
  css(".hpadding", {
    padding: "0 1em",
  }),
  css(".center", {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(max(-50%, -50vw), max(-50%, -50vh))",
  }),
  css("td.checkbox", {
    textAlign: "center",
  }),
  css("a, a:visited", {
    color: "blue",
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
