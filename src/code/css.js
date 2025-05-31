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
  editor,
  preview,
} from "./refs";
import * as State from "./state";

export function initCss() {
  style("*", {
    fontFamily: "monospace",
  });
  style(app, {
    margin: "0",
    padding: "0",
    background: "var(--background)",
    color: "var(--color)",
  });
  style(`${app} > div`, {
    margin: "0 8px",
  });
  const editorRule = style(editor, {
    height: "calc(calc(100vh - 8px) - 1rem)",
    scrollbarColor: "var(--color) transparent",
  });
  style(status, {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    top: "0",
    zIndex: "10",
  });
  style(status + " span", {
    background: "var(--background)",
    color: "var(--color)",
  });
  style(header, {
    textAlign: "end",
    position: "relative",
    height: "1rem",
    zIndex: "5",
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
    background: "var(--background)",
    color: "var(--color)",
  });
  style(":root", {
    "--light": "#fff",
    "--dark": "#000",
    "--nightcolor": "#abb2bf",
    "--nightbg": "#181b20",
    "--splitsize": "60vw",
  });
  style(".light", {
    "--background": "var(--light)",
    "--color": "var(--dark)",
  });
  style(".dark", {
    "--background": "var(--nightbg)",
    "--color": "var(--nightcolor)",
  });
  style(".split", {
    float: "left",
    width: "var(--splitsize)",
    resize: "horizontal",
    overflow: "auto",
  });
  style(preview, {
    display: "none",
  });
  style(`.split + ${preview}`, {
    display: "unset",
    position: "fixed",
    height: "calc(100% - 16px)",
    width: "-webkit-fill-available",
    margin: "8px 8px 8px 0",
    boxSizing: "border-box",
    background: "#fff",
  });

  const resizeListener = () => {
    State.State.isMobile.pub(window.innerWidth <= 480);
    editorRule.style.height = `calc(${window.innerHeight - 8}px - 1rem)`;
  };
  resizeListener();
  window.addEventListener("resize", resizeListener);
}
