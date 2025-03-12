import type { ActionHandler } from "astro:actions";
import * as inputs from "./users.inputs";
import { isAuthorized } from "../helpers";
import db from "@/db";
import { Todo, User, UserSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { UserSelect } from "@/lib/types";

export const getMe: ActionHandler<
  typeof inputs.getMe,
  UserSelect | null
> = async (_, c) => {
  const user = c.locals.user;
  if (!user) {
    return null;
  }
  const [data] = await db
    .select({
      id: User.id,
      name: User.name,
      email: User.email,
      avatarUrl: User.avatarUrl,
    })
    .from(User)
    .where(eq(User.id, user.id));
  return data;
};

export const remove: ActionHandler<typeof inputs.remove, null> = async (
  _,
  c,
) => {
  const userId = isAuthorized(c).id;
  await db.delete(UserSession).where(eq(UserSession.userId, userId));
  await db.delete(Todo).where(eq(Todo.userId, userId));
  await db.delete(User).where(eq(User.id, userId));
  return null;
};

export const checkIfEmailExists: ActionHandler<
  typeof inputs.checkIfEmailExists,
  boolean
> = async ({ email }, c) => {
  isAuthorized(c);
  const data = await db.select().from(User).where(eq(User.email, email));
  return data.length > 0;
};
