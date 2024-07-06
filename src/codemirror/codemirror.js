// @ts-check
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

let changeHandler;

/** @param {(text: string) => void} func */
export const onChange = (func) => {
  changeHandler = func;
};

let modSHandler;

/** @param {() => void} func */
export const onModS = (func) => {
  modSHandler = func;
};

const handleModS = (_, ev) => {
  if (!modSHandler) return;
  ev.preventDefault();
  modSHandler();
};

const modS = { key: "Mod-s", run: handleModS };

const changeListener = EditorView.updateListener.of((update) => {
  if (update.docChanged && changeHandler)
    changeHandler(update.state.doc.toString());
});

let currentLang = "html";

const getLanguage = () => {
  return {
    html: () => html(),
    javascript: () => javascript(),
    css: () => css(),
    cpp: () => cpp(),
    python: () => python(),
    java: () => java(),
    markdown: () =>
      markdown({
        defaultCodeLanguage: javascript(),
      }),
  }[currentLang]();
};

/** @type {EditorView} */
let editor;

/** @param {string} text */
const state = (text) => {
  return EditorState.create({
    doc: text,
    selection: editor && editor.state.selection,
    extensions: [
      changeListener,
      basicSetup,
      keymap.of([indentWithTab, modS]),
      getLanguage(),
    ],
  });
};

/**
 * @template T
 * @param {T extends Element ? T : never} parent
 */
export const initEditor = (parent) => {
  editor = new EditorView({
    ...state(""),
    parent,
  });
};

export const getValue = () => {
  return editor && editor.state.doc.toString();
};

/** @param {string} text */
export const setValue = (text) => {
  editor && editor.setState(state(text));
};

/** @param {string} lang */
export const setLanguage = (lang) => {
  if (currentLang !== lang) {
    currentLang = lang;
    editor && editor.setState(state(getValue()));
  }
};
