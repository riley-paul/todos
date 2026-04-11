import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as listFunctions from "@/api/functions/lists";
import * as listInputs from "@/api/schema/lists.input";

const listsRouter = new Hono<HonoEnv>();

listsRouter.get("/", async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const lists = await listFunctions.getAll({ userId });
  return c.json(lists);
});

listsRouter.get(
  "/search",
  zValidator("query", listInputs.search),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("query");

    const lists = await listFunctions.search({ ...input, userId });
    return c.json(lists);
  },
);

listsRouter.get("/:listId", zValidator("param", listInputs.get), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("param");

  const list = await listFunctions.get({ ...input, userId });
  return c.json(list);
});

listsRouter.post("/", zValidator("json", listInputs.create), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  const list = await listFunctions.create({ ...input, userId });
  return c.json(list);
});

listsRouter.put(
  "/sort-show",
  zValidator("json", listInputs.updateSortShow),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("json");

    const lists = await listFunctions.updateSortShow({ ...input, userId });
    return c.json(lists);
  },
);

listsRouter.put("/", zValidator("json", listInputs.update), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  const list = await listFunctions.update({ ...input, userId });
  return c.json(list);
});

listsRouter.delete("/", zValidator("json", listInputs.remove), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  await listFunctions.remove({ ...input, userId });
  return c.json({ success: true });
});

export default listsRouter;
