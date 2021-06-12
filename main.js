const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const NODE_MODULES = "node_modules";
const BASE_PATH = "/workspace";
const TARGET_PATH = "/npm_modules";

const getAllDirs = (dirPath) => {
  console.log("Searching " + dirPath);
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    const isPackageDir =
      files.filter((file) => file === "package.json").length === 1;
    if (isPackageDir) {
      // For powershell
      const packCmd =
        "cd " + dirPath + "; yarn pack; mv -Force *.tgz " + TARGET_PATH;
      console.log("found package.json at " + dirPath, packCmd);
      spawn(
        packCmd,
        { shell: "powershell.exe", cdw: dirPath },
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("stdout", stdout);
          console.log("stderr", stderr);
        }
      );
    }

    if (!isPackageDir) {
      const dirs = files.filter((file) =>
        fs.statSync(path.join(dirPath, file)).isDirectory()
      );
      dirs.map((dir) => {
        getAllDirs(path.join(dirPath, dir));
      });
    }
    const hasNodeModules =
      files.filter((file) => file === NODE_MODULES).length === 1;
    if (hasNodeModules) {
      getAllDirs(path.join(dirPath, NODE_MODULES));
    }
  });
};

getAllDirs(path.join(BASE_PATH, NODE_MODULES));
