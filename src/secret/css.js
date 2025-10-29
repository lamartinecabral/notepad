// @ts-check

import { style } from "../iuai";
import { assert } from "../utils";
import {
  app,
  status,
  header,
  textarea,
  backdrop,
  modal,
  theme,
  optionsModal,
  secretName,
  remember,
} from "./refs";

export function initCss() {
  const supportCssVar = !!window.CSS?.supports?.("color: var(--x)");
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
  style(header, {
    position: "fixed",
    top: "0px",
    right: "3em",
  });
  style(`${header} a`, {
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
  style(`${optionsModal} > div:first-child`, {
    textAlign: "center",
  });
  style(`${optionsModal} > div:first-child > div:first-child`, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  });
  style(`${secretName}`, {
    resize: "none",
  });
  style(".withTooltip", {
    position: "relative",
  });
  style(".tooltip", {
    visibility: "hidden",
    position: "absolute",
    backgroundColor: "#333",
    color: "#fff",
    padding: "1.5ch",
    width: "30ch",
    zIndex: "10",
  });
  style(".withTooltip:hover .tooltip", {
    visibility: "visible",
  });
  style(`div:has(> ${remember})`, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  });
  style(":root", {
    "--light": "#fff",
    "--dark": "#000",
    "--nightcolor": "#abb2bf",
    "--nightbg": "#181b20",
  });
  style(".light", {
    "--background": "var(--light)",
    "--color": "var(--dark)",
  });
  style(".dark", {
    "--background": "var(--nightbg)",
    "--color": "var(--nightcolor)",
  });
  !supportCssVar &&
    style(`${theme}`, {
      display: "none",
    });

  const setHeight = () =>
    (assert(appRule).style.height = window.innerHeight + "px");
  setHeight();
  window.addEventListener("resize", setHeight);
}
