import { Hono } from "hono";

export const app = new Hono<HonoEnv>().basePath("/api/").get("/hello", (c) => {
  const user = c.env.user;
  console.log(user);
  return c.json({
    message: "Hello from Hono!",
    user,
  });
});
