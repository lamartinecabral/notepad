const fs = require("fs");
const path = require("node:path");
function run() {
  const filepath = path.resolve(__dirname, "dist/index.html");
  const buffer = fs.readFileSync(filepath);
  let fileContent = buffer.toString();

  fileContent += "<!-- BUILD DATA\n";
  fileContent += `buildTime: ${new Date().toISOString()}\n`;
  fileContent += `GITHUB_SHA: ${process.env.GITHUB_SHA}\n`;
  fileContent += `GITHUB_WORKFLOW_SHA: ${process.env.GITHUB_WORKFLOW_SHA}\n`;
  fileContent += "-->\n";

  fs.writeFileSync(filepath, fileContent);
}
run();
