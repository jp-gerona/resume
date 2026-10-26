const latin = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const latinExt = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF";

interface Font {
  stack: "serif" | "sans";
  weight: string;
  files: { normal: string, italic?: string };
  pdf: boolean;
}

/**
 * Fonts that ship with the repo (SIL Open Font License), so neither the build nor the
 * page needs Google Fonts at runtime. Web files are src/fonts/<file>-latin(-ext).woff2.
 * A font with `pdf: true` also has TTFs in templates/fonts and can be the `resume` font.
 */
export const fonts: Record<string, Font> = {
  "EB Garamond": { stack: "serif", weight: "400 700", files: { normal: "eb-garamond", italic: "eb-garamond-italic" }, pdf: true },
  "Crimson Pro": { stack: "serif", weight: "400", files: { normal: "crimson-pro" }, pdf: false },
  "Plus Jakarta Sans": { stack: "sans", weight: "400", files: { normal: "plus-jakarta-sans" }, pdf: false },
};

export const fontNames = Object.keys(fonts);
export const pdfFontNames = fontNames.filter(name => fonts[name].pdf);

const fallbacks: Record<Font["stack"], string> = {
  serif: "ui-serif, Georgia, serif",
  sans: "ui-sans-serif, system-ui, sans-serif",
};

export function fontStack(name: string) {
  return `"${name}", ${fallbacks[fonts[name].stack]}`;
}

/**
 * @param names fonts to include
 * @param urls built URL of each file, keyed by "<file>-<subset>"
 */
export function fontFaceCss(names: string[], urls: Record<string, string>) {
  const faces = [];
  for (const name of new Set(names)) {
    const { weight, files } = fonts[name];
    for (const [style, file] of Object.entries(files)) {
      for (const [subset, range] of [["latin", latin], ["latin-ext", latinExt]]) {
        faces.push(`@font-face{font-family:"${name}";font-style:${style};font-weight:${weight};font-display:swap;src:url("${urls[`${file}-${subset}`]}") format("woff2");unicode-range:${range}}`);
      }
    }
  }
  return faces.join("\n");
}
