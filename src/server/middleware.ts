import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type { AppBindings } from "./lib/types";
import { SESSION_COOKIE_NAME, validateSessionToken } from "@/lib/server/lucia";
import {
  deleteHonoSessionTokenCookie,
  setHonoSessionTokenCookie,
} from "@/lib/server/session-cookies";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE_NAME);
  if (!token) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { user, session } = await validateSessionToken(token);

  if (session) {
    setHonoSessionTokenCookie(c, token, session.expiresAt);
  } else {
    deleteHonoSessionTokenCookie(c);
  }

  c.set("user", user);
  c.set("session", session);

  return next();
});
