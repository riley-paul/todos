import { defineMiddleware } from "astro:middleware";
import { type AppType } from "@/api";
import { hc } from "hono/client";

const WHITE_LIST = ["/welcome", "/login", "/signup"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  if (url.pathname.startsWith("/api") || WHITE_LIST.includes(url.pathname)) {
    return next();
  }

  const headers = Object.fromEntries(request.headers);
  const client = hc<AppType>(url.origin, { headers });

  const res = await client.api.auth.me.$get();
  if (!res.ok || res.status !== 200) {
    return context.redirect("/welcome");
  }

  return next();
});
