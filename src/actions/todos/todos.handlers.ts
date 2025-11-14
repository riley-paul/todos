import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { Todo, ListUser } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import type { TodoSelect } from "@/lib/types";
import {
  ensureAuthorized,
  invalidateListUsers,
  ensureListMember,
} from "../helpers";

import * as todoInputs from "./todos.inputs";
import actionErrors from "../errors";

export const create: ActionHandler<
  typeof todoInputs.create,
  TodoSelect
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const { listId } = data;

  await ensureListMember(c, { listId, userId });
  const [created] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning();
  await invalidateListUsers(c, listId);
  return created;
};

export const update: ActionHandler<
  typeof todoInputs.update,
  TodoSelect
> = async ({ id, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [currentTodo] = await db
    .select({ listId: Todo.listId })
    .from(Todo)
    .where(eq(Todo.id, id))
    .limit(1);
  if (!currentTodo) throw actionErrors.NOT_FOUND;

  if (data.listId !== undefined) {
    // ensure the user is a member of both the current and new list
    await ensureListMember(c, { listId: currentTodo.listId, userId });
    await ensureListMember(c, { listId: data.listId, userId });
  }

  const [updated] = await db
    .update(Todo)
    .set(data)
    .where(and(eq(Todo.id, id)))
    .returning();

  await invalidateListUsers(c, updated.listId);
  if (currentTodo.listId !== updated.listId)
    await invalidateListUsers(c, currentTodo.listId);

  return updated;
};

export const remove: ActionHandler<typeof todoInputs.remove, null> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [currentTodo] = await db
    .select({ listId: Todo.listId })
    .from(Todo)
    .where(eq(Todo.id, id))
    .limit(1);

  if (!currentTodo) throw actionErrors.NOT_FOUND;

  await ensureListMember(c, { listId: currentTodo.listId, userId });

  await db.delete(Todo).where(eq(Todo.id, id));
  await invalidateListUsers(c, currentTodo.listId);
  return null;
};

export const populate: ActionHandler<
  typeof todoInputs.populate,
  TodoSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const userLists = await db
    .select({ listId: ListUser.listId })
    .from(ListUser)
    .where(eq(ListUser.userId, userId))
    .then((rows) => rows.map(({ listId }) => listId));

  const todos: TodoSelect[] = await db
    .select()
    .from(Todo)
    .where(inArray(Todo.listId, userLists));

  return todos;
};
