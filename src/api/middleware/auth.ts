import { createMiddleware } from "hono/factory";
import { verifyRequestOrigin } from "lucia";
import { getCookie, setCookie } from "hono/cookie";
import { lucia } from "@/lib/lucia";
import { luciaToHonoCookieAttributes } from "../helpers/cookie-attributes";

const authMiddleware = createMiddleware(async (c, next) => {
  if (c.req.method !== "GET") {
    const originHeader = c.req.header("Origin");
    const hostHeader = c.req.header("Host");
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return c.json({ error: "Could not verify request origin" }, 403);
    }
  }

  const sessionId = getCookie(c, lucia.sessionCookieName);
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return await next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      luciaToHonoCookieAttributes(sessionCookie.attributes),
    );
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      luciaToHonoCookieAttributes(sessionCookie.attributes),
    );
  }

  c.set("session", session);
  c.set("user", user);
  return await next();
});

export default authMiddleware;
