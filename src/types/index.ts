export interface SocialLink {
  href: string;
  icon: string;
  label: string;
}

/** A package or repository listed inside a grouped project card. */
export interface ProjectItem {
  name: string;
  description?: string;
  /** npm for a package, GitHub for a repository. */
  link: string;
  /** npm downloads over the last month. */
  downloads?: number;
  stars?: number;
  /** First published to npm within the last 30 days. */
  isNew?: boolean;
}

/** A project I work on outside my own accounts, shown as one card. */
export interface Affiliation {
  /** "owner/name" of its main repository. */
  repository: string;
  title: string;
  /** My own description; the repository's is used when omitted. */
  description?: string;
  /** e.g. "Collaborator". */
  role: string;
  technologies: string[];
  /**
   * Group the packages I maintain across the repository's whole organization,
   * not only the repository's own, leaving out any another card groups.
   */
  organization?: boolean;
  /** Other repositories I maintain there, as "owner/name". */
  repositories?: string[];
}

export interface Project {
  title: string;
  description: string;
  /** Shown when the project belongs to an organization, e.g. "Collaborator". */
  role?: string;
  technologies?: string[];
  githubLink?: string;
  npmLink?: string;
  /** Set for a monorepo or an organization: what the card groups. */
  items?: ProjectItem[];
  /** What to call the items, by plural category, e.g. { one: "package", other: "packages" }. */
  itemNames?: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
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

/** A blog post written here or elsewhere. */
export interface BlogPost {
  title: string;
  description?: string;
  /** YYYY-MM-DD. */
  date: string;
  url: string;
  /** Where an external post was published, e.g. "Node.js Blog". */
  source?: string;
  readingTime?: string;
}

/** An article on a documentation or learning site. */
export interface Article {
  title: string;
  description?: string;
  url: string;
  /** Where it's published, e.g. "Node.js Learn". */
  source: string;
  /** Where it sits on its site, e.g. ["Node-API", "Getting Started"]. */
  section: string[];
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
  /** YYYY-MM-DD, or YYYY-MM when the day isn't known. */
  date: string;
  role: "speaker" | "attendee";
  talk?: string;
  location?: string;
  url?: string;
}
