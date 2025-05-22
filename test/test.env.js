// @ts-check
const fs = require("fs");

/** @type {Record<string,string>} */
const dotenv = fs.existsSync(".env")
  ? fs
      .readFileSync(".env")
      .toString()
      .trim()
      .split("\n")
      .filter((a) => a.includes("="))
      .map((a) => {
        const [key, ...value] = a.split("=");
        return [key, value.join("=")];
      })
      .reduce((a, [key, value]) => {
        a[key] = value;
        return a;
      }, {})
  : {};

const host = process.env.HOST || dotenv.HOST;
const docId = process.env.TEST_DOC_ID || dotenv.TEST_DOC_ID;

if (!docId) throw new Error("TEST_DOC_ID undefined");

module.exports = {
  host: host === "remote" ? "remote" : "local",
  docId,
};
