import type { Loader } from "astro/loaders";

const NPM_USER = "avivkeller";
const GITHUB_OWNERS = new Set(["avivkeller", "redyetidev"]);
const NEW_FOR_DAYS = 30;
const CACHE_HOURS = 24;

interface Repo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  created_at: string;
  archived: boolean;
}

async function getJSON<T>(url: string, headers?: HeadersInit) {
  const response = await fetch(url, { headers });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return (await response.json()) as T;
}

const repos = new Map<string, Promise<Repo | undefined>>();
const getRepo = (fullName: string) => {
  if (!repos.has(fullName)) {
    repos.set(
      fullName,
      getJSON<Repo>(`https://api.github.com/repos/${fullName}`, {
        "User-Agent": "aviv.sh",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      }),
    );
  }
  return repos.get(fullName)!;
};

export const projects = (): Loader => ({
  name: "projects",
  async load({ store, meta, logger, parseData }) {
    const fetchedAt = Number(meta.get("fetchedAt") ?? 0);
    if (store.keys().length && Date.now() - fetchedAt < CACHE_HOURS * 36e5) {
      return;
    }

    const { objects } = (await getJSON<{
      objects: {
        package: {
          name: string;
          description?: string;
          links?: { repository?: string };
        };
        downloads?: { monthly?: number };
      }[];
    }>(
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${NPM_USER}&size=250`,
    ))!;

    const packages = await Promise.all(
      objects.map(async ({ package: pkg, downloads }) => {
        const [, owner, name] =
          pkg.links?.repository?.match(
            /github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/,
          ) ?? [];
        if (owner && !GITHUB_OWNERS.has(owner.toLowerCase())) return;
        const repo = await getRepo(
          owner ? `${owner}/${name}` : `${NPM_USER}/${pkg.name}`,
        );
        if (repo?.archived || (owner && !repo)) return;
        return { pkg, repo, downloads: downloads?.monthly ?? 0 };
      }),
    );

    const newSince = Date.now() - NEW_FOR_DAYS * 864e5;
    const entries = new Map<
      string,
      Record<string, unknown> & { downloads: number }
    >();
    for (const { pkg, repo, downloads } of packages.filter((p) => !!p)) {
      const id = repo?.full_name.toLowerCase() ?? pkg.name;
      const existing = entries.get(id);
      if (existing) {
        existing.downloads += downloads;
        continue;
      }
      entries.set(id, {
        title: repo?.name ?? pkg.name,
        description: pkg.description || repo?.description || "",
        technologies: repo?.language ? [repo.language] : undefined,
        githubLink: repo?.html_url,
        npmLink: `https://www.npmjs.com/package/${pkg.name}`,
        website: repo?.homepage || undefined,
        stars: repo?.stargazers_count,
        downloads,
        isNew: !!repo && Date.parse(repo.created_at) >= newSince,
      });
    }

    store.clear();
    for (const [id, data] of entries) {
      store.set({ id, data: await parseData({ id, data }) });
    }
    meta.set("fetchedAt", String(Date.now()));
    logger.info(`Loaded ${entries.size} projects`);
  },
});
