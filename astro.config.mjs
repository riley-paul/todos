import path from "node:path";
import url from "node:url";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import db from "@astrojs/db";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import node from "@astrojs/node";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
import { VitePWA } from "vite-plugin-pwa";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: import.meta.env.PROD
    ? "https://todos.rileys-projects.com"
    : "http://localhost:4321",
  integrations: [react(), db(), tailwind()],
  vite: {
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
          display: "standalone",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  output: "server",
  adapter: node({ mode: "standalone" }),
  security: { checkOrigin: true },
  env: {
    schema: {
      GITHUB_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      GITHUB_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
