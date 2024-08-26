import { Hono } from "hono";
import { generateCodeVerifier, generateState } from "arctic";
import { setCookie } from "hono/cookie";
import { google } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { User, db, eq } from "astro:db";
import { generateId } from "@/api/helpers/generate-id";
import getGoogleUser from "../../../lib/helpers/get-google-user";
import setUserSession from "../../../lib/helpers/set-user-session";

const app = new Hono()
  .get("/", async (c) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["email", "profile"],
    });

    setCookie(c, "google_oauth_state", state, {
      path: "/",
      secure: Boolean(import.meta.env.PROD),
      httpOnly: true,
      maxAge: 60 * 10, // 10 min
    });

    setCookie(c, "google_oauth_code_verifier", codeVerifier, {
      path: "/",
      secure: Boolean(import.meta.env.PROD),
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

        const googleUser = await getGoogleUser(tokens.accessToken);

        const existingUser = await db
          .select()
          .from(User)
          .where(eq(User.email, googleUser.email))
          .then((rows) => rows[0]);

        if (existingUser) {
          await db
            .update(User)
            .set({ googleId: googleUser.id })
            .where(eq(User.id, existingUser.id));
          await setUserSession(c, existingUser.id);
          return c.redirect("/");
        }

        // add user to database
        const user = await db
          .insert(User)
          .values({
            id: generateId(),
            email: googleUser.email,
            googleId: googleUser.id,
            name: googleUser.name,
            avatarUrl: googleUser.picture,
          })
          .returning()
          .then((rows) => rows[0]);

        await setUserSession(c, user.id);
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
