import { Hono } from "hono";
import todosRouter from "@/api/routers/todos.router";

export const app = new Hono<HonoEnv>().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

// Routers
app.route("/todos", todosRouter);
