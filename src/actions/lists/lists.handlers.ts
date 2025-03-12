import { ActionError, type ActionHandler } from "astro:actions";
import * as input from "./lists.inputs";
import type { ListSelect, ListSelectShallow } from "@/lib/types";
import { getLists } from "./lists.helpers";
import { getListUsers, invalidateUsers, isAuthorized } from "../helpers";
import db from "@/db";
import { List, ListShare, Todo } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAll: ActionHandler<typeof input.getAll, ListSelect[]> = async (
  _,
  c,
) => {
  const userId = isAuthorized(c).id;
  return getLists(userId);
};

export const update: ActionHandler<
  typeof input.update,
  ListSelectShallow
> = async ({ id, data }, c) => {
  const userId = isAuthorized(c).id;
  const users = await getListUsers(id);

  if (!users.includes(userId)) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: "You do not have permission to update this list",
    });
  }

  const [list] = await db
    .update(List)
    .set(data)
    .where(eq(List.id, id))
    .returning({ id: List.id, name: List.name });

  invalidateUsers(users);
  return list;
};

export const create: ActionHandler<
  typeof input.create,
  ListSelectShallow
> = async ({ data }, c) => {
  const userId = isAuthorized(c).id;
  const [list] = await db
    .insert(List)
    .values({ ...data, userId })
    .returning({ id: List.id, name: List.name });

  return list;
};

export const remove: ActionHandler<typeof input.remove, null> = async (
  { id },
  c,
) => {
  const userId = isAuthorized(c).id;
  const users = await getListUsers(id);

  if (!users.includes(userId)) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: "You do not have permission to delete this list",
    });
  }

  await db.delete(Todo).where(eq(Todo.listId, id));
  await db.delete(ListShare).where(eq(ListShare.listId, id));
  await db.delete(List).where(eq(List.id, id));

  invalidateUsers(users);
  return null;
};
