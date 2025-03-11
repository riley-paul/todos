import { invalidateSession } from "@/lib/server/lucia";
import { deleteSessionTokenCookie } from "@/lib/server/session-cookies";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  invalidateSession(context.locals.session.id);
  deleteSessionTokenCookie(context);

  return context.redirect("/");
}
