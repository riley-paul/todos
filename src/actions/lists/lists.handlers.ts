import { type ActionHandler } from "astro:actions";
import type { ListSelect, ListSelectShallow } from "@/lib/types";
import {
  getUserIsListMember,
  invalidateListUsers,
  isAuthorized,
} from "../helpers";
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
    .where(and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)))
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
                eq(ListUser.isPending, false),
                not(eq(ListUser.userId, userId)),
              ),
            );

          const todoCount = await db
            .select({ count: count() })
            .from(Todo)
            .where(eq(Todo.listId, list.id))
            .then(([{ count }]) => count);

          return {
            ...list,
            todoCount,
            otherUsers,
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
> = async ({ id: listId, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const isMember = await getUserIsListMember(c, { listId, userId });
  if (!isMember) throw actionErrors.NO_PERMISSION;

  const [list] = await db
    .update(List)
    .set(data)
    .where(eq(List.id, listId))
    .returning({ id: List.id, name: List.name });

  if (!list) throw actionErrors.NOT_FOUND;
  invalidateListUsers(c, listId);
  return list;
};

const create: ActionHandler<
  typeof listInputs.create,
  ListSelectShallow
> = async ({ name }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [list] = await db
    .insert(List)
    .values({ name })
    .returning({ id: List.id, name: List.name });

  await db.insert(ListUser).values({
    listId: list.id,
    userId,
    isPending: false,
  });

  invalidateListUsers(c, list.id);
  return list;
};

const remove: ActionHandler<typeof listInputs.remove, null> = async (
  { id: listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const isMember = await getUserIsListMember(c, { listId, userId });
  if (!isMember) throw actionErrors.NO_PERMISSION;

  const [result] = await db.delete(List).where(eq(List.id, listId)).returning();
  if (!result) throw actionErrors.NOT_FOUND;

  invalidateListUsers(c, listId);
  return null;
};

const listHandlers = { getAll, get, update, create, remove };
export default listHandlers;
