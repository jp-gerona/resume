// Resets a fresh copy of this repository to the blank starter resume.
import { copyFileSync, existsSync, rmSync } from "node:fs";
import process from "node:process";
import { createInterface } from "node:readline/promises";

const resume = new URL("../src/content/resume/resume.yaml", import.meta.url);
const starter = new URL("../examples/starter.yaml", import.meta.url);
const cname = new URL("../public/CNAME", import.meta.url);

if (!process.argv.includes("--yes")) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question("This replaces src/content/resume/resume.yaml with the starter and removes public/CNAME. Continue? (y/N) ");
  prompt.close();
  if (answer.trim().toLowerCase() !== "y") {
    console.log("Cancelled.");
    process.exit(0);
  }
}

copyFileSync(starter, resume);
if (existsSync(cname)) {
  rmSync(cname);
}

console.log(`Reset src/content/resume/resume.yaml to the starter.

Next steps:
  1. Fill in src/content/resume/resume.yaml.
  2. Replace public/favicon.ico, public/apple-touch-icon.png and public/og-image.png.
  3. Optional: add your domain to public/CNAME.
  4. Preview with \`pnpm dev\` and \`pnpm resume:pdf\`.`);
