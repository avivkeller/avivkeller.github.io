import type { Affiliation } from "../types";

/**
 * Projects I work on that live outside my own accounts, one card each. The
 * text is mine; stars, links, and the packages and repositories each card
 * lists come from GitHub and npm.
 */
export const affiliations: Affiliation[] = [
  {
    repository: "nodejs/node",
    title: "Node.js",
    description:
      "The Node.js JavaScript runtime. I work across the project, with a focus on documentation tooling and the release and build process.",
    role: "Collaborator",
    technologies: ["JavaScript", "C++"],
    organization: true,
    repositories: ["nodejs/nodejs.org", "nodejs/learn"],
  },
  {
    repository: "webpack/webpack",
    title: "webpack",
    description:
      "The webpack module bundler. I contribute to core and serve on the technical steering committee.",
    role: "TSC member",
    technologies: ["JavaScript"],
    organization: true,
    repositories: ["webpack/webpack-doc-kit"],
  },
  {
    repository: "nodejs/doc-kit",
    title: "doc-kit",
    role: "Maintainer",
    technologies: ["JavaScript", "Node.js"],
  },
];
