import { log, getBuildConfig } from "./utils.mjs";
import esbuild from "esbuild";
import fs from "fs";
import { exit } from "process";

const buildConfig = await getBuildConfig();

log.green("\nBuilding files: \n");
await buildConfig.asyncForEach(async (config) => {
  const { globalName, src } = config;

  try {
    await esBundle(globalName, src);
  } catch (e) {
    log.red(`\n❌ Failed to bundle ${globalName}} with src ${src}\n`);
    log.red(e.message);
    exit();
  }
});

async function esBundle(OUT_NAME, SRC_FILE) {
  if (!OUT_NAME || !SRC_FILE) {
    log.red("Please provide the output name and source file");
    exit();
  }

  await esbuild.build({
    entryPoints: [SRC_FILE],
    sourceRoot: "./",
    globalName: OUT_NAME,
    bundle: true,
    outfile: "dist/" + OUT_NAME + ".js",
    define: {
      zlib: "false",
      events: "false",
    },
  });

  fs.appendFileSync(
    "dist/" + OUT_NAME + ".js",
    "export default " + OUT_NAME + ";"
  );

  // let files = fs.readdirSync("dist");
  // files = files.map((file) => file.split(".")[0]);

  const file = "./dist/" + OUT_NAME + ".js";
  // files.forEach((file) => {
  // get the size of the file
  const stats = fs.statSync(file);
  const fileSizeInBytes = stats.size;

  // convert the file size to megabytes
  const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

  // print the file size
  log.green("  ", file, "file size: " + fileSizeInMegabytes + " MB");
  // });

  // get the content of the index.js file between export { and };
  let indexFile = await fs.promises.readFile(SRC_FILE, "utf8");

  let indexFileContent = indexFile.split("export {")[1].split("}")[0].trim();

  indexFileContent = indexFileContent.replaceAll("\n", "\n//");

  // write it to the top of the bundled file
  let targetBundle = await fs.promises.readFile(
    "./dist/" + OUT_NAME + ".js",
    "utf8"
  );
  targetBundle = targetBundle.replace("var", "export const");
  targetBundle = targetBundle.replace(`export default ${OUT_NAME};`, "");

  fs.writeFileSync(
    "./dist/" + OUT_NAME + ".js",
    `// @ts-nocheck\n//  ${indexFileContent}\n` + targetBundle
  );
}

console.log("");
