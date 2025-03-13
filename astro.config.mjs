import { defineConfig, envField } from "astro/config";

import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { VitePWA } from "vite-plugin-pwa";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  vite: {
    build: { minify: false },
    plugins: [
      TanStackRouterVite({
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
          display: "minimal-ui",
        },
      }),
    ],
  },
  output: "server",
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  security: { checkOrigin: true },
});
