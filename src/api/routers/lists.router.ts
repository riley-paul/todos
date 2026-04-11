import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as listFunctions from "@/api/functions/lists";
import * as listInputs from "@/api/inputs/lists.input";
import { userAuthorized } from "../middlewares";

const listsRouter = new Hono<HonoEnv>();

listsRouter.get("/", userAuthorized, async (c) => {
  const userId = c.get("userId");

  const lists = await listFunctions.getAll({ userId });
  return c.json(lists);
});

listsRouter.get(
  "/search",
  userAuthorized,
  zValidator("query", listInputs.search),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("query");

    const lists = await listFunctions.search({ ...input, userId });
    return c.json(lists);
  },
);

listsRouter.get(
  "/:listId",
  userAuthorized,
  zValidator("param", listInputs.get),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("param");

    const list = await listFunctions.get({ ...input, userId });
    return c.json(list);
  },
);

listsRouter.post(
  "/",
  userAuthorized,
  zValidator("json", listInputs.create),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const list = await listFunctions.create({ ...input, userId });
    return c.json(list);
  },
);

listsRouter.put(
  "/sort-show",
  userAuthorized,
  zValidator("json", listInputs.updateSortShow),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const lists = await listFunctions.updateSortShow({ ...input, userId });
    return c.json(lists);
  },
);

listsRouter.put(
  "/",
  userAuthorized,
  zValidator("json", listInputs.update),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const list = await listFunctions.update({ ...input, userId });
    return c.json(list);
  },
);

listsRouter.delete(
  "/",
  userAuthorized,
  zValidator("json", listInputs.remove),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    await listFunctions.remove({ ...input, userId });
    return c.json({ success: true });
  },
);

export default listsRouter;
