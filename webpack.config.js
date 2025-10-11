const entries = {
  entry: {
    "js/my": "./src/my/index.js",
    "js/markdown": "./src/markdown/index.js",
    "js/marked": "./src/marked/index.js",
    "js/html": "./src/html/index.js",
    "js/code": "./src/code/index.js",
    "js/code.worker": "./src/code/worker.js",
    "js/code.boilerplate": "./src/code/boilerplate.js",
    "js/qrcode": "./src/qrcode/index.js",
    "js/history": "./src/history/index.js",
    "js/codemirror": "./src/codemirror/index.js",
    "js/firebase": "./src/firebase/index.js",
  },
};

const es5Entries = {
  entry: {
    "js/main": "./src/main/index.js",
    "js/firebase8": "./src/firebase8/index.js",
  },
  module: {
    rules: [
      {
        test: /\.[mc]?[jt]s$/,
        use: "ts-loader",
      },
    ],
  },
  target: ["es5", "web"],
};

module.exports = [entries, es5Entries];
