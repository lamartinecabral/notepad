// @ts-check

import { style } from "../iuai";
import {
  app,
  loginContainer,
  content,
  userEmail,
  docGrid,
  docList,
} from "./refs";

export function initCss() {
  style("*", {
    fontFamily: "monospace",
  });
  style(app, {
    margin: "0",
    padding: "0",
  });
  style("th", {
    minWidth: "9ch",
  });
  style("tr > td:first-child", {
    textAlign: "start",
  });
  style(".margin", {
    margin: "1em",
  });
  style(".nav", {
    display: "flex",
    gap: "1em",
    alignItems: "center",
  });
  style(".center", {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(max(-50%, -50vw), max(-50%, -50vh))",
  });
  style("td.checkbox", {
    textAlign: "center",
  });
  style(".checkboxContainer", {
    display: "flex",
    alignItems: "center",
    gap: "3px",
  });
  style("a, a:visited", {
    color: "blue",
  });
  style(loginContainer, {
    padding: "2em",
  });
  style(content, {
    maxWidth: "100%",
  });
  style(userEmail, {
    color: "#a9a9a9",
  });
  style(`${docList} tr:nth-child(even)`, {
    background: "#eee",
  });

  style(docGrid, {
    padding: "0 1.5em 1.5em 1.5em",
    width: "calc(100vw - 3em)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, auto))",
    gap: "0.5em 1em",
  });
  style(`${docGrid} > div > div.header`, {
    display: "flex",
    justifyContent: "space-between",
  });
  style(`${docGrid} > div > div > button`, {
    padding: "0 8px",
    margin: "unset",
    background: "unset",
    border: "unset",
    cursor: "pointer",
  });
  style(`${docGrid} > div .docname`, {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });
  style(`${docGrid} > div div.textarea`, {
    display: "flex",
    height: "200px",
  });
  style(`${docGrid} > div div.textarea > textarea`, {
    color: "#555",
    background: "#eee",
    resize: "none",
    whiteSpace: "pre",
    width: "100%",
    overflow: "hidden",
  });
  style(`${docGrid} > div div.textarea > textarea:focus`, {
    overflow: "scroll",
  });
  style(`${docGrid} > div div.textarea > div`, {
    color: "#555",
    background: "#eee",
    width: "100%",
  });
  style(`${docGrid} > div div.textarea > div > div`, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  });
}
