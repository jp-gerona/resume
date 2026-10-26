// @ts-check
import { defineConfig } from "astro/config";

import { buildResume } from "./scripts/build-resume.mjs";
import { siteConfig } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  compressHTML: true,
  integrations: [
    {
      name: "resume-pdf",
      hooks: {
        "astro:build:start": () => buildResume(),
      },
    },
  ],
});
