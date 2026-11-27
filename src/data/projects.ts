import { getCollection } from "astro:content";

import { NEW_FOR_DAYS } from "../loaders/projects";
import type { Affiliation, Project, ProjectItem } from "../types";
import { affiliations } from "./affiliations";

const packageFacts = new Map(
  (await getCollection("maintainedPackages")).map(({ id, data }) => [id, data]),
);
const repoFacts = new Map(
  (await getCollection("affiliationRepos")).map(({ id, data }) => [id, data]),
);

// Relative to the build, not to when the data was fetched.
const newSince = Date.now() - NEW_FOR_DAYS * 864e5;

const packageItem = (name: string): ProjectItem => {
  const pkg = packageFacts.get(name);
  return {
    name,
    description: pkg?.description,
    link: `https://www.npmjs.com/package/${name}`,
    downloads: pkg?.downloads ?? 0,
    isNew: !!pkg?.created && Date.parse(pkg.created) >= newSince,
  };
};

const byDownloads = (a: ProjectItem, b: ProjectItem) =>
  (b.downloads ?? 0) - (a.downloads ?? 0) || a.name.localeCompare(b.name);
const sum = (items: ProjectItem[]) =>
  items.reduce((total, item) => total + (item.downloads ?? 0), 0);

const packageNames = { one: "package", other: "packages" };
const relatedNames = { one: "related project", other: "related projects" };

// Repositories with a card of their own, whose packages an organization's card leaves out.
const ownCardRepos = new Set(
  affiliations
    .filter((a) => !a.organization)
    .map((a) => a.repository.toLowerCase()),
);

/** Whether a package (by its repository) belongs on an affiliation's card. */
const groupedBy = (affiliation: Affiliation, repository?: string) => {
  const main = affiliation.repository.toLowerCase();
  if (!affiliation.organization || !repository) return repository === main;
  return (
    repository.split("/")[0] === main.split("/")[0] &&
    (repository === main || !ownCardRepos.has(repository))
  );
};

/** One card per affiliation, grouping its repositories and my packages there. */
const affiliationCards = affiliations.map((affiliation): Project => {
  const mainRepo = affiliation.repository.toLowerCase();
  const main = repoFacts.get(mainRepo);

  const repositories = (affiliation.repositories ?? [])
    .map((fullName) => repoFacts.get(fullName.toLowerCase()))
    .filter((repo) => !!repo)
    .map((repo): ProjectItem => ({
      name: repo.title,
      description: repo.description,
      link: repo.githubLink!,
      stars: repo.stars,
    }))
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
  const packages = [...packageFacts]
    .filter(([, pkg]) => groupedBy(affiliation, pkg.repository))
    .map(([name]) => packageItem(name))
    .sort(byDownloads);
  // An organization's card lists what's related to its main repository, so
  // not the main repository's own packages (they still count toward totals).
  const listed = affiliation.organization
    ? packages.filter(
        (pkg) => packageFacts.get(pkg.name)?.repository !== mainRepo,
      )
    : packages;
  const items = [...repositories, ...listed];

  return {
    itemNames: affiliation.organization ? relatedNames : packageNames,
    title: affiliation.title,
    description: affiliation.description ?? main?.description ?? "",
    role: affiliation.role,
    technologies: affiliation.technologies,
    githubLink:
      main?.githubLink ?? `https://github.com/${affiliation.repository}`,
    website: main?.website,
    stars: main?.stars,
    downloads: sum(packages),
    items: items.length ? items : undefined,
    isNew: packages.some((pkg) => pkg.isNew),
  };
});

/** One card per repository of mine, grouping a monorepo's packages. */
const ownCards = (await getCollection("projects")).map(({ data }): Project => {
  const packages = data.packages.map(packageItem).sort(byDownloads);
  const [main] = packages;
  const grouped = packages.length > 1;

  return {
    title: data.title,
    // A monorepo is described by its repository, a single package by itself.
    description:
      (grouped
        ? data.description || main.description
        : main.description || data.description) ?? "",
    technologies: data.language ? [data.language] : undefined,
    githubLink: data.githubLink,
    npmLink: grouped ? undefined : main.link,
    items: grouped ? packages : undefined,
    itemNames: packageNames,
    website: data.website,
    stars: data.stars,
    downloads: sum(packages),
    isNew: packages.some((pkg) => pkg.isNew),
  };
});

ownCards.sort(
  (a, b) =>
    Number(!!b.isNew) - Number(!!a.isNew) ||
    (b.downloads ?? 0) - (a.downloads ?? 0),
);

export const projects: Project[] = [...affiliationCards, ...ownCards];

/**
 * Everything I maintain: every npm package, plus each affiliated
 * repository that isn't already counted through one of its packages.
 */
const packageRepos = new Set(
  [...packageFacts.values()].map((pkg) => pkg.repository),
);
export const maintainedCount =
  packageFacts.size +
  affiliations
    .flatMap((a) => [a.repository, ...(a.repositories ?? [])])
    .filter((fullName) => !packageRepos.has(fullName.toLowerCase())).length;
