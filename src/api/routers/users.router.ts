import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as userFunctions from "@/api/functions/users";
import * as userInputs from "@/api/schema/users.input";

const usersRouter = new Hono<HonoEnv>();

usersRouter.get("/me", async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const user = await userFunctions.getMe({ userId });
  return c.json(user);
});

usersRouter.put(
  "/settings",
  zValidator("json", userInputs.updateUserSettings),
  async (c) => {
    const userId = c.env.user?.id;
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const input = c.req.valid("json");

    const user = await userFunctions.updateUserSettings({ ...input, userId });
    return c.json(user);
  },
);

usersRouter.delete("/", async (c) => {
  const userId = c.env.user?.id;
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  await userFunctions.remove({ userId });
  return c.json({ success: true });
});

export default usersRouter;
