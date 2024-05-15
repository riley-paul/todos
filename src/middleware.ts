import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api")) {
    return next();
  }

  console.log(`Request: ${request.url}`);
  return next();
});
