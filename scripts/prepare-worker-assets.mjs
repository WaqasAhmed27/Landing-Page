import { basename } from "node:path";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const source = "dist";
const destination = ".worker-dist";
const excludedFiles = new Set(["taptile.apk"]);

if (!existsSync(source)) {
  throw new Error("dist does not exist. Run the production build first.");
}

rmSync(destination, { force: true, recursive: true });
mkdirSync(destination, { recursive: true });

cpSync(source, destination, {
  recursive: true,
  filter: (sourcePath) => !excludedFiles.has(basename(sourcePath)),
});

console.log(`Prepared Worker assets in ${join(process.cwd(), destination)}`);
