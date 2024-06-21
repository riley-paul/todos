import path from "node:path";
import url from "node:url";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));


// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [tailwind({
    applyBaseStyles: false
  }), react(), db()],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  },
  output: "server",
  adapter: vercel({
    webAnalytics: true,
    speedInsights: true
  })
});