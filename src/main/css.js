// @ts-check

import { style } from "../iuai";
import {
  app,
  status,
  textarea,
  github,
  header,
  footer,
  claim,
  resetPassword,
  backdrop,
  modal,
  optionsModal,
  submitButton,
  theme,
} from "./refs";

export function initCss() {
  const supportCssVar = !!CSS.supports?.("color: var(--x)");
  const [background, color] = supportCssVar
    ? ["var(--background)", "var(--color)"]
    : ["white", "black"];

  style("*", {
    fontFamily: "monospace",
  });
  const appRule = style(app, {
    background,
    color,
    margin: "0",
    padding: "0",
    overflow: "hidden",
    height: "100vh",
  });
  style(status, {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    top: "0",
  });
  style(status + " span", {
    background,
    color,
  });
  style(textarea, {
    width: "calc(100% - 22px)",
    height: "calc(100% - 22px)",
    margin: "8px",
    padding: "2px",
    border: "1px solid",
    resize: "none",
    tabSize: "4",
    background,
    color,
    overflowAnchor: "none", // it fixes chromium's scroll anchor bug https://bugs.chromium.org/p/chromium/issues/detail?id=997266
  });
  style(github, {
    position: "fixed",
    background: "#fff",
    borderRadius: "50%",
    bottom: "3px",
    left: "calc(50% - 12px)",
    height: "24px",
  });
  style(header, {
    position: "fixed",
    top: "0px",
    right: "3em",
  });
  style(footer, {
    position: "fixed",
    bottom: "2px",
    right: "3em",
  });
  style(`${header} a, ${footer} a, ${claim} a, ${resetPassword} a`, {
    textDecoration: "underline",
    cursor: "pointer",
    background,
    color,
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
    background,
    padding: "2em",
    position: "absolute",
    bottom: "50%",
    right: "50%",
    transform: "translate(50%, 50%)",
    color,
    border: `1px solid ${color}`,
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
  !supportCssVar &&
    style(theme, {
      display: "none",
    });

  const setHeight = () => (appRule.style.height = window.innerHeight + "px");
  setHeight();
  window.addEventListener("resize", setHeight);
}
