import { Hono } from "hono";
import { generateState } from "arctic";
import { setCookie } from "hono/cookie";
import { github, lucia } from "@/api/lib/lucia";
import { OAuth2RequestError } from "arctic";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { luciaToHonoCookieAttributes } from "@/api/helpers/cookie-attributes";
import { User, db, eq } from "astro:db";
import { generateId } from "../../helpers/generate-id";
import env from "@/api/env";
import getGithubUser from "@/api/helpers/get-github-user";

const app = new Hono()
  .get("/", async (c) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    return c.redirect(url.toString());
  })
  .get(
    "/callback",
    zValidator(
      "query",
      z.object({
        code: z.string(),
        state: z.string(),
      }),
    ),
    zValidator(
      "cookie",
      z.object({ github_oauth_state: z.string().nullable() }),
    ),
    async (c) => {
      const { code, state } = c.req.valid("query");
      const { github_oauth_state } = c.req.valid("cookie");

      if (state !== github_oauth_state) {
        return c.json({ error: "Invalid state" }, 400);
      }

      try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUser = await getGithubUser(tokens.accessToken);

        // Replace this with your own DB client.
        const existingUser = await db
          .select()
          .from(User)
          .where(eq(User.email, githubUser.email))
          .then((rows) => rows[0]);

        if (existingUser) {
          await db
            .update(User)
            .set({ githubId: githubUser.id })
            .where(eq(User.id, existingUser.id));

          const session = await lucia.createSession(existingUser.id, {});
          const sessionCookie = lucia.createSessionCookie(session.id);
          setCookie(
            c,
            sessionCookie.name,
            sessionCookie.value,
            luciaToHonoCookieAttributes(sessionCookie.attributes),
          );
          return c.redirect("/");
        }

        // add user to database
        const user = await db
          .insert(User)
          .values({
            id: generateId(),
            email: githubUser.email,
            githubId: githubUser.id,
            githubUsername: githubUser.login,
            name: githubUser.name,
            avatarUrl: githubUser.avatar_url,
          })
          .returning()
          .then((rows) => rows[0]);

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        setCookie(
          c,
          sessionCookie.name,
          sessionCookie.value,
          luciaToHonoCookieAttributes(sessionCookie.attributes),
        );
        return c.redirect("/");
      } catch (e) {
        console.error(e);
        if (e instanceof OAuth2RequestError) {
          return c.json({ error: "An OAuth error occured" }, 400);
        }
        return c.json({ error: "An error occurred" }, 500);
      }
    },
  );

export default app;
