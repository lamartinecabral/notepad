// @ts-check
import { marked } from "marked";

globalThis.Prism = { disableWorkerMessageHandler: true };
const Prism = require("./prism");

/** @type {(text: string) => string} */
export const parse = (function () {
  var isOptionsUnset = true;

  return function (text) {
    if (isOptionsUnset) {
      marked.setOptions({
        breaks: true,
        highlight: function (code) {
          return Prism.highlight(
            code,
            Prism.languages.javascript,
            "javascript",
          );
        },
      });
      isOptionsUnset = false;
    }

    return marked.parse(text);
  };
})();
