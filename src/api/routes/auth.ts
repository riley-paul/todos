import { zValidator } from "@hono/zod-validator";
import { z } from "astro:content";
import { Hono } from "hono";
import { db } from "../db";
import { userTable } from "../db/schema";
import { lucia } from "@/lib/auth";
import { setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import { eq } from "drizzle-orm";
import { hash, verify, type Options } from "@node-rs/argon2";

const HASH_OPTIONS: Options = {
  // recommended minimum parameters
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(255)
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/),
});

export const signUpSchema = signInSchema
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

const app = new Hono()
  .post("/signup", zValidator("form", signUpSchema), async (c) => {
    const { email, password } = c.req.valid("form");
    const passwordHash = await hash(password, HASH_OPTIONS);
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .then((rows) => rows[0]);

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    const user = await db
      .insert(userTable)
      .values({
        email,
        passwordHash,
      })
      .returning()
      .then((rows) => rows[0]);

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes as CookieOptions,
    );

    return c.redirect("/");
  })
  .post("/login", zValidator("form", signInSchema), async (c) => {
    const { email, password } = c.req.valid("form");

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .then((rows) => rows[0]);

    if (!existingUser) {
      return c.json({ error: "Incorrect username or password" }, 400);
    }

    const validPassword = await verify(
      existingUser.passwordHash,
      password,
      HASH_OPTIONS,
    );

    if (!validPassword) {
      return c.json({ error: "Incorrect username or password" }, 400);
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes as CookieOptions,
    );

    return c.redirect("/");
  })
  .post("/signout");

export default app;
