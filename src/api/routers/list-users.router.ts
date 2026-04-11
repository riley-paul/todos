import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as listUserFunctions from "@/api/functions/list-users";
import * as listUserInputs from "@/api/schema/list-users.input";

const listUsersRouter = new Hono<HonoEnv>();

listUsersRouter.get(
  "/",
  zValidator("query", listUserInputs.getAllForList),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("query");

    const listUsers = await listUserFunctions.getAllForList({ ...input, userId });
    return c.json(listUsers);
  },
);

listUsersRouter.post("/", zValidator("json", listUserInputs.create), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  const listUser = await listUserFunctions.create({ ...input, userId });
  return c.json(listUser);
});

listUsersRouter.delete("/", zValidator("json", listUserInputs.remove), async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const input = c.req.valid("json");

  await listUserFunctions.remove({ ...input, userId });
  return c.json({ success: true });
});

listUsersRouter.put(
  "/accept",
  zValidator("json", listUserInputs.accept),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("json");

    const listUser = await listUserFunctions.accept({ ...input, userId });
    return c.json(listUser);
  },
);

export default listUsersRouter;
