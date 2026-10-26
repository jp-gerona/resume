# resume

A one-page resume that builds into a static web page and an ATS-friendly PDF from a single YAML file.

Live: [resume.jp-gerona.me](https://resume.jp-gerona.me)

- **One source.** Everything lives in `src/content/resume/resume.yaml`, validated by a schema.
- **Real PDF.** [Typst](https://typst.app) renders selectable, parseable text. No headless browser.
- **Static page.** [Astro](https://astro.build) outputs plain HTML and CSS with zero client JavaScript.
- **Private details stay private.** Phone numbers and similar go into a git-ignored file that only a local PDF build reads.

Inspired by [antfu/resume](https://github.com/antfu/resume).

## Start your own

You need Node.js 22+, pnpm and Typst 0.15.

```sh
pnpm create astro --template jp-gerona/resume my-resume
cd my-resume
pnpm resume:init   # swap my resume for a blank starter
pnpm dev           # web page at http://localhost:4321
pnpm resume:pdf    # writes public/resume.pdf
```

You can also click **Use this template** on GitHub, or fork the repository and run `pnpm resume:init`.

Typst can come from `brew install typst`, `cargo install typst-cli` or the [releases page](https://github.com/typst/typst/releases). The build looks for `.tools/typst/typst` first, then `TYPST_BIN`, then `typst` on your `PATH`.

## Edit

| File | What it controls |
| --- | --- |
| `src/content/resume/resume.yaml` | All content, plus the sidebar handle, socials and PDF filename under `site:` |
| `src/pages/index.astro` | Web page layout and styles |
| `templates/resume.typ` | PDF layout |
| `public/favicon.ico`, `public/apple-touch-icon.png`, `public/og-image.png` | Icons and social preview image, replace with your own |

`projects` and `affiliations` are optional. The PDF build fails if the content no longer fits on one page.

If you add a section, add it to both `index.astro` and `resume.typ`. `pnpm build && pnpm check:drift` reports any YAML value missing from either output, and CI runs the same check.

## Private details

Everything in this repository and in `public/` is published. Keep details you only send to recruiters out of both:

```sh
cp resume.private.example.yaml resume.private.yaml   # git-ignored
pnpm resume:private                                    # writes out/resume-private.pdf
```

Contact entries in `resume.private.yaml` are appended to the PDF's contact line. The web page and the deployed PDF never read the file. Once something is committed, it stays in git history even after you delete it.

## Deploy to GitHub Pages

1. In the repository settings, set **Pages > Source** to **GitHub Actions**.
2. Push to `main`. The workflow builds the page and PDF, runs the drift check and deploys.

Without a custom domain the site goes to `https://<user>.github.io/<repo>/`. For a custom domain:

1. Put the domain in `public/CNAME`, for example `resume.example.com`.
2. Add a DNS `CNAME` record pointing to `<user>.github.io`.
3. Verify the domain under your GitHub account's **Settings > Pages** to prevent takeover, then enable **Enforce HTTPS**.

## License

Code under [MIT](LICENSE). The resume content in `src/content/resume/resume.yaml` is mine; replace it with your own. Fonts are under the SIL Open Font License and icons come from [Remix Icon](https://remixicon.com) (Apache-2.0).
