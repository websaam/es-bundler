import fs from "fs";

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
