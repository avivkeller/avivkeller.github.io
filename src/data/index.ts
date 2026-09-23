import type { SocialLink, NavigationItem } from "../types";

export const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/avivkeller",
    icon: "simple-icons:github",
    label: "GitHub",
  },
  {
    href: "https://x.com/aviv_keller",
    icon: "simple-icons:x",
    label: "X (Twitter)",
  },
  {
    href: "https://bsky.app/profile/aviv.sh",
    icon: "simple-icons:bluesky",
    label: "Bluesky",
  },
  {
    href: "https://www.linkedin.com/in/avivkeller",
    icon: "simple-icons:linkedin",
    label: "LinkedIn",
  },
  {
    href: "https://hackerone.com/aviv_keller",
    icon: "simple-icons:hackerone",
    label: "HackerOne",
  },
  {
    href: "https://github.com/sponsors/avivkeller",
    icon: "simple-icons:githubsponsors",
    label: "GitHub Sponsors",
  },
  { href: "mailto:me@aviv.sh", icon: "mdi:email", label: "Email" },
];

export const navigation: NavigationItem[] = [
  { href: "/projects", title: "Projects" },
  { href: "/experience", title: "Experience" },
  { href: "/blog", title: "Blog" },
  { href: "/achievements", title: "Achievements" },
  {
    href: "https://github.com/sponsors/avivkeller",
    title: "Sponsor",
    target: "_blank",
  },
];

export const siteConfig = {
  name: "Aviv Keller",
  description:
    "Aviv Keller is a Node.js collaborator, webpack TSC member, and security researcher.",
  twitter: "@aviv_keller",
  email: "me@aviv.sh",
};

export { projects } from "./projects";
export { achievements } from "./achievements";
export { workExperience } from "./experience";
export { speaking } from "./speaking";
export { externalPosts } from "./posts";
