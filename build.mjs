import { log, getBuildConfig, runCommand, deleteFile, renameFile } from "./utils.mjs";
import esbuild from "esbuild";
import fs from "fs";
import { exit } from "process";

const buildConfig = await getBuildConfig();

log.green("\nBuilding files: \n");
await buildConfig.asyncForEach(async (config) => {
  const { name, src } = config;

  const globalName = `${name}BundledSDK`;

  try {
    await esBundle(globalName, src);
  } catch (e) {
    log.red(`\n❌ Failed to bundle ${globalName}} with src ${src}\n`);
    log.red(e.message);
    exit();
  }
});

async function esBundle(OUT_NAME, SRC_FILE) {
  // extract the file name from the path
  // e.g. ./src/index.js => index
  const fileName = SRC_FILE.split("/").pop().split(".")[0];

  // convert CosmosBundledSDK to cosmos-bundled-sdk
  const DASHED_OUT_NAME = `${fileName}-bundled-sdk`;

  if (!OUT_NAME || !SRC_FILE) {
    log.red("Please provide the output name and source file");
    exit();
  }

  await esbuild.build({
    entryPoints: [SRC_FILE],
    sourceRoot: "./",
    globalName: OUT_NAME,
    bundle: true,
    outfile: "dist/" + DASHED_OUT_NAME + ".ts",
    define: {
      zlib: "false",
      events: "false",
    },
  });

  fs.appendFileSync(
    "dist/" + DASHED_OUT_NAME + ".ts",
    "export default " + OUT_NAME + ";"
  );

  // let files = fs.readdirSync("dist");
  // files = files.map((file) => file.split(".")[0]);

  const file = "./dist/" + DASHED_OUT_NAME + ".ts";
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

  // for each line, add // in front of it
  indexFile = indexFile.replaceAll("\n", "\n//");

  // let indexFileContent = indexFile.split("export {")[1].split("}")[0].trim();

  // indexFileContent = indexFileContent.replaceAll("\n", "\n//");

  // write it to the top of the bundled file
  let targetBundle = await fs.promises.readFile(
    "./dist/" + DASHED_OUT_NAME + ".ts",
    "utf8"
  );
  targetBundle = targetBundle.replace("var", "export const");
  targetBundle = targetBundle.replace(`export default ${OUT_NAME};`, "");

  fs.writeFileSync(
    "./dist/" + DASHED_OUT_NAME + ".ts",
    `// @ts-nocheck\n//  ${indexFile}\n` + targetBundle
  );
}

console.log("");

// post build

log.green("\nGenerating types\n");

await runCommand("tsc");

const distFiles = fs.readdirSync("dist");

await distFiles.asyncForEach(async (dFile) => {
  // if the file ends with .js, delete it
  if (dFile.endsWith(".js")) {
    await deleteFile('dist/' + dFile);
  }

  // if the file ends with .d.ts, append the name with -bundled-sdk
  if (dFile.endsWith(".d.ts")) {
    dFile = dFile.split(".")[0];
    
    // rename the file
    await renameFile(`dist/${dFile}.d.ts`, `dist/${dFile}-bundled-sdk.d.ts`)
  }
});
