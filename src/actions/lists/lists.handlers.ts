import { type ActionHandler } from "astro:actions";
import type { ListSelect } from "@/lib/types";
import {
  ensureListMember,
  invalidateListUsers,
  ensureAuthorized,
} from "../helpers";
import { createDb } from "@/db";
import { List, ListUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import actionErrors from "../errors";
import * as listInputs from "./lists.inputs";

export const update: ActionHandler<
  typeof listInputs.update,
  ListSelect
> = async ({ id: listId, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  const [list] = await db
    .update(List)
    .set(data)
    .where(eq(List.id, listId))
    .returning();

  if (!list) throw actionErrors.NOT_FOUND;

  await invalidateListUsers(c, listId);
  return list;
};

export const create: ActionHandler<
  typeof listInputs.create,
  ListSelect
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [list] = await db.insert(List).values(data).returning();

  await db
    .insert(ListUser)
    .values({
      listId: list.id,
      userId,
      isPending: false,
    })
    .returning();

  await invalidateListUsers(c, list.id);
  return list;
};

export const remove: ActionHandler<typeof listInputs.remove, null> = async (
  { id: listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  const [result] = await db.delete(List).where(eq(List.id, listId)).returning();
  if (!result) throw actionErrors.NOT_FOUND;

  await invalidateListUsers(c, listId);
  return null;
};

export const populate: ActionHandler<
  typeof listInputs.populate,
  ListSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const lists: ListSelect[] = await db
    .select({
      id: List.id,
      name: List.name,
      createdAt: List.createdAt,
      updatedAt: List.updatedAt,
    })
    .from(List)
    .innerJoin(ListUser, eq(ListUser.listId, List.id))
    .where(eq(ListUser.userId, userId));

  return lists;
};
