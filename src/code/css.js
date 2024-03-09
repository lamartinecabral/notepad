// @ts-check

import { style } from "../iuai";
import {
  app,
  status,
  header,
  claim,
  resetPassword,
  backdrop,
  modal,
  optionsModal,
  submitButton,
  langSelect,
} from "./refs";

export function initCss() {
  style("*", {
    fontFamily: "monospace",
  });
  style(app, {
    marginTop: "0",
    paddingTop: "0",
  });
  style(status, {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    top: "0",
  });
  style(status + " span", {
    background: "var(--background)",
    color: "var(--color)",
  });
  style(header, {
    textAlign: "end",
    position: "relative",
  });
  style(`${header} a, ${claim} a, ${resetPassword} a`, {
    textDecoration: "underline",
    cursor: "pointer",
    background: "var(--background)",
    color: "var(--color)",
  });
  style(backdrop, {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: "1",
  });
  style(modal, {
    background: "var(--background)",
    padding: "2em",
    position: "absolute",
    bottom: "50%",
    right: "50%",
    transform: "translate(50%, 50%)",
    color: "var(--color)",
    border: "1px solid var(--color)",
  });
  style(optionsModal + " > div:nth-child(2)", {
    marginTop: "0.5em",
  });
  style(optionsModal + " > div:nth-child(3)", {
    marginTop: "1em",
    textAlign: "center",
  });
  style(claim, {
    textAlign: "center",
    marginBottom: "1em",
  });
  style(submitButton, {
    textAlign: "center",
  });
  style(resetPassword, {
    textAlign: "center",
    margin: "1em 0 -1em 0",
  });
  style(langSelect, {
    fontSize: "0.9rem",
  });
  style(":root", {
    "--light": "#fff",
    "--dark": "#000",
  });
  style(".light", {
    "--background": "var(--light)",
    "--color": "var(--dark)",
  });
  style(".dark", {
    "--background": "var(--dark)",
    "--color": "var(--light)",
  });
}
