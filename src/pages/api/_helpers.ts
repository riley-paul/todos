import type { APIContext } from "astro";

export const getSearchParams = (c: APIContext) => {
  const { searchParams } = c.url;
  return Object.fromEntries(searchParams.entries());
};
