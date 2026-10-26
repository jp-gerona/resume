# resume

A one-page resume that builds into a static web page and an ATS-friendly PDF from a single YAML file.

Live: [resume.jp-gerona.me](https://resume.jp-gerona.me)

- **One source.** Content lives in `src/content/resume/resume.yaml`, validated by a schema. Settings live in `resume.config.mjs`.
- **Real PDF.** [Typst](https://typst.app) renders selectable, parseable text. No headless browser.
- **Static page.** [Astro](https://astro.build) outputs plain HTML and CSS with zero client JavaScript.
- **Private details stay private.** Phone numbers and similar go into a git-ignored file that only a local PDF build reads.

Inspired by [antfu/resume](https://github.com/antfu/resume).

## Start your own

You need Node.js 22+, a package manager (npm, pnpm, yarn or bun) and Typst 0.15. Commands below use npm; swap in your own.

```sh
npm create astro@latest -- --template jp-gerona/resume my-resume
cd my-resume
npm run resume:init   # swap my resume for a blank starter
npm run dev           # web page at http://localhost:4321
npm run resume:pdf    # writes public/resume.pdf
```

| Task    | npm                | pnpm            | yarn            | bun             |
| ------- | ------------------ | --------------- | --------------- | --------------- |
| Create  | `npm create astro@latest -- --template jp-gerona/resume` | `pnpm create astro --template jp-gerona/resume` | `yarn create astro --template jp-gerona/resume` | `bun create astro --template jp-gerona/resume` |
| Install | `npm install`      | `pnpm install`  | `yarn`          | `bun install`   |
| Script  | `npm run <script>` | `pnpm <script>` | `yarn <script>` | `bun run <script>` |

The repository ships only `pnpm-lock.yaml`, so other managers resolve versions fresh. CI uses pnpm.

You can also click **Use this template** on GitHub, or fork the repository and run `npm run resume:init`.

Typst can come from `brew install typst`, `cargo install typst-cli` or the [releases page](https://github.com/typst/typst/releases). The build looks for `.tools/typst/typst` first, then `TYPST_BIN`, then `typst` on your `PATH`.

## Edit

| File | What it controls |
| --- | --- |
| `src/content/resume/resume.yaml` | All content |
| `resume.config.mjs` | Language, PDF filename, page limit, fonts, and the sidebar (on/off, handle, website, socials) |
| `src/pages/index.astro` | Web page layout and styles |
| `templates/resume.typ` | PDF layout |
| `public/favicon.ico`, `public/apple-touch-icon.png`, `public/og-image.png` | Icons and social preview image, replace with your own |

`projects` and `affiliations` are optional. The PDF build fails if the content exceeds `pages` in `resume.config.mjs`, which is `1` by default. Set it to a higher number, or `"auto"` for no limit.

`paper` sets the PDF size (`"us-letter"` or `"a4"`) and does not affect the web page. `sections` lists the sections to show, in order. Leave one out to hide it, or write `{ id: "experience", title: "Employment" }` to rename it.

Set `sidebar.enabled: false` for a single column. The download link and update time then move below the resume.

### Fonts

Fonts are bundled, so the build and the page never call Google Fonts. `fonts.resume` (page text and PDF), `fonts.handle` and `fonts.ui` take a name from `scripts/fonts.mjs`; a wrong name fails the build and lists the options. To add a font, put its web subsets in `src/fonts/` and its TTFs in `templates/fonts/` (see the README there), then add an entry to `scripts/fonts.mjs`.

If you add a section, add it to both `index.astro` and `resume.typ`. `npm run build && npm run check:drift` reports any YAML value missing from either output, and CI runs the same check.

## Private details

Everything in this repository and in `public/` is published. Keep details you only send to recruiters out of both:

```sh
cp resume.private.example.yaml resume.private.yaml   # git-ignored
npm run resume:private                                 # writes out/resume-private.pdf
```

Contact entries in `resume.private.yaml` are appended to the PDF's contact line. The web page and the deployed PDF never read the file. Once something is committed, it stays in git history even after you delete it.

## Deploy to GitHub Pages

1. In the repository settings, set **Pages > Source** to **GitHub Actions**.
2. Push to `main`. The workflow builds the page and PDF, runs the drift check and deploys.

The site goes to `https://<user>.github.io/<repo>/`.

## License

Code under [MIT](LICENSE). The resume content in `src/content/resume/resume.yaml` is mine; replace it with your own. Fonts are under the SIL Open Font License and icons come from [Remix Icon](https://remixicon.com) (Apache-2.0).
