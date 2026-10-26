// @ts-check
// This file is copied to resume.config.mjs by `npm run resume:init`, so the import path is relative to the repo root.
import { defineConfig } from "./scripts/config.mjs";

// Settings for the web page and PDF build. The content lives in src/content/resume/resume.yaml.
export default defineConfig({
  // Custom domain or subdomain: uncomment it, and also set it under Settings > Pages on GitHub.
  // Default <user>.github.io/<repo> URL: leave it commented out.
  // domain: "resume.example.com",
  lang: "en",
  locale: "en_US", // optional, used for og:locale
  pdfFilename: "Your-Name-Resume.pdf", // filename of the "Download PDF" link
  pages: 1, // PDF page limit, the build fails on overflow. Use "auto" for no limit.
  paper: "us-letter", // or "a4"
  // Sections to show, in order. Leave one out to hide it, or use { id, title } to rename it.
  sections: ["education", "experience", "projects", "affiliations", "skills"],
  fonts: {
    resume: "EB Garamond", // page text and PDF
    handle: "Crimson Pro", // large handle in the sidebar
    ui: "Plus Jakarta Sans", // everything else
  },
  sidebar: {
    enabled: true, // false: single column, the download link moves below the resume
    handle: "your-handle",
    website: "https://example.com", // optional, adds a globe icon
    // icons: github, gitlab, linkedin, x, bluesky, mastodon, youtube, instagram, dribbble, mail
    socials: [
      { label: "GitHub", href: "https://github.com/your-handle", icon: "github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle/", icon: "linkedin" },
    ],
  },
});
