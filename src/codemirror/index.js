// @ts-check
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

let changeHandler;

/** @param {(text: string) => void} func */
const onChange = (func) => {
  changeHandler = func;
};

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
      keymap.of([indentWithTab]),
      getLanguage(),
    ],
  });
};

/**
 * @template T
 * @param {T extends Element ? T : never} parent
 */
const initEditor = (parent) => {
  editor = new EditorView({
    ...state(""),
    parent,
  });
};

const getValue = () => {
  return editor && editor.state.doc.toString();
};

/** @param {string} text */
const setValue = (text) => {
  editor && editor.setState(state(text));
};

/** @param {string} lang */
const setLanguage = (lang) => {
  if (currentLang !== lang) {
    currentLang = lang;
    editor && editor.setState(state(getValue()));
  }
};

const codemirror = {
  onChange,
  initEditor,
  getValue,
  setValue,
  setLanguage,
};

// @ts-ignore
window.codemirror = codemirror;
export default codemirror;
