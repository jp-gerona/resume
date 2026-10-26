// Resets a fresh copy of this repository to the blank starter resume.
import { copyFileSync } from "node:fs";
import process from "node:process";
import { createInterface } from "node:readline/promises";

const resume = new URL("../src/content/resume/resume.yaml", import.meta.url);
const starter = new URL("../examples/starter.yaml", import.meta.url);
const config = new URL("../resume.config.mjs", import.meta.url);
const starterConfig = new URL("../examples/starter.config.mjs", import.meta.url);

if (!process.argv.includes("--yes")) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question("This replaces src/content/resume/resume.yaml and resume.config.mjs with the starters. Continue? (y/N) ");
  prompt.close();
  if (answer.trim().toLowerCase() !== "y") {
    console.log("Cancelled.");
    process.exit(0);
  }
}

copyFileSync(starter, resume);
copyFileSync(starterConfig, config);

console.log(`Reset src/content/resume/resume.yaml and resume.config.mjs to the starters.

Next steps:
  1. Fill in src/content/resume/resume.yaml and resume.config.mjs.
  2. Replace public/favicon.ico, public/apple-touch-icon.png and public/og-image.png.
  3. Preview with \`npm run dev\` and \`npm run resume:pdf\` (or your package manager's equivalent).`);
