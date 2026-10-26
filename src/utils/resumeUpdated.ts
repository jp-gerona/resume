import { execSync } from "node:child_process";
import { statSync } from "node:fs";

const RESUME_PATHS = ["src/content/resume/resume.yaml", "templates/resume.typ"];

/**
 * Last time the resume content or PDF template changed.
 *
 * Build-time only (Node). Uses the git commit date of the sources, which is
 * stable across CI checkouts. Falls back to filesystem mtime for local dev or
 * when git history is unavailable.
 *
 * NOTE: the deploy workflow must checkout with `fetch-depth: 0`, otherwise the
 * shallow clone has no commit history for the file and git log returns empty.
 */
export function getResumeUpdatedDate(): Date {
  try {
    const iso = execSync(
      `git log -1 --format=%cI -- ${RESUME_PATHS.join(" ")}`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();

    if (iso) {
      return new Date(iso);
    }
  }
  catch {
    /* git unavailable or not a repo — fall through */
  }

  return new Date(Math.max(...RESUME_PATHS.map(p => statSync(p).mtime.getTime())));
}
