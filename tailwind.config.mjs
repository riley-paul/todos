import { radixThemePreset } from "radix-themes-tw";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  presets: [radixThemePreset],
  theme: {
    extend: {},
  },
  plugins: [],
};
