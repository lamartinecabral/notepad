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
    default: {
      return "";
    }
  }
};
