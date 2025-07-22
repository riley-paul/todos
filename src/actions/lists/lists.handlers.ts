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
      author: {
        id: User.id,
        name: User.name,
        email: User.email,
        avatarUrl: User.avatarUrl,
      },
    })
    .from(List)
    .innerJoin(ListUser, eq(ListUser.listId, List.id))
    .innerJoin(User, eq(User.id, ListUser.userId))
    .orderBy(asc(List.name))
    .where(eq(ListUser.userId, userId))
    .then((lists) =>
      Promise.all(
        lists.map(async (list) => ({
          ...list,
          todoCount: await db
            .select({ count: count() })
            .from(Todo)
            .where(eq(Todo.listId, list.id))
            .then((rows) => rows[0].count),
          shares: await db
            .selectDistinct({
              id: ListUser.id,
              user: {
                id: User.id,
                name: User.name,
                email: User.email,
                avatarUrl: User.avatarUrl,
              },
              isPending: ListUser.isPending,
            })
            .from(ListUser)
            .innerJoin(User, eq(User.id, ListUser.userId))
            .where(
              and(
                eq(ListUser.listId, list.id),
                not(eq(ListUser.userId, userId)),
              ),
            )
            .then((shares) =>
              shares.map((share) => ({
                ...share,
                list: { id: list.id, name: list.name, author: list.author },
                isAuthor: share.user.id === userId,
              })),
            ),
          isAuthor: list.author.id === userId,
        })),
      ),
    )
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        otherUsers: [...row.shares, { user: row.author }]
          .filter((share) => share.user.id !== userId)
          .map((share) => share.user),
      })),
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
    .where(and(eq(ListUser.id, userId), eq(List.id, id)));

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
  const users = await getListUsers(c, id);

  if (!users.includes(userId)) {
    throw actionErrors.NO_PERMISSION;
  }

  await db.delete(Todo).where(eq(Todo.listId, id));
  await db.delete(ListUser).where(eq(ListUser.listId, id));
  await db.delete(List).where(eq(List.id, id));

  invalidateUsers(users);
  return null;
};

const listHandlers = { getAll, get, update, create, remove };
export default listHandlers;
