import {
  deleteSessionTokenCookie,
  invalidateSession,
} from "@/lib/lucia";
import type { APIRoute } from "astro";

export const GET: APIRoute = (context) => {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  invalidateSession(context, context.locals.session.id);
  deleteSessionTokenCookie(context);

  return context.redirect("/");
};
