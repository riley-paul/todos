import { Hono } from "hono";
import { generateCodeVerifier, generateState } from "arctic";
import { setCookie } from "hono/cookie";
import { google, lucia } from "@/api/lib/lucia";
import { OAuth2RequestError } from "arctic";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { luciaToHonoCookieAttributes } from "@/api/helpers/cookie-attributes";
import { User, db, eq } from "astro:db";
import { generateId } from "../../helpers/generate-id";
import env from "@/api/env";

const app = new Hono()
  .get("/", async (c) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url: URL = await google.createAuthorizationURL(state, codeVerifier);

    setCookie(c, "google_oauth_state", state, {
      path: "/",
      secure: env.PROD,
      httpOnly: true,
      maxAge: 60 * 10, // 10 min
    });

    setCookie(c, "google_oauth_code_verifier", codeVerifier, {
      path: "/",
      secure: env.PROD,
      httpOnly: true,
      maxAge: 60 * 10, // 10 min
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
      z.object({
        google_oauth_state: z.string(),
        google_oauth_code_verifier: z.string(),
      }),
    ),
    async (c) => {
      const { code, state } = c.req.valid("query");
      const { google_oauth_state, google_oauth_code_verifier } =
        c.req.valid("cookie");

      if (state !== google_oauth_state) {
        return c.json({ error: "Invalid state" }, 400);
      }

      try {
        const tokens = await google.validateAuthorizationCode(
          code,
          google_oauth_code_verifier,
        );

        console.log("tokens", tokens);

        // const githubUserResponse = await fetch("https://api.github.com/user", {
        //   headers: {
        //     Authorization: `Bearer ${tokens.accessToken}`,
        //   },
        // });
        // const githubUser: GitHubUser = await githubUserResponse.json();

        // // Replace this with your own DB client.
        // const existingUser = await db
        //   .select()
        //   .from(User)
        //   .where(eq(User.githubId, githubUser.id))
        //   .then((rows) => rows[0]);

        // if (existingUser) {
        //   const session = await lucia.createSession(existingUser.id, {});
        //   const sessionCookie = lucia.createSessionCookie(session.id);
        //   setCookie(
        //     c,
        //     sessionCookie.name,
        //     sessionCookie.value,
        //     luciaToHonoCookieAttributes(sessionCookie.attributes),
        //   );
        //   return c.redirect("/");
        // }

        // // add user to database
        // const user = await db
        //   .insert(User)
        //   .values({
        //     id: generateId(),
        //     githubId: githubUser.id,
        //     username: githubUser.login,
        //     name: githubUser.name,
        //     avatarUrl: githubUser.avatar_url,
        //   })
        //   .returning()
        //   .then((rows) => rows[0]);

        // const session = await lucia.createSession(user.id, {});
        // const sessionCookie = lucia.createSessionCookie(session.id);
        // setCookie(
        //   c,
        //   sessionCookie.name,
        //   sessionCookie.value,
        //   luciaToHonoCookieAttributes(sessionCookie.attributes),
        // );
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
