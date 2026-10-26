import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { iconNames } from "@/icons";

const projectSchema = z.object({
  name: z.string(),
  year: z.string(),
  highlights: z.array(z.string()).min(1),
});

const experienceSchema = z.object({
  organization: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string(),
  highlights: z.array(z.string()).min(1),
});

const educationSchema = z.object({
  credential: z.string(),
  institution: z.string(),
  location: z.string(),
  period: z.string(),
  details: z.array(z.string()).min(1),
});

const skillGroupSchema = z.object({
  category: z.string(),
  text: z.string(),
});

const affiliationSchema = z.object({
  organization: z.string(),
  period: z.string(),
  highlights: z.array(z.string()).min(1),
});

const siteSchema = z.object({
  handle: z.string(),
  website: z.url().optional(),
  lang: z.string().default("en"),
  locale: z.string().optional(),
  pdfFilename: z.string().default("resume.pdf"),
  socials: z.array(z.object({
    label: z.string(),
    href: z.url(),
    icon: z.enum(iconNames),
  })).default([]),
});

export const resumeSchema = z.object({
  site: siteSchema,
  title: z.string(),
  description: z.string().optional(),
  name: z.string(),
  role: z.string(),
  contact: z.array(z.object({
    text: z.string(),
    href: z.url().optional(),
  })).min(1),
  education: z.array(educationSchema).min(1),
  experience: z.array(experienceSchema).min(1),
  projects: z.array(projectSchema).min(1),
  affiliations: z.array(affiliationSchema).min(1),
  skills: z.array(skillGroupSchema).min(1),
});

const resume = defineCollection({
  loader: glob({ base: "./src/content/resume", pattern: "resume.yaml" }),
  schema: resumeSchema,
});

export const collections = { resume };
