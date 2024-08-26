import { createMiddleware } from "hono/factory";
import { verifyRequestOrigin, type Session } from "lucia";
import { getCookie, setCookie } from "hono/cookie";
import { lucia } from "@/lib/auth";
import { luciaToHonoCookieAttributes } from "./cookie-attributes";
import type { User } from "lucia";

type Env = {
  Variables: {
    session: Session;
    user: User;
  };
};

const authMiddleware = createMiddleware<Env>(async (c, next) => {
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
    return c.json({ error: "Unauthorized" }, 401);
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

  if (!session || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("session", session);
  c.set("user", user);
  return await next();
});

export default authMiddleware;
