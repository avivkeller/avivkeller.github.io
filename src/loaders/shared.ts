import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "@octokit/rest";
import type { Loader } from "astro/loaders";
import picomatch from "picomatch";

const CACHE_HOURS = 24;

export const github = new (Octokit.plugin(retry, throttling))({
  auth: process.env.GITHUB_TOKEN,
  userAgent: "aviv.sh",
  throttle: {
    // Wait out a short rate limit a couple of times, but don't hang a build for an hour.
    onRateLimit: (retryAfter, _options, _octokit, retryCount) =>
      retryAfter <= 60 && retryCount < 2,
    onSecondaryRateLimit: (retryAfter, _options, _octokit, retryCount) =>
      retryAfter <= 60 && retryCount < 2,
  },
});

export const splitRepo = (fullName: string) => {
  const [owner, repo] = fullName.split("/");
  return { owner, repo };
};

/** Fetches text, retrying failures. Resolves to undefined on a 404. */
export async function getText(
  url: string,
  headers?: HeadersInit,
  attempts = 3,
): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    return await response.text();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getText(url, headers, attempts - 1);
  }
}

export const getJSON = async <T>(url: string) => {
  const text = await getText(url);
  return text === undefined ? undefined : (JSON.parse(text) as T);
};

/**
 * A file from a repository's default branch, or only its first `bytes`.
 * Doesn't count against GitHub's API limit.
 */
export const rawFile = (fullName: string, path: string, bytes?: number) =>
  getText(
    `https://raw.githubusercontent.com/${fullName}/HEAD/${path}`,
    bytes ? { Range: `bytes=0-${bytes - 1}` } : undefined,
  );

/**
 * The paths of a repository's files matching globs, from one API request.
 * A glob starting with `!` excludes what it matches.
 */
export async function repoFiles(fullName: string, globs: string[]) {
  const included = picomatch(globs.filter((glob) => !glob.startsWith("!")));
  const excluded = picomatch(
    globs.filter((glob) => glob.startsWith("!")).map((glob) => glob.slice(1)),
  );
  const isMatch = (path: string) => included(path) && !excluded(path);
  const { data } = await github.rest.git.getTree({
    ...splitRepo(fullName),
    tree_sha: "HEAD",
    recursive: "true",
  });
  return data.tree
    .filter(({ type, path }) => type === "blob" && path && isMatch(path))
    .map(({ path }) => path!);
}

/**
 * A loader that refetches at most every CACHE_HOURS, or when `version`
 * changes, and keeps serving its cached entries if a refetch fails (e.g.
 * offline), unless it has none.
 */
export const cachedLoader = (
  name: string,
  fetchEntries: () => Promise<Map<string, Record<string, unknown>>>,
  version = "",
): Loader => ({
  name,
  async load({ store, meta, logger, parseData }) {
    const fetchedAt = Number(meta.get("fetchedAt") ?? 0);
    const cached = store.keys().length > 0;
    const fresh =
      Date.now() - fetchedAt < CACHE_HOURS * 36e5 &&
      meta.get("version") === version;
    if (cached && fresh) return;

    let entries;
    try {
      entries = await fetchEntries();
    } catch (error) {
      if (!cached) throw error;
      logger.warn(`Refetch failed, keeping cached entries: ${error}`);
      return;
    }

    store.clear();
    for (const [id, data] of entries) {
      store.set({ id, data: await parseData({ id, data }) });
    }
    meta.set("fetchedAt", String(Date.now()));
    meta.set("version", version);
    logger.info(`Loaded ${entries.size} entries`);
  },
});
