// @ts-check

import { createStyle, css } from "../iuai";
import { Id } from "./enum";

const rules = [
  css("*", {
    fontFamily: "monospace",
  }),
  css(`#${Id.app}`, {
    background: "var(--background)",
    color: "var(--color)",
  }),
  css(`#${Id.status}`, {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    top: "0",
  }),
  css(`#${Id.status} span`, {
    background: "var(--background)",
    color: "var(--color)",
  }),
  css(`#${Id.textarea}`, {
    width: "100%",
    height: "100%",
    resize: "none",
    tabSize: "4",
    background: "var(--background)",
    color: "var(--color)",
    overflowAnchor: "none", // it fixes chromium's scroll anchor bug https://bugs.chromium.org/p/chromium/issues/detail?id=997266
  }),
  css(`#${Id.github}`, {
    position: "fixed",
    background: "var(--light)",
    borderRadius: "50%",
    bottom: "3px",
    left: "calc(50% - 12px)",
  }),
  css(`#${Id.header}`, {
    position: "fixed",
    top: "0px",
    right: "3em",
    margin: "0 -4px",
  }),
  css(`#${Id.header} > *`, {
    margin: "0 4px",
  }),
  css(`#${Id.footer}`, {
    position: "fixed",
    bottom: "2px",
    right: "3em",
  }),
  css(
    `#${Id.header} a, #${Id.footer} a, #${Id.claim} a, #${Id.resetPassword} a`,
    {
      textDecoration: "underline",
      cursor: "pointer",
      background: "var(--background)",
      color: "var(--color)",
    }
  ),
  css(`#${Id.backdrop}`, {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: "1",
  }),
  css(`#${Id.modal}`, {
    background: "var(--background)",
    padding: "2em",
    position: "absolute",
    bottom: "50%",
    right: "50%",
    transform: "translate(50%, 50%)",
    color: "var(--color)",
    border: "1px solid var(--color)",
  }),
  css(`#${Id.optionsModal} > div:nth-child(2)`, {
    marginTop: "0.5em",
  }),
  css(`#${Id.optionsModal} > div:nth-child(3)`, {
    marginTop: "1em",
    textAlign: "center",
  }),
  css(`#${Id.claim}`, {
    textAlign: "center",
    marginBottom: "1em",
  }),
  css(`#${Id.submitButton}`, {
    textAlign: "center",
  }),
  css(`#${Id.resetPassword}`, {
    textAlign: "center",
    margin: "1em 0 -1em 0",
  }),
  css(":root", {
    "--light": "#fff",
    "--dark": "#000",
  }),
  css(".light", {
    "--background": "var(--light)",
    "--color": "var(--dark)",
  }),
  css(".dark", {
    "--background": "var(--dark)",
    "--color": "var(--light)",
  }),
];

export function initCss() {
  const style = createStyle();
  rules.forEach((rule) => style.insertRule(rule));
}
