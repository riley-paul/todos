import { Hono } from "hono";
import todoRoutes from "./routes/todos";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

const routes = app
  .route("/todos", todoRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;
