import { lucia } from "@/lib/auth";
import { defineMiddleware, sequence } from "astro:middleware";

const userValidation = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }
  context.locals.session = session;
  context.locals.user = user;
  return next();
});

const WHITE_LIST = ["/welcome", "/login"];
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
