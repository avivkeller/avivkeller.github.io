import { getCollection } from "astro:content";

import type { Article, BlogPost } from "../types";

const WORDS_PER_MINUTE = 230;
const words = new Intl.Segmenter("en", { granularity: "word" });

/** e.g. "4 min read", from the post's Markdown. */
const readingTime = (markdown = "") => {
  const count = [...words.segment(markdown)].filter((s) => s.isWordLike).length;
  return `${Math.max(1, Math.round(count / WORDS_PER_MINUTE))} min read`;
};

/** Posts written here, in src/content/posts. */
const localPosts = (await getCollection("posts")).map(
  ({ id, data, body }): BlogPost => ({
    ...data,
    url: `/posts/${id}/`,
    readingTime: readingTime(body),
  }),
);

/** Writings published elsewhere, from the sources in content.config.ts. */
const elsewhere = (await getCollection("writings")).map(({ data }) => data);

/** Blog posts, here and elsewhere, newest first. */
export const blogPosts: BlogPost[] = [
  ...localPosts,
  ...elsewhere
    .filter((writing) => writing.kind === "post")
    .map(({ title, url, source, date, description }) => ({
      title,
      url,
      source,
      date: date!,
      description,
    })),
].toSorted((a, b) => b.date.localeCompare(a.date));

/** Articles, in the order their sites list them. */
export const articles: Article[] = elsewhere
  .filter((writing) => writing.kind === "article")
  .toSorted(
    (a, b) =>
      a.source.localeCompare(b.source) || (a.order ?? 0) - (b.order ?? 0),
  )
  .map(({ title, url, source, description, section }) => ({
    title,
    url,
    source,
    description,
    section: section ?? [],
  }));

export const writingCount = blogPosts.length + articles.length;
