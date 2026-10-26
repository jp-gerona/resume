#let resume = yaml("../src/content/resume/resume.yaml")
// Set by scripts/build-resume.ts from resume.config.ts.
#let font = sys.inputs.at("font", default: "EB Garamond")
#let pages = sys.inputs.at("pages", default: "1")
#let sections = json(bytes(sys.inputs.at("sections")))
// Set by `npm run resume:private`: extra contact entries kept out of git and the site.
#let private = if "private" in sys.inputs { yaml(sys.inputs.private) } else { (:) }
#let contact = resume.contact + private.at("contact", default: ())
// Exposes the parsed data to `typst query` for scripts/check-drift.ts.
#metadata(resume) <resume-data>

#set document(title: resume.title, author: resume.name)
#set page(
  paper: sys.inputs.at("paper", default: "us-letter"),
  margin: (top: 32pt, bottom: 28pt, left: 44pt, right: 42pt),
)
#set text(
  font: font,
  size: 10.08pt,
  lang: sys.inputs.at("lang", default: "en"),
  ligatures: false,
  top-edge: 0.8em,
  bottom-edge: -0.32em,
)
#set par(leading: 0pt, spacing: 0pt)
#set block(above: 0pt, below: 0pt)
#set list(marker: [•], indent: 0pt, body-indent: 14pt, spacing: 0pt)
#show heading: set block(sticky: true)
#show heading.where(level: 1): it => block(width: 100%, below: 2pt)[
  #align(center, text(size: 16.08pt, weight: "bold", upper(it.body)))
]
#show heading.where(level: 2): it => block(
  above: 7pt,
  below: 2pt,
  width: 100%,
  stroke: (bottom: 0.6pt),
  inset: (bottom: 1pt),
)[#text(size: 11.04pt, weight: "bold", upper(it.body))]

#let inline(value) = {
  for (index, part) in value.split("*").enumerate() {
    if calc.odd(index) { emph(part) } else { part }
  }
}
#let row(start, end, bold: false) = {
  grid(
    columns: (1fr, auto),
    column-gutter: 10pt,
    if bold { strong(start) } else { start },
    align(right, if bold { strong(end) } else { end }),
  )
}
#let bullets(highlights) = list(..highlights.map(inline))

#heading(level: 1, resume.name)
#align(center, text(size: 9.4pt)[
  #for (index, item) in contact.enumerate() {
    if index > 0 [ | ]
    if "href" in item { link(item.href, item.text) } else { item.text }
  }
])

#let entries(items, render) = for (index, item) in items.enumerate() {
  block(above: if index > 0 { 5.5pt } else { 0pt }, render(item))
}
#let renderers = (
  education: (title, items) => {
    heading(level: 2, title)
    entries(items, item => [
      #row(item.institution, item.location, bold: true)
      #row(item.credential, item.period)
      #pad(left: 14pt)[
        #for detail in item.details { block(inline(detail)) }
      ]
    ])
  },
  experience: (title, items) => {
    heading(level: 2, title)
    entries(items, item => [
      #row(item.organization, item.location, bold: true)
      #row(item.role, item.period)
      #bullets(item.highlights)
    ])
  },
  projects: (title, items) => {
    heading(level: 2, title)
    entries(items, item => [
      #row(item.name, item.year, bold: true)
      #bullets(item.highlights)
    ])
  },
  affiliations: (title, items) => {
    heading(level: 2, title)
    entries(items, item => [
      #row(item.organization, item.period, bold: true)
      #bullets(item.highlights)
    ])
  },
  skills: (title, items) => {
    heading(level: 2, title)
    for skill in items {
      block(inset: (left: 14pt))[
        #h(-14pt)#strong(skill.category + ":") #skill.text
      ]
    }
  },
)

#for section in sections {
  let items = resume.at(section.id, default: ())
  if items.len() > 0 { (renderers.at(section.id))(section.title, items) }
}

#if pages != "auto" {
  context assert(
    counter(page).final().first() <= int(pages),
    message: "Resume must fit on " + pages + " page(s) (`pages` in resume.config.ts). Shorten resume.yaml instead of shrinking the font.",
  )
}
