// @ts-check
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "./prism.js";

const Prism = globalThis.Prism;

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "language-",
    highlight(code, lang) {
      if (!lang) lang = "js";
      if (!(lang in Prism.languages)) lang = "plaintext";
      console.log(Prism.languages);
      return Prism.highlight(code, Prism.languages[lang], lang);
    },
  }),
);

/** @type {(text: string) => string} */
export const parse = (function () {
  var isOptionsUnset = true;

  return function (text) {
    if (isOptionsUnset) {
      marked.setOptions({
        breaks: true,
      });
      isOptionsUnset = false;
    }

    return marked.parse(text, { async: false });
  };
})();
