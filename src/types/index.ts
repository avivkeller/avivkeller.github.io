export interface SocialLink {
  href: string;
  icon: string;
  label: string;
}

export interface Project {
  title: string;
  description: string;
  /** Shown when the project belongs to an organization, e.g. "Collaborator". */
  role?: string;
  technologies?: string[];
  githubLink?: string;
  npmLink?: string;
  website?: string;
  stars?: number;
  /** npm downloads over the last month. */
  downloads?: number;
  isNew?: boolean;
}

export interface Achievement {
  title: string;
  icon?: string;
  url: string;
}

export interface ExternalPost {
  title: string;
  description: string;
  date: string;
  url: string;
  source: string;
}

export interface MarkdownPost {
  url: string;
  frontmatter: {
    title: string;
    description: string;
    pubDate: string;
    readingTime?: string;
  };
}

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  url: string;
  source?: string;
  readingTime?: string;
}

export interface NavigationItem {
  href: string;
  title: string;
  target?: string;
}

export interface Position {
  title: string;
  duration: string;
}

export interface WorkExperience {
  company: string;
  website: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "volunteer";
  positions: Position[];
  technologies?: string[];
}

export interface SpeakingEngagement {
  event: string;
  date: string;
  role: "speaker" | "attendee";
  talk?: string;
  location?: string;
  url?: string;
}
