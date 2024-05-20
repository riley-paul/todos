import { defineMiddleware } from "astro:middleware";
import { type AppType } from "@/api";
import { hc } from "hono/client";

// export const onRequest = defineMiddleware(async (context, next) => {
//   const { request, url } = context;

//   const headers = Object.fromEntries(request.headers);
//   const client = hc<AppType>(url.origin, { headers });

//   const res = await client.api.auth.me.$get();
//   const user = await res.json();
//   if (!res.ok || !user) {
//     return context.redirect("/welcome");
//   }

//   return next();
// });
