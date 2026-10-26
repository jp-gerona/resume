import { fontNames, pdfFontNames } from "./fonts.ts";

export const defaultSections = [
  { id: "education", title: "Education" },
  { id: "experience", title: "Work Experience" },
  { id: "projects", title: "Projects" },
  { id: "affiliations", title: "Affiliations" },
  { id: "skills", title: "Skills" },
];
const paperSizes = ["us-letter", "a4"];

type Section = string | { id: string, title?: string };

export interface ResumeConfig {
  /** Custom domain, e.g. "resume.example.com". Sets the canonical and og: URLs. Also set it under Settings > Pages on GitHub. */
  domain?: string;
  /** Page language, default "en". */
  lang?: string;
  /** Optional og:locale, e.g. "en_US". */
  locale?: string;
  /** Name the browser saves the PDF as, default "resume.pdf". */
  pdfFilename?: string;
  /** PDF paper size, default "us-letter". The web page is not affected. */
  paper?: "us-letter" | "a4";
  /** Sections to show, in order. Ids: education, experience, projects, affiliations, skills. Leave one out to hide it, or use { id, title } to rename it. Default: all five. */
  sections?: Section[];
  /** Page limit for the PDF: the build fails when it overflows. "auto" never fails. Default 1. */
  pages?: number | "auto";
  /** Left column of the web page. When disabled, the download link and update time move below the resume. */
  sidebar?: {
    /** Default true. */
    enabled?: boolean;
    /** Large name at the top of the sidebar. Required when enabled. */
    handle?: string;
    /** Optional, links the handle and adds a globe icon. */
    website?: string;
    /** Icons: github, gitlab, linkedin, x, bluesky, mastodon, youtube, instagram, dribbble, mail. */
    socials?: { label: string, href: string, icon: string }[];
  };
  /** Names from scripts/fonts.ts. */
  fonts?: {
    /** Resume text on the page and in the PDF. Needs PDF files. */
    resume?: string;
    /** Sidebar handle. */
    handle?: string;
    /** Everything else on the page. */
    ui?: string;
  };
}

/** Validates the config and fills in defaults. */
export function defineConfig(config: ResumeConfig) {
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
    throw new Error("resume.config.ts: sidebar.handle is required while sidebar.enabled is true.");
  }
  if (!paperSizes.includes(resolved.paper)) {
    throw new Error(`resume.config.ts: paper must be one of ${paperSizes.join(", ")}, got ${JSON.stringify(resolved.paper)}.`);
  }
  if (resolved.pages !== "auto" && !(Number.isInteger(resolved.pages) && resolved.pages > 0)) {
    throw new Error(`resume.config.ts: pages must be a positive integer or "auto", got ${JSON.stringify(resolved.pages)}.`);
  }
  for (const [role, name] of Object.entries(resolved.fonts)) {
    const allowed = role === "resume" ? pdfFontNames : fontNames;
    if (!allowed.includes(name)) {
      throw new Error(`resume.config.ts: fonts.${role} "${name}" is not available. Choose one of: ${allowed.join(", ")}.`);
    }
  }
  return resolved;
}

function normalizeSections(sections: Section[] = defaultSections) {
  const seen = new Set<string>();
  return sections.map((section) => {
    const { id, title } = typeof section === "string" ? { id: section, title: undefined } : section;
    const known = defaultSections.find(item => item.id === id);
    if (!known) {
      throw new Error(`resume.config.ts: unknown section "${id}". Choose from: ${defaultSections.map(item => item.id).join(", ")}.`);
    }
    if (seen.has(id)) {
      throw new Error(`resume.config.ts: section "${id}" is listed twice.`);
    }
    seen.add(id);
    return { id, title: title ?? known.title };
  });
}
