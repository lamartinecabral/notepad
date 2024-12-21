// @ts-check

export const Languages = {
  plaintext: {
    value: "plaintext",
    label: "plain text",
  },
  cpp: {
    value: "cpp",
    label: "c++",
  },
  css: {
    value: "css",
    label: "css",
  },
  html: {
    value: "html",
    label: "html",
  },
  java: {
    value: "java",
    label: "java",
  },
  javascript: {
    value: "javascript",
    label: "javascript",
  },
  markdown: {
    value: "markdown",
    label: "markdown",
  },
  python: {
    value: "python",
    label: "python",
  },
};

/** @returns {keyof typeof Languages} */
export function parseLanguage(code) {
  return code in Languages ? code : "html";
}
