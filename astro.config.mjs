import { defineConfig, envField } from "astro/config";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [react()],
  vite: {
    plugins: [
      tanstackRouter({
        target: "react",
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
      tailwindcss(),
    ],
  },
  output: "server",
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  security: { checkOrigin: true },
});
