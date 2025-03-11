import { defineMiddleware, sequence } from "astro:middleware";
import { SESSION_COOKIE_NAME, validateSessionToken } from "./lib/server/lucia";
import {
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "./lib/server/session-cookies";

const userValidation = defineMiddleware(async (context, next) => {
  const token = context.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { user, session } = await validateSessionToken(token);

  if (session) {
    setSessionTokenCookie(context, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(context);
  }

  context.locals.session = session;
  context.locals.user = user;
  return next();
});

const WHITE_LIST = ["/welcome", "/login", "/test"];
const routeGuarding = defineMiddleware(async (context, next) => {
  const isWhiteListed = WHITE_LIST.some((path) =>
    context.url.pathname.startsWith(path),
  );
  if (!isWhiteListed && !context.locals.user) {
    return context.redirect("/welcome");
  }
  return next();
});

export const onRequest = sequence(userValidation, routeGuarding);
