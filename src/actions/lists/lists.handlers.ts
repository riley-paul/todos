import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import type { ListSelect, UserSelect } from "@/lib/types";
import {
  ensureListMember,
  invalidateListUsers,
  ensureAuthorized,
} from "../helpers";
import { createDb } from "@/db";
import { List, ListUser, Todo, User } from "@/db/schema";
import { and, asc, count, desc, eq, like, not, or, sql } from "drizzle-orm";
import actionErrors from "../errors";
import * as listInputs from "./lists.inputs";
import { LIST_SEPARATOR_ID } from "@/lib/constants";

const getOtherListUsers = async (
  c: ActionAPIContext,
  listId: string,
): Promise<UserSelect[]> => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

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
        eq(ListUser.listId, listId),
        eq(ListUser.isPending, false),
        not(eq(ListUser.userId, userId)),
      ),
    );
  return otherUsers;
};

const getListTodoCount = async (
  c: ActionAPIContext,
  listId: string,
): Promise<number> => {
  const db = createDb(c.locals.runtime.env);

  const [{ count: todoCount }] = await db
    .select({ count: count() })
    .from(Todo)
    .where(and(eq(Todo.listId, listId), eq(Todo.isCompleted, false)));

  return todoCount;
};

const getLists = async (
  c: ActionAPIContext,
  filters: Partial<{
    listId: string;
    search: string;
  }> = {},
): Promise<ListSelect[]> => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const { listId, search } = filters;

  const searchTerm = `%${search}%`;
  const searchQuery = or(like(List.name, searchTerm));

  const lists: ListSelect[] = await db
    .selectDistinct({
      id: List.id,
      name: List.name,
      isPending: ListUser.isPending,
      show: ListUser.show,
      order: ListUser.order,
    })
    .from(List)
    .innerJoin(ListUser, eq(ListUser.listId, List.id))
    .orderBy(desc(ListUser.show), asc(ListUser.order), asc(List.createdAt))
    .where(
      and(
        eq(ListUser.userId, userId),
        listId ? eq(List.id, listId) : undefined,
        search ? searchQuery : undefined,
      ),
    )
    .then((lists) =>
      Promise.all(
        lists.map(async (list) => {
          const [otherUsers, todoCount] = await Promise.all([
            getOtherListUsers(c, list.id),
            getListTodoCount(c, list.id),
          ]);
          return { ...list, todoCount, otherUsers };
        }),
      ),
    );

  return lists;
};

export const getAll: ActionHandler<
  typeof listInputs.getAll,
  ListSelect[]
> = async (_, c) => {
  return getLists(c);
};

export const get: ActionHandler<
  typeof listInputs.get,
  ListSelect | null
> = async ({ listId }, c) => {
  const [list] = await getLists(c, { listId });
  if (!list) return null;
  return list;
};

export const search: ActionHandler<
  typeof listInputs.search,
  ListSelect[]
> = async ({ search }, c) => {
  return getLists(c, { search });
};

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
    .returning({ id: List.id, name: List.name });

  if (!list) throw actionErrors.NOT_FOUND;

  await invalidateListUsers(c, listId);

  const [updatedList] = await getLists(c, { listId });
  return updatedList;
};

export const create: ActionHandler<
  typeof listInputs.create,
  ListSelect
> = async ({ name }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [list] = await db
    .insert(List)
    .values({ name })
    .returning({ id: List.id });

  await db.insert(ListUser).values({
    listId: list.id,
    userId,
    isPending: false,
  });

  await invalidateListUsers(c, list.id);

  const [newList] = await getLists(c, { listId: list.id });
  return newList;
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

export const updateSortShow: ActionHandler<
  typeof listInputs.updateSortShow,
  ListSelect[]
> = async ({ listIds }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const separatorIdx = listIds.indexOf(LIST_SEPARATOR_ID);

  if (listIds.length === 0) return getLists(c);

  // Build CASE WHEN expressions dynamically
  const orderCase = sql.join(
    listIds.map((listId, idx) => sql`WHEN ${listId} THEN ${idx}`),
    sql` `,
  );

  const showCase = sql.join(
    listIds.map(
      (listId, idx) =>
        sql`WHEN ${listId} THEN ${
          separatorIdx === -1 || idx < separatorIdx ? 1 : 0
        }`,
    ),
    sql` `,
  );

  await db.run(sql`
     UPDATE ${ListUser}
     SET
       "order" = CASE "listId" ${orderCase} END,
       "show" = CASE "listId" ${showCase} END
     WHERE "userId" = ${userId}
       AND "listId" IN (${sql.join(listIds, sql`, `)});
   `);

  return getLists(c);
};
