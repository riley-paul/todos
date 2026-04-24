import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as todoFunctions from "@/api/functions/todos";
import * as todoInputs from "@/api/inputs/todos.input";
import { userAuthorized } from "../middlewares";

const todosRouter = new Hono<HonoEnv>();

todosRouter.get(
  "/",
  userAuthorized,
  zValidator("query", todoInputs.getAll),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("query");

    const todos = await todoFunctions.getAll({ ...input, userId });
    return c.json(todos);
  },
);

todosRouter.get(
  "/search",
  userAuthorized,
  zValidator("query", todoInputs.search),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("query");

    const todos = await todoFunctions.search({ ...input, userId });
    return c.json(todos);
  },
);

todosRouter.post(
  "/",
  userAuthorized,
  zValidator("json", todoInputs.create),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const todo = await todoFunctions.create({ ...input, userId });
    return c.json(todo);
  },
);

todosRouter.put(
  "/",
  userAuthorized,
  zValidator("json", todoInputs.update),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const todo = await todoFunctions.update({ ...input, userId });
    return c.json(todo);
  },
);

todosRouter.delete(
  "/",
  userAuthorized,
  zValidator("json", todoInputs.remove),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    await todoFunctions.remove({ ...input, userId });
    return c.json({ success: true });
  },
);

todosRouter.delete(
  "/completed",
  userAuthorized,
  zValidator("json", todoInputs.removeCompleted),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    await todoFunctions.removeCompleted({ ...input, userId });
    return c.json({ success: true });
  },
);

todosRouter.put(
  "/uncheck-completed",
  userAuthorized,
  zValidator("json", todoInputs.uncheckCompleted),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    await todoFunctions.uncheckCompleted({ ...input, userId });
    return c.json({ success: true });
  },
);

export default todosRouter;
