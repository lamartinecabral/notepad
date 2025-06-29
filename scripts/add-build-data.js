// @ts-check
const fs = require("fs");
function run() {
  const filepath = "dist/index.html";
  const buffer = fs.readFileSync(filepath);
  let fileContent = buffer.toString();

  if (process.argv[2] !== "0") {
    fileContent += "\n<!-- BUILD DATA";
    fileContent += `\nbuildTime: ${new Date().toISOString()}`;
    fileContent += `\nGITHUB_SHA: ${process.env.GITHUB_SHA}`;
    fileContent += `\nGITHUB_REF: ${process.env.GITHUB_REF}`;
    fileContent += "\n-->";
  } else {
    fileContent = fileContent.replace(/\n<!-- BUILD DATA(.|\n)*?-->/, "");
  }

  fs.writeFileSync(filepath, fileContent);
}
run();
