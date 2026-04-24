import { Hono } from "hono";
import todosRouter from "@/api/routers/todos.router";
import listsRouter from "@/api/routers/lists.router";
import listUsersRouter from "@/api/routers/list-users.router";
import usersRouter from "@/api/routers/users.router";

export const app = new Hono<HonoEnv>().basePath("/api");

app.get("/", (c) => c.json({ message: "Hello World" }));

app.route("/todos", todosRouter);
app.route("/lists", listsRouter);
app.route("/list-users", listUsersRouter);
app.route("/users", usersRouter);
