const user = "jp-gerona";

export const siteConfig = {
  site: "https://resume.jp-gerona.me",
  lang: "en",
  ogLocale: "en_PH",
  user,
  website: "https://jp-gerona.me",
  pdfFilename: "Julian-Peter-Gerona-Resume.pdf",
  socials: [
    {
      label: "GitHub",
      href: `https://github.com/${user}`,
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jp-gerona/",
      icon: "linkedin",
    },
  ],
} as const;
