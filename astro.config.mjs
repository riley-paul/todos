import { defineConfig, envField } from "astro/config";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [react()],
  vite: {
    build: { minify: false },
    plugins: [
      tanstackRouter({
        target: "react",
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        devOptions: { enabled: true },
        includeAssets: ["/favicon.svg", "/icons/apple-touch-icon.png"],
        manifest: {
          name: "Todos",
          short_name: "Todos",
          description: "A simple todo list app",
          background_color: "#061419",
          theme_color: "#061419",
          display: "standalone",
        },
      }),
      tailwindcss(),
    ],
  },
  output: "server",
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  security: { checkOrigin: true },
});
