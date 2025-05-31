// @ts-check
/** @typedef {keyof typeof import('./model').Languages} Languages */

/** @type {(opts: {language: Languages, source: string}) => string} */
const codeBoilerplate = ({ language, source }) => {
  switch (language) {
    case "html": {
      return source;
    }
    case "javascript": {
      return `<script type="module">${source}</script>`;
    }
    case "markdown": {
      return `
        <head>
          <link href="/markdown/prism.css" rel="stylesheet" />
          <link href="/markdown/markdown.css" rel="stylesheet" />
        </head>
        <body>
          <div id="content">${source}</div>
        </body>
      `;
    }
    case "jsx": {
      return (
        `<body><div id="root"></div><script type="module">\n` +
        `import "https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js"; import "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js";\n` +
        `${source}\n` +
        `try { ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null)); }` +
        `catch (e) { document.getElementById("root").innerHTML = '<pre style="color:red;">' + String(e) + '</pre>';}` +
        `</script></body>`
      );
    }
    default: {
      return "";
    }
  }
};

self["codeBoilerplate"] = codeBoilerplate;

/** @typedef {typeof codeBoilerplate} codeBoilerplateFn */
