import { generateState } from "arctic";

import type { APIContext } from "astro";
import { createGithub } from "@/lib/server/oauth";

export async function GET(context: APIContext): Promise<Response> {
  const secure = context.locals.runtime.env.NODE_ENV === "production";
  const github = createGithub(context);

  const state = generateState();
  const url = github.createAuthorizationURL(state, []);

  context.cookies.set("github_oauth_state", state, {
    path: "/",
    secure,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
