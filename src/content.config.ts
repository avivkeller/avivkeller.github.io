import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { affiliations } from "./data/affiliations";
import {
  githubRepos,
  maintainedPackages as maintainedPackagesLoader,
  projects as projectsLoader,
} from "./loaders/projects";
import {
  nodejsBlog,
  nodejsLearn,
  writings as writingsLoader,
} from "./loaders/writings";

const repository = {
  title: z.string(),
  description: z.string().optional(),
  githubLink: z.url().optional(),
  website: z.url().optional(),
  language: z.string().optional(),
  stars: z.number().optional(),
};

const affiliatedRepositories = affiliations.flatMap((a) => [
  a.repository,
  ...(a.repositories ?? []),
]);

/** My own repositories that publish packages. */
const projects = defineCollection({
  loader: projectsLoader(),
  schema: z.object({
    ...repository,
    /** Names of the npm packages published from the repository. */
    packages: z.array(z.string()).min(1),
  }),
});

/** Every npm package I maintain, keyed by name. */
const maintainedPackages = defineCollection({
  loader: maintainedPackagesLoader(affiliatedRepositories),
  schema: z.object({
    /** "owner/name" of the package's GitHub repository, lowercased. */
    repository: z.string().optional(),
    description: z.string().optional(),
    /** npm downloads over the last month. */
    downloads: z.number(),
    /** First publish, looked up only for packages published recently. */
    created: z.iso.datetime().optional(),
  }),
});

/** The affiliations' repositories, keyed by lowercased "owner/name". */
const affiliationRepos = defineCollection({
  loader: githubRepos(affiliatedRepositories),
  schema: z.object(repository),
});

/** Posts written here, as Markdown in src/content/posts, served at /posts/<file name>/. */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** YYYY-MM-DD. YAML reads an unquoted date as a Date, so this normalizes it back. */
    date: z.coerce.date().transform((date) => date.toISOString().slice(0, 10)),
  }),
});

/** Writings published elsewhere, from each source they're collected from. */
const writings = defineCollection({
  loader: writingsLoader([
    nodejsBlog({ author: "Aviv Keller" }),
    nodejsLearn({ username: "avivkeller" }),
  ]),
  schema: z.object({
    kind: z.enum(["post", "article"]),
    title: z.string(),
    url: z.url(),
    source: z.string(),
    date: z.iso.date().optional(),
    description: z.string().optional(),
    section: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});

export const collections = {
  projects,
  maintainedPackages,
  affiliationRepos,
  posts,
  writings,
};
