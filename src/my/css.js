// @ts-check

import { createStyle, css } from "../utils";

const rules = [
  css("*", {
    fontFamily: "monospace",
  }),
  css("h1", {
    color: "red",
  }),
];

export function initCss() {
  const style = createStyle();
  rules.forEach((rule) => style.insertRule(rule));
}
