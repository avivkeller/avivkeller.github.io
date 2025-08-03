import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

const base = "https://aviv.sh";

// https://astro.build/config
export default defineConfig({
  site: base,
  integrations: [icon(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
