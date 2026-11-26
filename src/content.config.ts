import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { projects as projectsLoader } from "./loaders/projects";

const projects = defineCollection({
  loader: projectsLoader(),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()).optional(),
    githubLink: z.url().optional(),
    npmLink: z.url().optional(),
    website: z.url().optional(),
    stars: z.number().optional(),
    downloads: z.number().optional(),
    isNew: z.boolean().optional(),
  }),
});

export const collections = { projects };
