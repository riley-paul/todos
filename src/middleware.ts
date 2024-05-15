import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api") || url.pathname === "/") {
    return next();
  }

  return context.redirect(`/#${url.pathname}`);
});
