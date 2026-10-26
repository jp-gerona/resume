// @ts-check
import { defineConfig } from "astro/config";

import { buildResume } from "./scripts/build-resume.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://resume.jp-gerona.me",
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
