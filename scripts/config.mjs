import { fontNames, pdfFontNames } from "./fonts.mjs";

export const defaultSections = [
  { id: "education", title: "Education" },
  { id: "experience", title: "Work Experience" },
  { id: "projects", title: "Projects" },
  { id: "affiliations", title: "Affiliations" },
  { id: "skills", title: "Skills" },
];
const paperSizes = ["us-letter", "a4"];

/**
 * @typedef {object} ResumeConfig
 * @property {string} [domain] Custom domain, e.g. "resume.example.com". Sets the canonical and og: URLs. Also set it under Settings > Pages on GitHub.
 * @property {string} [lang] Page language, default "en".
 * @property {string} [locale] Optional og:locale, e.g. "en_US".
 * @property {string} [pdfFilename] Name the browser saves the PDF as, default "resume.pdf".
 * @property {"us-letter" | "a4"} [paper] PDF paper size, default "us-letter". The web page is not affected.
 * @property {(string | { id: string, title?: string })[]} [sections] Sections to show, in order. Ids: education, experience, projects, affiliations, skills. Leave one out to hide it, or use { id, title } to rename it. Default: all five.
 * @property {number | "auto"} [pages] Page limit for the PDF: the build fails when it overflows. "auto" never fails. Default 1.
 * @property {object} [sidebar] Left column of the web page. When disabled, the download link and update time move below the resume.
 * @property {boolean} [sidebar.enabled] Default true.
 * @property {string} [sidebar.handle] Large name at the top of the sidebar. Required when enabled.
 * @property {string} [sidebar.website] Optional, links the handle and adds a globe icon.
 * @property {{ label: string, href: string, icon: string }[]} [sidebar.socials] Icons: github, gitlab, linkedin, x, bluesky, mastodon, youtube, instagram, dribbble, mail.
 * @property {object} [fonts] Names from scripts/fonts.mjs.
 * @property {string} [fonts.resume] Resume text on the page and in the PDF. Needs PDF files.
 * @property {string} [fonts.handle] Sidebar handle.
 * @property {string} [fonts.ui] Everything else on the page.
 */

/**
 * Validates the config and fills in defaults.
 * @param {ResumeConfig} config
 */
export function defineConfig(config) {
  const sidebar = { enabled: true, socials: [], ...config.sidebar };
  const resolved = {
    lang: "en",
    pdfFilename: "resume.pdf",
    pages: 1,
    paper: "us-letter",
    ...config,
    sections: normalizeSections(config.sections),
    sidebar,
    fonts: { resume: "EB Garamond", handle: "Crimson Pro", ui: "Plus Jakarta Sans", ...config.fonts },
  };

  if (sidebar.enabled && !sidebar.handle) {
    throw new Error("resume.config.mjs: sidebar.handle is required while sidebar.enabled is true.");
  }
  if (!paperSizes.includes(resolved.paper)) {
    throw new Error(`resume.config.mjs: paper must be one of ${paperSizes.join(", ")}, got ${JSON.stringify(resolved.paper)}.`);
  }
  if (resolved.pages !== "auto" && !(Number.isInteger(resolved.pages) && resolved.pages > 0)) {
    throw new Error(`resume.config.mjs: pages must be a positive integer or "auto", got ${JSON.stringify(resolved.pages)}.`);
  }
  for (const [role, name] of Object.entries(resolved.fonts)) {
    const allowed = role === "resume" ? pdfFontNames : fontNames;
    if (!allowed.includes(name)) {
      throw new Error(`resume.config.mjs: fonts.${role} "${name}" is not available. Choose one of: ${allowed.join(", ")}.`);
    }
  }
  return resolved;
}

function normalizeSections(sections = defaultSections) {
  const seen = new Set();
  return sections.map((section) => {
    const { id, title } = typeof section === "string" ? { id: section } : section;
    const known = defaultSections.find(item => item.id === id);
    if (!known) {
      throw new Error(`resume.config.mjs: unknown section "${id}". Choose from: ${defaultSections.map(item => item.id).join(", ")}.`);
    }
    if (seen.has(id)) {
      throw new Error(`resume.config.mjs: section "${id}" is listed twice.`);
    }
    seen.add(id);
    return { id, title: title ?? known.title };
  });
}
