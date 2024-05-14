import { Hono } from "hono";
import type { Session, User } from "lucia";

import todoRoutes from "./routes/todos";
import authRoutes from "./routes/auth";
import authMiddleware from "./middleware/auth";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.use(authMiddleware);

const routes = app
  .route("/todos", todoRoutes)
  .route("/auth", authRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;

declare module "hono" {
  interface ContextVariableMap {
    session: Session | null;
    user: User | null;
  }
}
