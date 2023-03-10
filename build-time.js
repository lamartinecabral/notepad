const fs = require("fs");
const path = require("node:path");
function run(){
  const filepath = path.resolve(__dirname, "src/main/index.js");
  const buffer = fs.readFileSync(filepath);
  let fileContent = buffer.toString();
  if(process.argv[2] === "set"){
    fileContent += `;window.buildTime = "${new Date().toISOString()}"`;
  } else if(process.argv[2] === "unset"){
    fileContent = fileContent.replace(/;window.buildTime.*/, "");
  } else return;
  fs.writeFileSync(filepath, fileContent); 
}
run();