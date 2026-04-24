import { createMiddleware } from "hono/factory";

export const userAuthorized = createMiddleware<
  { Variables: { userId: string } } & HonoEnv
>(async (c, next) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  c.set("userId", userId);
  await next();
});
