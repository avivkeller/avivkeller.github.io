import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

const base = "https://aviv.sh";
const fallbacks = ["ui-sans-serif", "system-ui", "sans-serif"];

// https://astro.build/config
export default defineConfig({
  site: base,
  integrations: [icon(), sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // The writings page used to be the blog.
  redirects: { "/blog": "/writings" },

  // Self-hosted type. Bricolage for display, IBM Plex Sans for everything else.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Bricolage Grotesque",
      cssVariable: "--font-bricolage",
      // Only the weights headings use. As a variable font, Fontsource serves
      // every axis (weight, optical size, width), about three times the size.
      weights: [700, 800],
      styles: ["normal"],
      fallbacks,
    },
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Sans",
      cssVariable: "--font-plex",
      weights: [400, 500, 600],
      styles: ["normal"],
      fallbacks,
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
