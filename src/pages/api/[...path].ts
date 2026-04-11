import type { APIRoute } from "astro";
import { Hono } from "hono";

type HonoEnv = {
  Bindings: {
    user: App.Locals["user"];
    session: App.Locals["session"];
  };
};

const app = new Hono<HonoEnv>().basePath("/api/").get("/hello", (c) => {
  const user = c.env.user;
  console.log(user);
  return c.json({
    message: "Hello from Hono!",
    user,
  });
});

export const ALL: APIRoute = (c) =>
  app.fetch(c.request, {
    user: c.locals.user,
    session: c.locals.session,
  });
