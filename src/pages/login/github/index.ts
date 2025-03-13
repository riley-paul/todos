import { generateState } from "arctic";

import type { APIContext } from "astro";
import { github } from "@/lib/server/oauth";

export async function GET(context: APIContext): Promise<Response> {
  const { env } = context.locals.runtime;
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);

  context.cookies.set("github_oauth_state", state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
