import { createDb } from "@/db";
import { Todo, User, UserSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ApiFunction, UserSelectWithSettings } from "@/lib/types";
import * as userInputs from "@/api/schema/users.input";
import actionErrors from "../../api/errors";
import { env } from "cloudflare:workers";

const USER_FIELDS = {
  id: User.id,
  name: User.name,
  email: User.email,
  avatarUrl: User.avatarUrl,
  settingGroupCompleted: User.settingGroupCompleted,
} as const;

export const getMe: ApiFunction<
  typeof userInputs.getMe,
  UserSelectWithSettings
> = async ({ userId }) => {
  const db = createDb(env);

  const [data] = await db
    .select(USER_FIELDS)
    .from(User)
    .where(eq(User.id, userId));

  if (!data) throw actionErrors.NOT_FOUND;
  return data;
};

export const remove: ApiFunction<typeof userInputs.remove, null> = async ({
  userId,
}) => {
  const db = createDb(env);
  await db.delete(UserSession).where(eq(UserSession.userId, userId));
  await db.delete(Todo).where(eq(Todo.userId, userId));
  await db.delete(User).where(eq(User.id, userId));

  // TODO: invalidate users sharing lists with the user
  return null;
};

export const updateUserSettings: ApiFunction<
  typeof userInputs.updateUserSettings,
  UserSelectWithSettings
> = async ({ userId, ...data }) => {
  const db = createDb(env);
  const [updatedUser] = await db
    .update(User)
    .set(data)
    .where(eq(User.id, userId))
    .returning(USER_FIELDS);

  if (!updatedUser) throw actionErrors.NOT_FOUND;

  return updatedUser;
};
