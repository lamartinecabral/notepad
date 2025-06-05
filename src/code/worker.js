// @ts-check
importScripts("/js/marked.js");
importScripts("/js/code.boilerplate.js");
importScripts("https://unpkg.com/@babel/standalone@7.27.2/babel.min.js");

postMessage("codeWorkerReady");

addEventListener("message", (ev) => {
  if ("type" in ev.data && ev.data.type === "codeWorkerMessage") {
    try {
      postMessage({
        type: "codeWorkerMessage",
        value: getParsedCode(ev.data.value),
      });
    } catch (err) {
      console.error(err);
      postMessage({ type: "codeWorkerMessage", value: "" });
    }
  }
});

const getParsedCode = ({ language, source }) => {
  switch (language) {
    case "html": {
      return codeBoilerplate({ language: "html", source });
    }
    case "javascript": {
      return codeBoilerplate({ language: "javascript", source });
    }
    case "markdown": {
      if (typeof marked === "undefined")
        throw new Error("marked module not imported");
      return codeBoilerplate({
        language: "markdown",
        source: marked.parse(source),
      });
    }
    case "jsx": {
      const { code } = getBabel().transform(source, { presets: ["react"] });
      return codeBoilerplate({ language: "jsx", source: code ?? "" });
    }
    default: {
      return "";
    }
  }
};

/** @type {() => import ('@babel/standalone')}  */
const getBabel = () => {
  // @ts-ignore
  if ("Babel" in self) return self["Babel"];
  throw new Error("@babel/standalone module not imported");
};

/** @type {import ('./boilerplate').codeBoilerplateFn}  */
const codeBoilerplate = (param) => {
  // @ts-ignore
  if ("codeBoilerplate" in self) return self["codeBoilerplate"](param);
  throw new Error("code.boilerplate module not imported");
};
