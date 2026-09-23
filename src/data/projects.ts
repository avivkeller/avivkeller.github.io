import goraLogo from "../assets/images/gora-logo.png";
import keyframedLogo from "../assets/images/keyframed-logo.png";
import termviewLogo from "../assets/images/termview-logo.png";
import type { Project } from "../types";

export const projects: Project[] = [
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
    technologies: ["JavaScript", "Handlebars"],
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
  {
    title: "git-deps",
    description:
      "A CLI for installing dependencies straight from Git repositories, with support for branches, tags, commits, and subdirectories.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/git-deps",
  },
  {
    title: "next-pr",
    description:
      "Predicts the next pull request number for a GitHub repository, so a changelog entry can reference the PR that ships it.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/next-pr",
  },
  {
    title: "organization-auditor",
    description:
      "A GitHub Action that audits an organization for inactive members and files a tracking issue. It reports and never removes anyone.",
    technologies: ["JavaScript", "GitHub Actions"],
    githubLink: "https://github.com/avivkeller/organization-auditor",
  },
  {
    title: "Caribou",
    description:
      "JavaScript ANTLR parsers and lexers, compiled from the grammars-v4 collection.",
    technologies: ["JavaScript", "ANTLR"],
    githubLink: "https://github.com/avivkeller/caribou",
  },
  {
    title: "stylelint-apply-multiline",
    description:
      "A Stylelint plugin that enforces and autofixes multiline formatting for Tailwind CSS @apply rules.",
    technologies: ["JavaScript", "Stylelint"],
    githubLink: "https://github.com/avivkeller/stylelint-apply-multiline",
  },
  {
    title: "nth-arg",
    description:
      "A helper that applies a function to the nth argument of a callback, with negative indices like Array.prototype.at.",
    technologies: ["JavaScript"],
    githubLink: "https://github.com/avivkeller/nth-arg",
  },
  {
    title: "Apache Gora Website",
    description: "The official website dedicated to the Apache Gora Project.",
    image: goraLogo,
    technologies: ["Bootstrap", "HTML"],
    githubLink: "https://github.com/apache/gora-site",
    website: "https://gora.apache.org",
  },
  {
    title: "mdast-util-slice-markdown",
    description:
      "A powerful, highly configurable TypeScript library for slicing markdown Abstract Syntax Trees (AST) by character position.",
    githubLink: "https://github.com/avivkeller/mdast-util-slice-markdown",
  },
  {
    title: "unicode-case-folding",
    description:
      "Unicode case folding utilities based on the official Unicode Character Database",
    githubLink: "https://github.com/avivkeller/unicode-case-folding",
  },
  {
    title: "remark-table-cell-titles",
    description:
      "A remark plugin that adds data-title attributes to table cells in Markdown tables.",
    githubLink: "https://github.com/avivkeller/remark-table-cell-titles",
  },
  {
    title: "Videos in CSS",
    description: "A script that converts videos into pure CSS keyframes",
    githubLink: "https://github.com/avivkeller/keyframed-videos",
    image: keyframedLogo,
  },
  {
    title: "rollup-plugin-tidy-templates",
    description:
      "A Rollup plugin that removes specific tagged template expressions",
    githubLink: "https://github.com/avivkeller/rollup-plugin-tidy-templates",
  },
  {
    title: "Artificial Intelligence Restriction License",
    description:
      "A license that allows creators to share open-source software while restricting its use in AI development and training without explicit consent.",
    githubLink: "https://github.com/avivkeller/AIR",
  },
  {
    title: "Terminal Tools",
    description: "A diverse assortment of utilities designed for the terminal.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/terminaltools",
    website: "https://tt.js.org",
  },
  {
    title: "BitPackedBuffer",
    description:
      "A high-performance JavaScript library for bit-level data manipulation with zero dependencies.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/bitpackedbuffer",
  },
  {
    title: "TinyBF",
    description: "The smallest Brainfuck compiler available!",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/tinybf",
  },
  {
    title: "termview",
    description:
      "A package that enables rendering of images, videos, and GIFs directly in the terminal.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/termview",
    image: termviewLogo,
  },
  {
    title: "Termestry",
    description: "A tapestry of terminal outputs.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/termestry",
    website: "https://termestry.js.org",
  },
  {
    title: "ProtoTools",
    description:
      "ProtoTools offers various utilities to streamline the coding process.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/ProtoTools",
  },
  {
    title: "bingmaps",
    description: "A Node.js wrapper for interacting with the Bing Maps API.",
    technologies: ["JavaScript", "Node.js"],
    githubLink: "https://github.com/avivkeller/bingmaps",
  },
  {
    title: "not-so-human-benchmark",
    description:
      "An unconventional approach to completing the Human Benchmark tests.",
    technologies: ["JavaScript", "Node.js", "Bing Maps"],
    githubLink: "https://github.com/avivkeller/not-so-human-benchmark",
  },
  {
    title: "pip-parse",
    description:
      "A JavaScript library designed to parse Python package requirements effectively.",
    technologies: ["JavaScript", "Node.js", "Python"],
    githubLink: "https://github.com/avivkeller/pip-parse",
  },
  {
    title: "split-with-continuation",
    description:
      "A utility for splitting lines using a custom newline separator along with a continuation character.",
    technologies: ["JavaScript"],
    githubLink: "https://github.com/avivkeller/split-with-continuation",
  },
  {
    title: "is-lower",
    description:
      "A JavaScript library that checks if a string is entirely in lowercase.",
    technologies: ["JavaScript"],
    githubLink: "https://github.com/avivkeller/is-lower",
  },
  {
    title: "uniform-locale",
    description:
      "An ESLint plugin that enforces consistency in locale spelling across your project.",
    technologies: ["JavaScript", "ESLint"],
    githubLink: "https://github.com/avivkeller/uniform-locale",
  },
  {
    title: "frozen-fruit",
    description: "Provides frozen primordials for JavaScript projects.",
    technologies: ["JavaScript"],
    githubLink: "https://github.com/avivkeller/frozen-fruit",
  },
  {
    title: "clang-tidy",
    description:
      "A Node.js wrapper for the clang-tidy tool, simplifying its use in Node.js applications.",
    technologies: ["JavaScript", "LLVM"],
    githubLink: "https://github.com/avivkeller/clang-tidy",
  },
];
