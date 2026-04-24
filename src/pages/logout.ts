import {
  deleteSessionTokenCookie,
  invalidateSession,
} from "@/lib/lucia";
import type { APIContext } from "astro";
import { env } from "cloudflare:workers";

export async function GET(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  invalidateSession(env, context.locals.session.id);
  deleteSessionTokenCookie(env, context);

  return context.redirect("/");
}
