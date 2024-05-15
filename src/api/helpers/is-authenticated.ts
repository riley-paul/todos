import type { Context } from "hono";

export const isAuthenticated = (c: Context) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Not authenticated" }, 401);
  }
};
