import { type ActionHandler } from "astro:actions";
import type { ListSelect, ListSelectShallow } from "@/lib/types";
import { getListUsers, invalidateUsers, isAuthorized } from "../helpers";
import { createDb } from "@/db";
import { List, ListUser, Todo, User } from "@/db/schema";
import { and, asc, count, eq, not } from "drizzle-orm";
import actionErrors from "../errors";
import type listInputs from "./lists.inputs";

const getAll: ActionHandler<typeof listInputs.getAll, ListSelect[]> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  return db
    .selectDistinct({
      id: List.id,
      name: List.name,
    })
    .from(List)
    .innerJoin(ListUser, eq(ListUser.listId, List.id))
    .orderBy(asc(List.name))
    .where(eq(ListUser.userId, userId))
    .then((lists) =>
      Promise.all(
        lists.map(async (list) => {
          const otherUsers = await db
            .selectDistinct({
              id: User.id,
              name: User.name,
              email: User.email,
              avatarUrl: User.avatarUrl,
            })
            .from(ListUser)
            .innerJoin(User, eq(User.id, ListUser.userId))
            .where(
              and(
                eq(ListUser.listId, list.id),
                not(eq(ListUser.userId, userId)),
              ),
            );

          const todoCount = await db
            .select({ count: count() })
            .from(Todo)
            .where(eq(Todo.listId, list.id))
            .then(([{ count }]) => count);

          const [{ isAdmin }] = await db
            .select({ isAdmin: ListUser.isAdmin })
            .from(ListUser)
            .where(
              and(eq(ListUser.userId, userId), eq(ListUser.listId, list.id)),
            );

          return {
            ...list,
            todoCount,
            otherUsers,
            isAdmin,
          };
        }),
      ),
    );
};

const get: ActionHandler<typeof listInputs.get, ListSelectShallow> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  if (id === "all") {
    return { id: "all", name: "All" };
  }

  const [list] = await db
    .select({
      id: List.id,
      name: List.name,
    })
    .from(List)
    .innerJoin(ListUser, eq(ListUser.listId, List.id))
    .where(and(eq(ListUser.userId, userId), eq(List.id, id)));

  if (!list) throw actionErrors.NOT_FOUND;
  return list;
};

const update: ActionHandler<
  typeof listInputs.update,
  ListSelectShallow
> = async ({ id, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const users = await getListUsers(c, id);

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
    .values(data)
    .returning({ id: List.id, name: List.name });

  await db.insert(ListUser).values({
    listId: list.id,
    userId,
    isAdmin: true,
    isPending: false,
  });

  return list;
};

const remove: ActionHandler<typeof listInputs.remove, null> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [listUser] = await db
    .select({ isAdmin: ListUser.isAdmin })
    .from(ListUser)
    .where(and(eq(ListUser.listId, id), eq(ListUser.userId, userId)))
    .limit(1);

  if (!listUser) throw actionErrors.NOT_FOUND;
  if (!listUser.isAdmin) throw actionErrors.NO_PERMISSION;

  await db.delete(List).where(eq(List.id, id));
  return null;
};

const listHandlers = { getAll, get, update, create, remove };
export default listHandlers;
