const beautify = require("js-beautify");
const fs = require("fs");
const extract = require("extract-zip");
const path = require("path");
const process = require("process");
const options = require("./config");

const zipname = "code.zip";
const output = process.cwd() + "/output";

let files = [];

const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      files.push(
        absolute
          .substr(process.cwd().toString().replaceAll(/\\/g, "\\\\").length - 1)
          .replaceAll("\\", "/")
      );
    }
  }
};

const data = async () => {
  try {
    await extract(zipname, { dir: output });
    console.log("Extracted");
    getFilesRecursively(output);
    console.log(files);
    files.map((file) => {
      const contents = fs.readFileSync(file, "utf-8");
      const formatted = beautify(contents, options);
      // console.log(formatted);
      fs.writeFileSync(file, formatted);
    });
  } catch (err) {
    console.log(err);
  }
};

data();
