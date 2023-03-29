import fs from "fs";
import { spawn } from "child_process";

Array.prototype.asyncForEach = async function (callback) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[index], index, this);
  }
};

export const log = (...args) => {
  console.log("\x1b[30m", ...args, "\x1b[0m");
};

log.red = (...args) => {
  console.log("\x1b[31m", ...args, "\x1b[0m");
};

log.green = (...args) => {
  console.log("\x1b[32m", ...args, "\x1b[0m");
};

export async function getBuildConfig() {
  const file = process.cwd() + "/build.config.json";

  try {
    const content = await fs.promises.readFile(file, "utf8");
    return JSON.parse(content);
  } catch (e) {
    log.red(e.message);
    process.exit();
  }
}

export function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let output = "";

    process.stdout.on("data", (data) => {
      output += data;
    });

    process.stderr.on("data", (data) => {
      reject(data.toString());
    });

    process.on("error", (error) => {
      reject(error);
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(`Command ${command} failed with code ${code}`);
      } else {
        resolve(output.trim());
      }
    });
  });
}

export function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function renameFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}