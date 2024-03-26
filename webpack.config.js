module.exports = {
  entry: {
    "js/main": "./src/main/index.js",
    "js/my": "./src/my/index.js",
    "js/markdown": "./src/markdown/index.js",
    "js/html": "./src/html/index.js",
    "js/drive": "./src/drive/index.js",
    "js/code": "./src/code/index.js",
    "js/qrcode": "./src/qrcode/index.js",
    "js/codemirror": "./src/codemirror/index.js",
    "js/firebase": "./src/firebase/index.js",
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
