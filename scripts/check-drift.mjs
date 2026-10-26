// Fails when a resume.yaml value is missing from the built page or PDF, which
// catches a section added to one template but not the other. Run after `pnpm build`.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import config from "../resume.config.mjs";
import { compiler, typstInputs } from "./build-resume.mjs";
import { defaultSections } from "./config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
// Page metadata, the sidebar role and link targets are not printed on both outputs.
const skippedKeys = new Set(["title", "description", "role", "href"]);
// Sections left out of resume.config.mjs are hidden on purpose.
for (const { id } of defaultSections) {
  if (!config.sections.some(section => section.id === id)) {
    skippedKeys.add(id);
  }
}

function run(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function pdfText(file) {
  try {
    return run("pdftotext", [file, "-"]);
  }
  catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
    // Ghostscript as a fallback where poppler is not installed.
    return run("gs", ["-q", "-sDEVICE=txtwrite", "-o", "-", file]);
  }
}

function htmlText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Typst prints smart quotes and the templates drop `*` emphasis markers.
function normalize(text) {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, "\"")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function collectStrings(value, key, out) {
  if (skippedKeys.has(key)) {
    return out;
  }
  if (typeof value === "string") {
    out.push(value);
  }
  else if (Array.isArray(value)) {
    value.forEach(item => collectStrings(item, key, out));
  }
  else if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, child]) => collectStrings(child, childKey, out));
  }
  return out;
}

const data = JSON.parse(run(compiler, [
  "query",
  ...typstInputs,
  "--root",
  root,
  "--font-path",
  "templates/fonts",
  "--ignore-system-fonts",
  "templates/resume.typ",
  "<resume-data>",
  "--field",
  "value",
  "--one",
]));

const outputs = {
  "dist/index.html": normalize(htmlText(readFileSync(new URL("../dist/index.html", import.meta.url), "utf8"))),
  "dist/resume.pdf": normalize(pdfText("dist/resume.pdf")),
};

let failures = 0;
for (const value of collectStrings(data, "", [])) {
  for (const [file, text] of Object.entries(outputs)) {
    if (!text.includes(normalize(value))) {
      failures++;
      console.error(`Missing from ${file}: ${value}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} value(s) missing. Update both src/pages/index.astro and templates/resume.typ.`);
  process.exit(1);
}
console.log("Web page and PDF both contain every resume.yaml value.");
