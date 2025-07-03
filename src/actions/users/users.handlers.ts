import type { ActionHandler } from "astro:actions";
import { isAuthorized } from "../helpers";
import { createDb } from "@/db";
import { Todo, User, UserSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UserSelectWithSettings } from "@/lib/types";
import type userInputs from "./users.inputs";
import actionErrors from "../errors";

const getMe: ActionHandler<
  typeof userInputs.getMe,
  UserSelectWithSettings
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const user = c.locals.user;
  if (!user) throw actionErrors.UNAUTHORIZED;

  const [data] = await db
    .select({
      id: User.id,
      name: User.name,
      email: User.email,
      avatarUrl: User.avatarUrl,
      settingGroupCompleted: User.settingGroupCompleted,
    })
    .from(User)
    .where(eq(User.id, user.id));

  if (!data) throw actionErrors.NOT_FOUND;
  return data;
};

const remove: ActionHandler<typeof userInputs.remove, null> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  await db.delete(UserSession).where(eq(UserSession.userId, userId));
  await db.delete(Todo).where(eq(Todo.userId, userId));
  await db.delete(User).where(eq(User.id, userId));
  return null;
};

const checkIfEmailExists: ActionHandler<
  typeof userInputs.checkIfEmailExists,
  boolean
> = async ({ email }, c) => {
  const db = createDb(c.locals.runtime.env);
  isAuthorized(c);
  const data = await db.select().from(User).where(eq(User.email, email));
  return data.length > 0;
};

const updateUserSettings: ActionHandler<
  typeof userInputs.updateUserSettings,
  UserSelectWithSettings
> = async ({ settingGroupCompleted }, c) => {
  const db = createDb(c.locals.runtime.env);
  const user = c.locals.user;
  if (!user) {
    throw actionErrors.UNAUTHORIZED;
  }
  const [updatedUser] = await db
    .update(User)
    .set({ settingGroupCompleted })
    .where(eq(User.id, user.id))
    .returning({
      id: User.id,
      name: User.name,
      email: User.email,
      avatarUrl: User.avatarUrl,
      settingGroupCompleted: User.settingGroupCompleted,
    });

  if (!updatedUser) throw actionErrors.NOT_FOUND;

  return updatedUser;
};

const userHandlers = {
  getMe,
  remove,
  checkIfEmailExists,
  updateUserSettings,
};
export default userHandlers;
