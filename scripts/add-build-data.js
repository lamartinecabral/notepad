// @ts-check
const fs = require("fs");
function run() {
  const filepath = "dist/index.html";
  let fileContent = fs.readFileSync(filepath).toString();

  if (process.argv[2] !== "0") {
    const sha =
      process?.env?.GITHUB_SHA ||
      require("child_process")
        .execSync("git log -n 1")
        .toString()
        .split("\n")[0]
        .split(" ")[1];

    fileContent += "\n<!-- BUILD DATA";
    fileContent += `\nBUILD_TIME: ${new Date().toISOString()}`;
    fileContent += `\nSHA: ${sha}`;
    fileContent += `\nCI: ${process?.env?.CI || false}`;
    fileContent += "\n-->";
  } else {
    fileContent = fileContent.replace(/\n<!-- BUILD DATA(.|\n)*?-->/, "");
  }

  fs.writeFileSync(filepath, fileContent);
}
run();
