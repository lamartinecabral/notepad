// @ts-check
const cp = require("child_process");
const fs = require("fs");
const pkg = require("../package.json");

const run = () => {
  const htmlFiles = cp
    .execSync('find dist -name "*.html"')
    .toString()
    .trim()
    .split("\n");

  const iuaiVersion = pkg.devDependencies.iuai;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file).toString();
    const result = content.replace(
      /iuai@\d+\.\d+\.\d+/g,
      "iuai@" + iuaiVersion,
    );
    if (result !== content) fs.writeFileSync(file, result);
  }
};

run();
