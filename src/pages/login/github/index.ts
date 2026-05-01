import { generateState } from "arctic";

import type { APIContext } from "astro";
import { createGithub } from "@/lib/oauth";

export async function GET(context: APIContext): Promise<Response> {
  const { env } = context.locals;

  const secure = env.NODE_ENV === "production";
  const github = createGithub(env);

  const state = generateState();
  const url = github.createAuthorizationURL(state, ["user:email"]);

  context.cookies.set("github_oauth_state", state, {
    path: "/",
    secure,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
