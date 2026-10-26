import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const localCompiler = fileURLToPath(new URL("../.tools/typst/typst", import.meta.url));
export const compiler = process.env.TYPST_BIN || (existsSync(localCompiler) ? localCompiler : "typst");
const privateData = "resume.private.yaml";

/**
 * Public builds write public/resume.pdf for the site. Private builds merge
 * resume.private.yaml and write to the git-ignored out/ folder, never public/,
 * so private details cannot end up in the deployed site.
 */
export function buildResume({ isPrivate = false } = {}) {
  const outDir = isPrivate ? "out" : "public";
  const output = `${outDir}/${isPrivate ? "resume-private.pdf" : "resume.pdf"}`;
  const inputs = [];

  if (isPrivate) {
    if (!existsSync(new URL(`../${privateData}`, import.meta.url))) {
      throw new Error(`Missing ${privateData}. Copy resume.private.example.yaml to ${privateData} first.`);
    }
    inputs.push("--input", `private=/${privateData}`);
  }

  mkdirSync(new URL(`../${outDir}/`, import.meta.url), { recursive: true });
  execFileSync(compiler, [
    "compile",
    "--root",
    root,
    "--font-path",
    "templates/fonts",
    "--ignore-system-fonts",
    ...inputs,
    "templates/resume.typ",
    output,
  ], { cwd: root, stdio: "inherit" });

  console.log(`Generated ${output}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildResume({ isPrivate: process.argv.includes("--private") });
}
