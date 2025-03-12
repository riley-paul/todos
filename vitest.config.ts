/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { defineConfig, mergeConfig } from "vitest/config";

const viteConfig = getViteConfig({});
export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {},
    }),
  ),
);
