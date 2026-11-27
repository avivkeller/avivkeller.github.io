import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import pMap from "p-map";
import { parse as parseYaml } from "yaml";

import { cachedLoader, rawFile, repoFiles } from "./shared";

/** Something I wrote that's published elsewhere. */
export type Writing = {
  kind: "post" | "article";
  title: string;
  url: string;
  /** Where it's published, e.g. "Node.js Blog". */
  source: string;
  /** YYYY-MM-DD. */
  date?: string;
  /** The writing's first paragraph. */
  description?: string;
  /** For an article, where it sits on its site, e.g. ["Node-API", "Getting Started"]. */
  section?: string[];
  /** For an article, its position in its site's own listing. */
  order?: number;
};

/** A place writings are collected from. */
export interface WritingSource {
  name: string;
  load(): Promise<Omit<Writing, "source">[]>;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/**
 * A Markdown file's frontmatter, downloading only the start of the file
 * unless the frontmatter runs longer.
 */
async function frontmatter(repository: string, path: string) {
  const start = (await rawFile(repository, path, 2048)) ?? "";
  const block =
    start.match(FRONTMATTER)?.[1] ??
    (start.startsWith("---")
      ? (await rawFile(repository, path))?.match(FRONTMATTER)?.[1]
      : undefined);
  return (block ? parseYaml(block) : {}) as Record<string, unknown>;
}

/** The plain text of a Markdown file's first paragraph. */
async function firstParagraph(repository: string, path: string) {
  const markdown = (await rawFile(repository, path))?.replace(FRONTMATTER, "");
  const paragraph = fromMarkdown(markdown ?? "").children.find(
    (node) => node.type === "paragraph",
  );
  return paragraph && toString(paragraph);
}

/** Reads many files' frontmatter without opening too many requests at once. */
const frontmatters = (repository: string, paths: string[]) =>
  pMap(
    paths,
    async (path) => ({ path, data: await frontmatter(repository, path) }),
    { concurrency: 24 },
  );

/** Posts on the Node.js blog whose `author` names `author`. */
export const nodejsBlog = ({ author }: { author: string }): WritingSource => ({
  name: "Node.js Blog",
  async load() {
    const repository = "nodejs/nodejs.org";
    const dir = "apps/site/pages/en/blog/";
    const posts = await frontmatters(
      repository,
      await repoFiles(repository, [`${dir}**/*.md`]),
    );

    return pMap(
      posts.filter(({ data }) => String(data.author ?? "").includes(author)),
      async ({ path, data }) => ({
        kind: "post" as const,
        title: String(data.title),
        url: `https://nodejs.org/en/blog/${path.slice(dir.length, -".md".length)}`,
        date: String(data.date).slice(0, 10),
        description: await firstParagraph(repository, path),
      }),
    );
  },
});

interface SidebarItem {
  link?: string;
  label?: string;
  groupName?: string;
  items?: SidebarItem[];
}

/**
 * Node.js Learn articles whose `authors` include `username`. Its sidebar
 * decides what counts as an article, and gives their titles and sections.
 */
export const nodejsLearn = ({
  username,
}: {
  username: string;
}): WritingSource => ({
  name: "Node.js Learn",
  async load() {
    const repository = "nodejs/learn";
    const site = JSON.parse((await rawFile(repository, "site.json")) ?? "{}");

    const sidebar = new Map<string, { title: string; section: string[] }>();
    const walk = (items: SidebarItem[], section: string[]) => {
      for (const item of items) {
        if (item.link) sidebar.set(item.link, { title: item.label!, section });
        if (item.items) {
          walk(item.items, [...section, (item.groupName ?? item.label)!]);
        }
      }
    };
    walk(site.sidebar ?? [], []);
    const order = [...sidebar.keys()];

    const pages = await frontmatters(
      repository,
      await repoFiles(repository, ["pages/**/*.md"]),
    );
    const mine = pages
      .map(({ path, data }) => ({
        path,
        link: `/learn/${path.slice("pages/".length).replace(/(\/?index)?\.md$/, "")}`,
        authors: [data.authors ?? []]
          .flat()
          .join(",")
          .split(",")
          .map((name) => name.trim().toLowerCase()),
      }))
      .filter(
        ({ link, authors }) =>
          sidebar.has(link) && authors.includes(username.toLowerCase()),
      );

    return pMap(mine, async ({ path, link }) => ({
      kind: "article" as const,
      ...sidebar.get(link)!,
      url: `https://nodejs.org${link}`,
      order: order.indexOf(link),
      description: await firstParagraph(repository, path),
    }));
  },
});

/** Writings collected from `sources`, keyed by URL. */
export const writings = (sources: WritingSource[]) =>
  cachedLoader(
    "writings",
    async () => {
      const loaded = await Promise.all(
        sources.map(async (source) =>
          (await source.load()).map((writing): Writing => ({
            ...writing,
            source: source.name,
          })),
        ),
      );
      return new Map(loaded.flat().map((writing) => [writing.url, writing]));
    },
    sources.map((source) => source.name).join(),
  );
