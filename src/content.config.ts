import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const sponsors = defineCollection({
  loader: file("./content/sponsor-data/index.toml"),
  schema: ({ image }) => z.object({
    tier: z.enum(["bronze", "silver", "gold", "platinum"]),
    site: z.url(),
    icon: image(),
  }),
})

const past_events = defineCollection({
  loader: glob({ base: "./content/past-events", pattern: "**/[^_]*.md" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image(),
  }),
})

const projects = defineCollection({
  loader: glob({ base: "./content/projects", pattern: "**/[^_]*.md", retainBody: true }),
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = {
  sponsors,
  past_events,
  projects,
};
