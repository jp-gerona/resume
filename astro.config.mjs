// @ts-check
import process from "node:process";
import { defineConfig } from "astro/config";

import config from "./resume.config.ts";
import { buildResume } from "./scripts/build-resume.ts";

// A custom domain wins. Otherwise, inside GitHub Actions, fall back to the default
// Pages URL: https://<owner>.github.io/<repo>/.
const cname = config.domain ?? "";
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserSite = repo === `${owner}.github.io`;

// https://astro.build/config
export default defineConfig({
  site: cname ? `https://${cname}` : owner ? `https://${owner}.github.io` : undefined,
  base: !cname && repo && !isUserSite ? `/${repo}` : undefined,
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
