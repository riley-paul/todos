import { Hono } from "hono";
import { generateState } from "arctic";
import { setCookie } from "hono/cookie";
import { github, lucia } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/api/db";
import { userTable } from "@/api/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { luciaToHonoCookieAttributes, sameSiteConversion } from "../helpers";

const app = new Hono()
  .get("/login/github", async (c) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    return c.redirect(url.toString());
  })
  .get(
    "/login/github/callback",
    zValidator(
      "param",
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
      const { code, state } = c.req.valid("param");
      const { github_oauth_state } = c.req.valid("cookie");

      if (state !== github_oauth_state) {
        return c.json({ error: "Invalid state" }, 400);
      }

      try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
        const githubUser: GitHubUser = await githubUserResponse.json();

        // Replace this with your own DB client.
        const existingUser = await db
          .select()
          .from(userTable)
          .where(eq(userTable.githubId, githubUser.id))
          .then((rows) => rows[0]);

        if (existingUser) {
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

        const userId = generateIdFromEntropySize(10); // 16 characters long

        // Replace this with your own DB client.
        await db.insert(userTable).values({
          id: userId,
          githubId: githubUser.id,
          username: githubUser.login,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        setCookie(
          c,
          sessionCookie.name,
          sessionCookie.value,
          luciaToHonoCookieAttributes(sessionCookie.attributes),
        );
        return c.redirect("/");
      } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
          // invalid code
          console.log(e.message);
          return c.json({ error: "An OAuth error occured" }, 400);
        }
        return c.json({ error: "An error occurred" }, 500);
      }
    },
  )
  .post("/logout", async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({ error: "No session" }, 400);
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      luciaToHonoCookieAttributes(sessionCookie.attributes),
    );

    return c.redirect("/login");
  });

interface GitHubUser {
  id: string;
  login: string;
}

export default app;
