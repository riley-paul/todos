import {
  deleteSessionTokenCookie,
  invalidateSession,
} from "@/lib/server/lucia";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  invalidateSession(context, context.locals.session.id);
  deleteSessionTokenCookie(context);

  return context.redirect("/");
}
