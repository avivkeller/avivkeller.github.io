import type { RestEndpointMethodTypes } from "@octokit/rest";
import hostedGitInfo from "hosted-git-info";
import { parse as parseYaml } from "yaml";

import {
  cachedLoader,
  getJSON,
  github,
  rawFile,
  repoFiles,
  splitRepo,
} from "./shared";

const NPM_USER = "avivkeller";
/** GitHub accounts whose repositories count as mine. */
const GITHUB_OWNERS = ["avivkeller", "redyetidev"];
/** How long a package counts as new after it's first published. */
export const NEW_FOR_DAYS = 30;

/** Resolves to undefined instead of throwing when GitHub responds with a 404. */
const unlessMissing = <T>(request: Promise<{ data: T }>) =>
  request.then(
    ({ data }) => data,
    (error: { status?: number }) => {
      if (error.status === 404) return undefined;
      throw error;
    },
  );

type Repo = Pick<
  RestEndpointMethodTypes["repos"]["get"]["response"]["data"],
  | "name"
  | "full_name"
  | "html_url"
  | "description"
  | "homepage"
  | "language"
  | "stargazers_count"
  | "archived"
>;

interface SearchResult {
  package: {
    name: string;
    description?: string;
    /** When the latest version was published. */
    date: string;
    links?: { repository?: string };
  };
  downloads?: { monthly?: number };
}

/** "owner/name" of a GitHub repository, lowercased, from any form npm accepts. */
export const githubRepoOf = (url?: string) => {
  const info = url ? hostedGitInfo.fromUrl(url) : undefined;
  return info?.type === "github"
    ? `${info.user}/${info.project}`.toLowerCase()
    : undefined;
};

/** Every repository the owners have, in a request per 100 rather than one per package. */
const listRepos = async (): Promise<Repo[]> =>
  (
    await Promise.all(
      GITHUB_OWNERS.map((username) =>
        github.paginate(github.rest.repos.listForUser, {
          username,
          type: "owner",
          per_page: 100,
        }),
      ),
    )
  )
    .flat()
    .map((repo) => ({
      ...repo,
      description: repo.description ?? null,
      homepage: repo.homepage ?? null,
      language: repo.language ?? null,
      stargazers_count: repo.stargazers_count ?? 0,
      archived: repo.archived ?? false,
    }));

/** Every npm package NPM_USER maintains. */
async function fetchSearch() {
  const results: SearchResult[] = [];
  for (;;) {
    const page = await getJSON<{ objects: SearchResult[]; total: number }>(
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${NPM_USER}&size=250&from=${results.length}`,
    );
    results.push(...(page?.objects ?? []));
    if (!page?.objects.length || results.length >= page.total) return results;
  }
}

/** Shares one search between both loaders, without going stale in a long dev session. */
let search: { at: number; results: Promise<SearchResult[]> } | undefined;
const searchPackages = () => {
  if (!search || Date.now() - search.at > 60_000) {
    search = { at: Date.now(), results: fetchSearch() };
  }
  return search.results;
};

/** When a package was first published. The search API only has the latest publish. */
const getCreated = async (name: string) =>
  (
    await getJSON<{ time?: { created?: string } }>(
      `https://registry.npmjs.org/${name.replace("/", "%2f")}`,
    )
  )?.time?.created;

/** What gets stored about a repository. */
const repoFacts = (repo: Repo) => ({
  title: repo.name,
  description: repo.description || undefined,
  githubLink: repo.html_url,
  website: repo.homepage || undefined,
  language: repo.language || undefined,
  stars: repo.stargazers_count,
});

interface Manifest {
  name?: string;
  private?: boolean;
  workspaces?: string[] | { packages?: string[] };
}

/**
 * The packages a repository declares: its root package.json and, for a
 * monorepo, each npm, Yarn, or pnpm workspace's. Private ones are left out.
 */
async function declaredPackages(fullName: string) {
  const readManifest = async (path: string) => {
    const text = await rawFile(fullName, path);
    return text ? (JSON.parse(text) as Manifest) : undefined;
  };

  const root = await readManifest("package.json");
  const globs: string[] = Array.isArray(root?.workspaces)
    ? root.workspaces
    : (root?.workspaces?.packages ??
      parseYaml((await rawFile(fullName, "pnpm-workspace.yaml")) ?? "")
        ?.packages ??
      []);

  const paths = globs.length
    ? await repoFiles(
        fullName,
        globs.map((glob) => `${glob.replace(/\/$/, "")}/package.json`),
      )
    : [];

  const manifests = [root, ...(await Promise.all(paths.map(readManifest)))];
  return manifests
    .filter((manifest) => manifest?.name && !manifest.private)
    .map((manifest) => manifest!.name!);
}

/** npm's facts about one package, found by exact name. */
const searchPackage = async (name: string) =>
  (
    await getJSON<{ objects: SearchResult[] }>(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(name)}&size=5`,
    )
  )?.objects.find((result) => result.package.name === name);

/** What gets stored about a package. */
const packageFacts = async (
  { package: pkg, downloads }: SearchResult,
  newSince: number,
) => ({
  repository: githubRepoOf(pkg.links?.repository),
  description: pkg.description,
  downloads: downloads?.monthly ?? 0,
  // A package can't be newer than its latest publish, so skip the lookup when that's old.
  created:
    Date.parse(pkg.date) >= newSince ? await getCreated(pkg.name) : undefined,
});

/**
 * Every package I maintain: the ones npm lists NPM_USER as a maintainer of,
 * plus the ones published from `repositories`, which may be published by an
 * organization's account instead. The one place package facts are stored.
 */
export const maintainedPackages = (repositories: string[]) =>
  cachedLoader(
    "maintained-packages",
    async () => {
      const newSince = Date.now() - NEW_FOR_DAYS * 864e5;
      const results = await searchPackages();
      const known = new Set(results.map(({ package: pkg }) => pkg.name));

      const declared = await Promise.all(
        repositories.map(async (fullName) => {
          const names = await declaredPackages(fullName);
          const found = await Promise.all(
            names.filter((name) => !known.has(name)).map(searchPackage),
          );
          // Only ones actually published from this repository.
          return found.filter(
            (result): result is SearchResult =>
              !!result &&
              githubRepoOf(result.package.links?.repository) ===
                fullName.toLowerCase(),
          );
        }),
      );

      const entries = await Promise.all(
        [...results, ...declared.flat()].map(
          async (result) =>
            [
              result.package.name,
              await packageFacts(result, newSince),
            ] as const,
        ),
      );
      return new Map(entries);
    },
    repositories.join(),
  );

/**
 * My own repositories that publish packages, with the names of those
 * packages, so that a monorepo's packages share an entry.
 */
export const projects = () =>
  cachedLoader("projects", async () => {
    const [results, repos] = await Promise.all([searchPackages(), listRepos()]);
    const byFullName = new Map(
      repos.map((r) => [r.full_name.toLowerCase(), r]),
    );
    // Repositories moved between the owners keep their name, so fall back to
    // it, preferring the first owner's.
    const byName = new Map<string, Repo>();
    for (const repo of repos) {
      const key = repo.name.toLowerCase();
      if (!byName.has(key)) byName.set(key, repo);
    }
    // Anything else linked was renamed, so ask GitHub, which follows renames.
    const renamed = new Map<string, Promise<Repo | undefined>>();
    const lookUp = (fullName: string) => {
      if (!renamed.has(fullName)) {
        renamed.set(
          fullName,
          unlessMissing(github.rest.repos.get(splitRepo(fullName))),
        );
      }
      return renamed.get(fullName)!;
    };

    const resolved = await Promise.all(
      results.map(async ({ package: pkg }) => {
        const linked = githubRepoOf(pkg.links?.repository);
        const [owner, name = pkg.name.toLowerCase()] = linked?.split("/") ?? [];
        if (owner && !GITHUB_OWNERS.includes(owner)) return;

        const repo =
          byFullName.get(linked ?? "") ??
          byName.get(name) ??
          (linked ? await lookUp(linked) : undefined);
        if ((linked && !repo) || repo?.archived) return;
        return { repo, name: pkg.name };
      }),
    );

    const entries = new Map<
      string,
      Record<string, unknown> & { packages: string[] }
    >();
    for (const { repo, name } of resolved.filter((r) => !!r)) {
      const id = repo?.full_name.toLowerCase() ?? name;
      const entry = entries.get(id);
      if (entry) entry.packages.push(name);
      else {
        entries.set(id, {
          ...(repo ? repoFacts(repo) : { title: name }),
          packages: [name],
        });
      }
    }
    return entries;
  });

/** Facts about specific repositories, keyed by lowercased "owner/name". */
export const githubRepos = (fullNames: string[]) =>
  cachedLoader(
    "github-repos",
    async () => {
      const repos = await Promise.all(
        fullNames.map(async (fullName) => {
          const { data } = await github.rest.repos.get(splitRepo(fullName));
          return [fullName.toLowerCase(), repoFacts(data)] as const;
        }),
      );
      return new Map(repos);
    },
    fullNames.join(),
  );
