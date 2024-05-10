import { Hono } from "hono";
import { cors } from "hono/cors";
import todoRoutes from "./routes/todos";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.use("/api/*", cors());

const routes = app
  .route("/todos", todoRoutes)
  .get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
export type AppType = typeof routes;
