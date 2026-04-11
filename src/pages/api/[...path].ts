import { app } from "@/api";
import type { APIRoute } from "astro";

export const ALL: APIRoute = (c) =>
  app.fetch(c.request, {
    user: c.locals.user,
    session: c.locals.session,
  });
