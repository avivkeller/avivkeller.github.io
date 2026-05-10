import type { WorkExperience } from "../types";

export const workExperience: WorkExperience[] = [
  {
    company: "OpenJS Foundation",
    positions: [
      {
        title: "Webpack TSC",
        duration: "2026 - Present",
      },
      {
        title: "Webpack Core",
        duration: "2025 - Present",
      },
      {
        title: "Node.js Collaborator",
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
