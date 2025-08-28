import type { WorkExperience } from "../types";

export const workExperience: WorkExperience[] = [
  {
    company: "OpenJS Foundation",
    positions: [
      {
        title: "Webpack Security",
        duration: "2025 - Present",
      },
      {
        title: "Node.js non-Core Collaborator",
        duration: "2023 - Present",
      },
    ],
    type: "volunteer",
    technologies: ["JavaScript", "C++", "Node.js", "V8", "Security"],
    website: "https://openjsf.org",
  },
  {
    company: "CoW DAO",
    positions: [
      {
        title: "Security Auditor",
        duration: "2025",
      },
    ],
    type: "contract",
    technologies: ["CI/CD", "Smart Contracts", "AWS"],
    website: "https://cow.fi",
  },
];
