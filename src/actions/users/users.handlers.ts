import type { ActionHandler } from "astro:actions";
import { ensureAuthorized } from "../helpers";
import { createDb } from "@/db";
import { Todo, User, UserSession } from "@/db/schema";
import { and, eq, like, not, or } from "drizzle-orm";
import type { UserSelect, UserSelectWithSettings } from "@/lib/types";
import type userInputs from "./users.inputs";
import actionErrors from "../errors";

const USER_FIELDS = {
  id: User.id,
  name: User.name,
  email: User.email,
  avatarUrl: User.avatarUrl,
  settingGroupCompleted: User.settingGroupCompleted,
  settingListOrder: User.settingListOrder,
  settingListHiddenIndex: User.settingListHiddenIndex,
} as const;

const getMe: ActionHandler<
  typeof userInputs.getMe,
  UserSelectWithSettings
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const user = c.locals.user;
  if (!user) throw actionErrors.UNAUTHORIZED;

  const [data] = await db
    .select(USER_FIELDS)
    .from(User)
    .where(eq(User.id, user.id));

  if (!data) throw actionErrors.NOT_FOUND;
  return data;
};

const remove: ActionHandler<typeof userInputs.remove, null> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;
  await db.delete(UserSession).where(eq(UserSession.userId, userId));
  await db.delete(Todo).where(eq(Todo.userId, userId));
  await db.delete(User).where(eq(User.id, userId));

  // TODO: invalidate users sharing lists with the user
  return null;
};

const get: ActionHandler<typeof userInputs.get, UserSelect[]> = async (
  { search },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  return db
    .select()
    .from(User)
    .where(
      and(
        or(like(User.name, `%${search}%`), like(User.email, `%${search}%`)),
        not(eq(User.id, userId)),
      ),
    )
    .limit(10);
};

const updateUserSettings: ActionHandler<
  typeof userInputs.updateUserSettings,
  UserSelectWithSettings
> = async (data, c) => {
  const db = createDb(c.locals.runtime.env);
  const user = c.locals.user;
  if (!user) {
    throw actionErrors.UNAUTHORIZED;
  }
  const [updatedUser] = await db
    .update(User)
    .set(data)
    .where(eq(User.id, user.id))
    .returning(USER_FIELDS);

  if (!updatedUser) throw actionErrors.NOT_FOUND;

  return updatedUser;
};

const userHandlers = {
  getMe,
  remove,
  get,
  updateUserSettings,
};
export default userHandlers;
