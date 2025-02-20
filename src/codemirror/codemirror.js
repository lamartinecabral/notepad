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
import { oneDark } from "@codemirror/theme-one-dark";

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
  if (!modSHandler) return false;
  ev.preventDefault();
  return modSHandler(), true;
};

const modS = { key: "Mod-s", run: handleModS };

const fixedHeightEditor = EditorView.theme({
  "&": { height: "100%" },
  ".cm-scroller": { overflow: "auto" },
});

const changeListener = EditorView.updateListener.of((update) => {
  if (update.docChanged && changeHandler)
    changeHandler(update.state.doc.toString());
});

let currentLang = "";

const getLanguage = () => {
  return (
    {
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
    }[currentLang]?.() ?? { extension: [] }
  );
};

let nightMode = false;

/** @type {EditorView} */
let editor;

/** @param {string} text */
const state = (text) => {
  const stateProps = {
    doc: text,
    extensions: [
      changeListener,
      basicSetup,
      keymap.of([indentWithTab, modS]),
      getLanguage(),
      fixedHeightEditor,
      ...(nightMode ? [oneDark] : []),
    ],
  };
  try {
    return EditorState.create({
      ...stateProps,
      selection: editor && editor.state.selection,
    });
  } catch (_) {
    return EditorState.create(stateProps);
  }
};

/**
 * @template T
 * @param {T extends Element ? T : never} parent
 * @param {{nightMode?: boolean}} [options]
 */
export const initEditor = (parent, options) => {
  nightMode = options?.nightMode === true;
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
  if (!editor) return;
  const transaction = {
    changes: [{ from: 0, to: editor.state.doc.length, insert: text }],
  };
  try {
    editor.dispatch({ ...transaction, selection: editor.state.selection });
  } catch (_) {
    editor.dispatch(transaction);
  }
};

/** @param {string} lang */
export const setLanguage = (lang) => {
  if (currentLang !== lang) {
    currentLang = lang;
    editor && editor.setState(state(getValue()));
  }
};
