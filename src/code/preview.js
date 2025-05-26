import { Html } from "./html";
import { State } from "./state";

/** @typedef {import('../marked/index')} */

export const getParsedCode = () => {
  switch (State.language.value) {
    case "html": {
      return Html.text;
    }
    case "javascript": {
      return `<script type="module">${Html.text}</script>`;
    }
    case "markdown": {
      if (!window.marked) throw new Error("marked module not imported");
      return `
        <head>
          <link href="/markdown/prism.css" rel="stylesheet" />
          <link href="/markdown/markdown.css" rel="stylesheet" />
        </head>
        <body>
          <div id="content">${window.marked.parse(Html.text)}</div>
        </body>
      `;
    }
    case "jsx": {
      if (!getBabel()) throw new Error("@babel/standalone module not imported");
      try {
        const source =
          `${Html.text}\n` +
          `try { ReactDOM.createRoot(document.getElementById("root")).render(<App />); }\n` +
          `catch(e) { document.getElementById("root").innerHTML = '<pre>' + e.name + ': ' + e.message + '</pre>';}`;
        const { code } = getBabel().transform(source, { presets: ["react"] });
        return (
          `<body><div id="root"></div><script type="module">\n` +
          `import "https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js"; import "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js";\n` +
          `${code}\n` +
          `</script></body>`
        );
      } catch (e) {
        console.error(e);
        return `<pre>${e.name}: ${e.message}</pre>`;
      }
    }
    default: {
      return "";
    }
  }
};

/** @type {() => import ('@babel/standalone')}  */
const getBabel = () => window.Babel;
