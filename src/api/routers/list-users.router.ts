import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as listUserFunctions from "@/api/functions/list-users";
import * as listUserInputs from "@/api/inputs/list-users.input";
import { userAuthorized } from "../middlewares";

const listUsersRouter = new Hono<HonoEnv>();

listUsersRouter.get(
  "/",
  userAuthorized,
  zValidator("query", listUserInputs.getAllForList),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("query");

    const listUsers = await listUserFunctions.getAllForList({
      ...input,
      userId,
    });
    return c.json(listUsers);
  },
);

listUsersRouter.post(
  "/",
  userAuthorized,
  zValidator("json", listUserInputs.create),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const listUser = await listUserFunctions.create({ ...input, userId });
    return c.json(listUser);
  },
);

listUsersRouter.delete(
  "/",
  userAuthorized,
  zValidator("json", listUserInputs.remove),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    await listUserFunctions.remove({ ...input, userId });
    return c.json({ success: true });
  },
);

listUsersRouter.put(
  "/accept",
  userAuthorized,
  zValidator("json", listUserInputs.accept),
  async (c) => {
    const userId = c.get("userId");
    const input = c.req.valid("json");

    const listUser = await listUserFunctions.accept({ ...input, userId });
    return c.json(listUser);
  },
);

export default listUsersRouter;
