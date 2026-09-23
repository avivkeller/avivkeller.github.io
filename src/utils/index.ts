import { externalPosts } from "../data/posts";
import type {
  Achievement,
  BlogPost,
  MarkdownPost,
  SpeakingEngagement,
} from "../types";

export const isCve = (achievement: Achievement) =>
  /^CVE-\d{4}-\d+$/.test(achievement.title);

/** Formats a YYYY-MM string as "October 2025". */
export function formatMonth(date: string) {
  const [year, month] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** True when the engagement's month has not yet ended relative to the build date. */
export function isUpcoming(engagement: SpeakingEngagement) {
  const [year, month] = engagement.date.split("-").map(Number);
  const now = new Date();
  const current = now.getUTCFullYear() * 12 + now.getUTCMonth();
  return year * 12 + (month - 1) >= current;
}

export const byDateDesc = (a: SpeakingEngagement, b: SpeakingEngagement) =>
  b.date.localeCompare(a.date);

/** Formats an ISO date as "August 14, 2026". */
export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Local markdown posts and external posts, newest first. */
export function getAllPosts(): BlogPost[] {
  const local = Object.values(
    import.meta.glob<MarkdownPost>("../pages/posts/*.md", { eager: true }),
  ).map((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.pubDate,
    url: post.url,
    readingTime: post.frontmatter.readingTime,
  }));

  return [...local, ...externalPosts].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}
