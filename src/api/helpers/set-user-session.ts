import type { Context } from "hono";
import { lucia } from "../lib/lucia";
import { setCookie } from "hono/cookie";
import { luciaToHonoCookieAttributes } from "./cookie-attributes";

export default async function setUserSession(c: Context, userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    luciaToHonoCookieAttributes(sessionCookie.attributes),
  );
}
