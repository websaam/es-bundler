import esbuild from "esbuild";
import fs from "fs";

const OUT_NAME = "LitThirdPartyLibs";
const SRC_FILE = "srcIPFS.js";

(async () => {
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

  let files = fs.readdirSync("dist");
  files = files.map((file) => file.split(".")[0]);

  files.forEach((file) => {
    // get the size of the file
    const stats = fs.statSync("dist/" + file + ".js");
    const fileSizeInBytes = stats.size;

    // convert the file size to megabytes
    const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

    // print the file size
    console.log(file, "file size: " + fileSizeInMegabytes + " MB");
  });

  // get the content of the index.js file between export { and };
  const indexFile = await fs.promises.readFile(SRC_FILE, "utf8");
  let indexFileContent = indexFile.split("export {")[1].split("}")[0].trim();

  indexFileContent = indexFileContent.replaceAll("\n", "\n//");

  // write it to the top of the bundled file
  const targetBundle = await fs.promises.readFile(
    "./dist/" + OUT_NAME + ".js",
    "utf8"
  );

  fs.writeFileSync(
    "./dist/" + OUT_NAME + ".js",
    `//  ${indexFileContent}\n` + targetBundle
  );
})();
