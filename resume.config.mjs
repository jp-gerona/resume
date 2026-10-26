// @ts-check
import { defineConfig } from "./scripts/config.mjs";

// Settings for the web page and PDF build. The content lives in src/content/resume/resume.yaml.
export default defineConfig({
  // Custom domain or subdomain: set it, and also under Settings > Pages on GitHub.
  // Default github.io/<repo> URL: delete this line.
  domain: "resume.jp-gerona.me",
  lang: "en",
  locale: "en_PH",
  pdfFilename: "Julian-Peter-Gerona-Resume.pdf",
  pages: 1,
  paper: "us-letter", // or "a4"
  // Sections to show, in order. Leave one out to hide it, or use { id, title } to rename it.
  sections: ["education", "experience", "projects", "affiliations", "skills"],
  fonts: {
    resume: "EB Garamond",
    handle: "Crimson Pro",
    ui: "Plus Jakarta Sans",
  },
  sidebar: {
    enabled: true,
    handle: "jp-gerona",
    website: "https://jp-gerona.me",
    socials: [
      { label: "GitHub", href: "https://github.com/jp-gerona", icon: "github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jp-gerona/", icon: "linkedin" },
    ],
  },
});
