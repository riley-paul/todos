import { type ActionHandler } from "astro:actions";
import type { ListSelect, ListSelectShallow } from "@/lib/types";
import { getLists } from "./lists.helpers";
import { getListUsers, invalidateUsers, isAuthorized } from "../helpers";
import { createDb } from "@/db";
import { List, ListShare, Todo } from "@/db/schema";
import { eq } from "drizzle-orm";
import actionErrors from "../errors";
import type listInputs from "./lists.inputs";

const getAll: ActionHandler<typeof listInputs.getAll, ListSelect[]> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  return getLists(userId);
};

const update: ActionHandler<
  typeof listInputs.update,
  ListSelectShallow
> = async ({ id, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const users = await getListUsers(id);

  if (!users.includes(userId)) {
    throw actionErrors.NO_PERMISSION;
  }

  const [list] = await db
    .update(List)
    .set(data)
    .where(eq(List.id, id))
    .returning({ id: List.id, name: List.name });

  invalidateUsers(users);
  return list;
};

const create: ActionHandler<
  typeof listInputs.create,
  ListSelectShallow
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const [list] = await db
    .insert(List)
    .values({ ...data, userId })
    .returning({ id: List.id, name: List.name });

  return list;
};

const remove: ActionHandler<typeof listInputs.remove, null> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const users = await getListUsers(id);

  if (!users.includes(userId)) {
    throw actionErrors.NO_PERMISSION;
  }

  await db.delete(Todo).where(eq(Todo.listId, id));
  await db.delete(ListShare).where(eq(ListShare.listId, id));
  await db.delete(List).where(eq(List.id, id));

  invalidateUsers(users);
  return null;
};

const listHandlers = { getAll, update, create, remove };
export default listHandlers;
