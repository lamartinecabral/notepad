// @ts-check
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";

let changeHandler;
export const onChange = (/** @type {(text: string) => void} */ func) =>
  (changeHandler = func);

const changeListener = EditorView.updateListener.of((update) => {
  if (update.docChanged && changeHandler)
    changeHandler(update.state.doc.toString());
});

const state = (/** @type {string} */ text) =>
  EditorState.create({
    doc: text,
    extensions: [changeListener, basicSetup, html()],
  });

export const editor = new EditorView({
  ...state(""),
  parent: document.body,
});

export const getText = () => {
  return editor.state.doc.toString();
};

export const setText = (/** @type {string} */ text) => {
  editor.setState(state(text));
};
