// @ts-check

import { style } from "iuai";
import { Id } from "./enum";

export function initCss() {
  style("*", {
    fontFamily: "monospace",
  });
  const appRule = style(`#${Id.app}`, {
    background: "var(--background)",
    color: "var(--color)",
    margin: "0",
    padding: "0",
    overflow: "hidden",
    height: "100vh",
  });
  style(`#${Id.status}`, {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    top: "0",
  });
  style(`#${Id.status} span`, {
    background: "var(--background)",
    color: "var(--color)",
  });
  style(`#${Id.textarea}`, {
    width: "calc(100% - 22px)",
    height: "calc(100% - 22px)",
    margin: "8px",
    padding: "2px",
    border: "1px solid",
    resize: "none",
    tabSize: "4",
    background: "var(--background)",
    color: "var(--color)",
    overflowAnchor: "none", // it fixes chromium's scroll anchor bug https://bugs.chromium.org/p/chromium/issues/detail?id=997266
  });
  style(`#${Id.github}`, {
    position: "fixed",
    background: "var(--light)",
    borderRadius: "50%",
    bottom: "3px",
    left: "calc(50% - 12px)",
  });
  style(`#${Id.header}`, {
    position: "fixed",
    top: "0px",
    right: "3em",
    margin: "0 -4px",
  });
  style(`#${Id.header} > *`, {
    margin: "0 4px",
  });
  style(`#${Id.footer}`, {
    position: "fixed",
    bottom: "2px",
    right: "3em",
  });
  style(
    `#${Id.header} a, #${Id.footer} a, #${Id.claim} a, #${Id.resetPassword} a`,
    {
      textDecoration: "underline",
      cursor: "pointer",
      background: "var(--background)",
      color: "var(--color)",
    }
  );
  style(`#${Id.backdrop}`, {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    zIndex: "1",
  });
  style(`#${Id.modal}`, {
    background: "var(--background)",
    padding: "2em",
    position: "absolute",
    bottom: "50%",
    right: "50%",
    transform: "translate(50%, 50%)",
    color: "var(--color)",
    border: "1px solid var(--color)",
  });
  style(`#${Id.optionsModal} > div:nth-child(2)`, {
    marginTop: "0.5em",
  });
  style(`#${Id.optionsModal} > div:nth-child(3)`, {
    marginTop: "1em",
    textAlign: "center",
  });
  style(`#${Id.claim}`, {
    textAlign: "center",
    marginBottom: "1em",
  });
  style(`#${Id.submitButton}`, {
    textAlign: "center",
  });
  style(`#${Id.resetPassword}`, {
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

  const setHeight = () => (appRule.style.height = window.innerHeight + "px");
  setHeight();
  window.addEventListener("resize", setHeight);
}
