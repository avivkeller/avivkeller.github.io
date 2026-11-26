import { getCollection } from "astro:content";

import type { Project } from "../types";

const affiliations: Project[] = [
  {
    title: "Node.js",
    description:
      "The Node.js JavaScript runtime. I work across the project, with a focus on documentation tooling and the release and build process.",
    role: "Collaborator",
    technologies: ["JavaScript", "C++"],
    githubLink: "https://github.com/nodejs/node",
    website: "https://nodejs.org",
  },
  {
    title: "webpack",
    description:
      "The webpack module bundler. I contribute to core and serve on the technical steering committee.",
    role: "TSC member",
    technologies: ["JavaScript"],
    githubLink: "https://github.com/webpack/webpack",
    website: "https://webpack.js.org",
  },
  {
    title: "nodejs.org",
    description:
      "The Node.js website, including the download pages, release tables, and the Learn section.",
    role: "Maintainer",
    technologies: ["TypeScript", "Next.js", "MDX"],
    githubLink: "https://github.com/nodejs/nodejs.org",
    website: "https://nodejs.org",
  },
  {
    title: "doc-kit",
    description:
      "Node.js's tooling for generating the API documentation from the markdown sources in the core repository.",
    role: "Maintainer",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/nodejs/doc-kit",
    website: "https://doc-kit.nodejs.org",
  },
  {
    title: "webpack-doc-kit",
    description:
      "Documentation tooling for webpack, built on the same approach as Node.js's doc-kit.",
    role: "Maintainer",
    technologies: ["JavaScript", "TypeDoc"],
    githubLink: "https://github.com/webpack/webpack-doc-kit",
    website: "https://webpack-doc-kit.vercel.app",
  },
  {
    title: "Node.js Learn",
    description: "The Node.js learning guides published at nodejs.org/learn.",
    role: "Maintainer",
    technologies: ["JavaScript", "Markdown"],
    githubLink: "https://github.com/nodejs/learn",
    website: "https://nodejs.org/learn/",
  },
];

const mine = (await getCollection("projects")).map(({ data }) => data);

mine.sort(
  (a, b) =>
    Number(!!b.isNew) - Number(!!a.isNew) ||
    (b.downloads ?? 0) - (a.downloads ?? 0),
);

export const projects: Project[] = [...affiliations, ...mine];
