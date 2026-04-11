import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as todoFunctions from "@/api/functions/todos";
import * as todoInputs from "@/api/schema/todos.input";

const todosRouter = new Hono<HonoEnv>();

todosRouter.get("/", zValidator("query", todoInputs.getAll), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("query");

  const todos = await todoFunctions.getAll({ ...input, userId });
  return c.json(todos);
});

todosRouter.get(
  "/search",
  zValidator("query", todoInputs.search),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("query");

    const todos = await todoFunctions.search({ ...input, userId });
    return c.json(todos);
  },
);

todosRouter.post("/", zValidator("json", todoInputs.create), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  const todo = await todoFunctions.create({ ...input, userId });
  return c.json(todo);
});

todosRouter.put("/", zValidator("json", todoInputs.update), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  const todo = await todoFunctions.update({ ...input, userId });
  return c.json(todo);
});

todosRouter.delete("/", zValidator("json", todoInputs.remove), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  await todoFunctions.remove({ ...input, userId });
  return c.json({ success: true });
});

todosRouter.delete(
  "/completed",
  zValidator("json", todoInputs.removeCompleted),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("json");

    await todoFunctions.removeCompleted({ ...input, userId });
    return c.json({ success: true });
  },
);

todosRouter.put(
  "/uncheck-completed",
  zValidator("json", todoInputs.uncheckCompleted),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("json");

    await todoFunctions.uncheckCompleted({ ...input, userId });
    return c.json({ success: true });
  },
);

export default todosRouter;
