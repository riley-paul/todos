import { github } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import getGithubUser from "@/lib/helpers/get-github-user";
import setUserSession from "@/lib/helpers/set-user-session";
import db from "@/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await getGithubUser(tokens.accessToken);

    const [existingUser] = await db
      .select()
      .from(User)
      .where(eq(User.email, githubUser.email));

    if (existingUser) {
      await db
        .update(User)
        .set({ githubId: githubUser.id })
        .where(eq(User.id, existingUser.id));
      await setUserSession(context, existingUser.id);
      return context.redirect("/");
    }

    // add user to database
    const [user] = await db
      .insert(User)
      .values({
        email: githubUser.email,
        githubId: githubUser.id,
        githubUsername: githubUser.login,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
      })
      .returning();

    await setUserSession(context, user.id);
    return context.redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
