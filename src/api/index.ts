import { Hono } from "hono";
import todoRoutes from "./routes/todos";
import authRoutes from "./routes/auth";
import listRoutes from "./routes/lists";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

const routes = app
  .route("/todos", todoRoutes)
  .route("/auth", authRoutes)
  .route("/lists", listRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;
