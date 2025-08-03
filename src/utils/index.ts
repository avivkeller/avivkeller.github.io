import type { SharePlatform } from "../types";

export function createShareUrls(
  url: string,
  title: string,
  description: string,
): SharePlatform[] {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  return [
    {
      icon: "simple-icons:x",
      url: `https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Share on X",
    },
    {
      icon: "simple-icons:linkedin",
      url: `https://www.linkedin.com/shareArticle?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Share on LinkedIn",
    },
    {
      icon: "simple-icons:facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
    },
    {
      icon: "simple-icons:reddit",
      url: `https://www.reddit.com/submit?u=${encodedUrl}&t=${encodedTitle}`,
      label: "Share on Reddit",
    },
    {
      icon: "simple-icons:gmail",
      url: `mailto:?subject=${encodedTitle}&text=${encodedDesc}%0A${encodedUrl}`,
      label: "Share via Email",
    },
  ];
}
