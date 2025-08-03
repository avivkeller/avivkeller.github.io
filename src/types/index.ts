import type { ImageMetadata } from "astro";

export interface SocialLink {
  href: string;
  icon: string;
  label: string;
  rel?: string;
}

export interface Project {
  title: string;
  description: string;
  image?: ImageMetadata;
  technologies?: string[];
  githubLink: string;
  website?: string;
}

export interface Achievement {
  title: string;
  icon?: string;
  url: string;
}

export interface BlogPost {
  url: string;
  frontmatter: {
    title: string;
    description: string;
    pubDate: string;
    readingTime: string;
  };
}

export interface NavigationItem {
  href: string;
  title: string;
  target?: string;
}

export interface SharePlatform {
  icon: string;
  url: string;
  label: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
  technologies?: string[];
  website?: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "volunteer";
}
