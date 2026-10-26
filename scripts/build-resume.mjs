import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const localCompiler = fileURLToPath(new URL("../.tools/typst/typst", import.meta.url));
const compiler = process.env.TYPST_BIN || (existsSync(localCompiler) ? localCompiler : "typst");
const output = fileURLToPath(new URL("../public/resume.pdf", import.meta.url));

export function buildResume() {
  mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
  execFileSync(compiler, [
    "compile",
    "--root",
    root,
    "--font-path",
    "templates/fonts",
    "--ignore-system-fonts",
    "templates/resume.typ",
    output,
  ], { cwd: root, stdio: "inherit" });

  console.log("Generated public/resume.pdf.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildResume();
}
