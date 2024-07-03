import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { lucia } from "@/api/lib/lucia";
import { luciaToHonoCookieAttributes } from "@/api/helpers/cookie-attributes";
import authMiddleware from "@/api/helpers/auth-middleware";
import { Todo, User, UserSession, db, eq } from "astro:db";

import githubRoutes from "./github";
import googleRoutes from "./google";

const app = new Hono()
  .route("/login/github", githubRoutes)
  .route("/login/google", googleRoutes)
  .use(authMiddleware)
  .post("/logout", async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.redirect("/");
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      luciaToHonoCookieAttributes(sessionCookie.attributes),
    );

    return c.json({ success: true });
  })
  .get("/me", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json(null, 401);
    }
    const data = await db
      .select()
      .from(User)
      .where(eq(User.id, user.id))
      .then((rows) => rows[0]);
    return c.json(data);
  })
  .post("/delete", async (c) => {
    const userId = c.get("user").id;
    await db.delete(UserSession).where(eq(UserSession.userId, userId));
    await db.delete(Todo).where(eq(Todo.userId, userId));
    await db.delete(User).where(eq(User.id, userId));
    return c.redirect("/");
  });

export default app;
