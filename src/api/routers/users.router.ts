import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as userFunctions from "@/api/functions/users";
import * as userInputs from "@/api/schema/users.input";
import { userAuthorized } from "../middlewares";

const usersRouter = new Hono<HonoEnv>();

usersRouter.get("/me", userAuthorized, async (c) => {
  const userId = c.get("userId");

  const user = await userFunctions.getMe({ userId });
  return c.json(user);
});

usersRouter.put(
  "/settings",
  userAuthorized,
  zValidator("json", userInputs.updateUserSettings),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const user = await userFunctions.updateUserSettings({ ...input, userId });
    return c.json(user);
  },
);

usersRouter.delete("/", userAuthorized, async (c) => {
  const userId = c.get("userId");

  await userFunctions.remove({ userId });
  return c.json({ success: true });
});

export default usersRouter;
