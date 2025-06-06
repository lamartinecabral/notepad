// @ts-check
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorSelection, EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { linter } from "@codemirror/lint";
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

const handleModS = () => {
  if (!modSHandler) return false;
  return modSHandler(), true;
};

const modS = {
  key: "Mod-s",
  run: handleModS,
  get preventDefault() {
    return !!modSHandler;
  },
};

const fixedHeightEditor = EditorView.theme({
  "&": { height: "100%" },
  ".cm-scroller": { overflow: "auto" },
});

const changeListener = EditorView.updateListener.of((update) => {
  if (update.docChanged && changeHandler)
    changeHandler(update.state.doc.toString());
});

const syntaxErrorLinter = linter((view) => {
  /** @type {import("@codemirror/lint").Diagnostic[]} */
  const diagnostics = [];
  syntaxTree(view.state)
    .cursor()
    .iterate((node) => {
      if (node.type.isError) {
        diagnostics.push({
          from: node.from,
          to: node.to,
          severity: "error",
          message: "SyntaxError",
        });
      }
    });
  return diagnostics;
});

let currentLang = "";

const getLanguage = () => {
  return (
    {
      html: () => [html(), syntaxErrorLinter],
      javascript: () => [javascript(), syntaxErrorLinter],
      jsx: () => [javascript({ jsx: true }), syntaxErrorLinter],
      css: () => [css(), syntaxErrorLinter],
      cpp: () => [cpp(), syntaxErrorLinter],
      python: () => [python(), syntaxErrorLinter],
      java: () => [java(), syntaxErrorLinter],
      markdown: () =>
        markdown({
          defaultCodeLanguage: javascript(),
        }),
    }[currentLang]?.() ?? []
  );
};

let nightMode = false;

let readonly = false;

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
      ...(readonly ? [EditorState.readOnly.of(true)] : []),
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

/**
 * @param {string} text
 * @param {number} [cursor]
 * */
export const setValue = (text, cursor) => {
  if (!editor) return;
  const transaction = {
    changes: [{ from: 0, to: editor.state.doc.length, insert: text }],
  };
  try {
    editor.dispatch({
      ...transaction,
      scrollIntoView: true,
      selection:
        cursor !== undefined
          ? EditorSelection.create([EditorSelection.range(cursor, cursor)])
          : editor.state.selection,
    });
  } catch (_) {
    editor.dispatch(transaction);
  }
};

/** @returns {number | undefined} */
export const getCursor = () => {
  if (!editor) return;
  if (editor.state.selection.ranges.length !== 1) return;
  const { from, to } = editor.state.selection.ranges[0];
  if (from !== to) return;
  return from;
};

/** @param {string} lang */
export const setLanguage = (lang) => {
  if (currentLang !== lang) {
    currentLang = lang;
    editor && editor.setState(state(getValue()));
  }
};

export const setReadonly = (value) => {
  if (value === readonly) return;
  readonly = value;
  editor && editor.setState(state(getValue()));
};
