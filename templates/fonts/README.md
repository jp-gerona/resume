# PDF fonts

EB Garamond (SIL Open Font License, see `OFL.txt`), used by `templates/resume.typ`.
Source: https://github.com/google/fonts/tree/main/ofl/ebgaramond

The web page uses the matching WOFF2 subsets in `src/fonts/`.
To add a PDF font, drop its TTF/OTF files here, add the matching WOFF2 subsets to `src/fonts/`, and register it in `scripts/fonts.ts` with `pdf: true`. Then set `fonts.resume` in `resume.config.ts`.
