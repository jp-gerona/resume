#let resume = yaml("../src/content/resume/resume.yaml")
// Set by `pnpm resume:private`: extra contact entries kept out of git and the site.
#let private = if "private" in sys.inputs { yaml(sys.inputs.private) } else { (:) }
#let contact = resume.contact + private.at("contact", default: ())

#set document(title: resume.title, author: resume.name)
#set page(
  paper: "us-letter",
  margin: (top: 32pt, bottom: 28pt, left: 44pt, right: 42pt),
)
#set text(
  font: "EB Garamond",
  size: 10.08pt,
  lang: "en",
  ligatures: false,
  top-edge: 0.8em,
  bottom-edge: -0.32em,
)
#set par(leading: 0pt, spacing: 0pt)
#set block(above: 0pt, below: 0pt)
#set list(marker: [•], indent: 0pt, body-indent: 14pt, spacing: 0pt)
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

#heading(level: 2, "Education")
#for (index, item) in resume.education.enumerate() {
  block(above: if index > 0 { 5.5pt } else { 0pt })[
    #row(item.institution, item.location, bold: true)
    #row(item.credential, item.period)
    #pad(left: 14pt)[
      #for detail in item.details { block(inline(detail)) }
    ]
  ]
}

#heading(level: 2, "Work Experience")
#for (index, item) in resume.experience.enumerate() {
  block(above: if index > 0 { 5.5pt } else { 0pt })[
    #row(item.organization, item.location, bold: true)
    #row(item.role, item.period)
    #bullets(item.highlights)
  ]
}

#let projects = resume.at("projects", default: ())
#if projects.len() > 0 {
  heading(level: 2, "Projects")
  for (index, item) in projects.enumerate() {
    block(above: if index > 0 { 5.5pt } else { 0pt })[
      #row(item.name, item.year, bold: true)
      #bullets(item.highlights)
    ]
  }
}

#let affiliations = resume.at("affiliations", default: ())
#if affiliations.len() > 0 {
  heading(level: 2, "Affiliations")
  for (index, item) in affiliations.enumerate() {
    block(above: if index > 0 { 5.5pt } else { 0pt })[
      #row(item.organization, item.period, bold: true)
      #bullets(item.highlights)
    ]
  }
}

#heading(level: 2, "Skills")
#for skill in resume.skills {
  block(inset: (left: 14pt))[
    #h(-14pt)#strong(skill.category + ":") #skill.text
  ]
}

#context assert(
  counter(page).final().first() == 1,
  message: "Resume must fit on one page. Shorten resume.yaml instead of shrinking the font.",
)
