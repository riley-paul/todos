import type { ApiFunction, ListSelect, UserSelect } from "@/lib/types";
import { ensureListMember, invalidateListUsers } from "../helpers";
import { createDb } from "@/db";
import { List, ListUser, Todo, User } from "@/db/schema";
import { and, asc, count, desc, eq, like, not, or, sql } from "drizzle-orm";
import actionErrors from "../errors";
import * as listInputs from "../schema/lists";
import { LIST_SEPARATOR_ID } from "@/lib/constants";
import { env } from "cloudflare:workers";

const getOtherListUsers = async (
  userId: string,
  listId: string,
): Promise<UserSelect[]> => {
  const db = createDb(env);

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

const getListTodoCount = async (listId: string): Promise<number> => {
  const db = createDb(env);

  const [{ count: todoCount }] = await db
    .select({ count: count() })
    .from(Todo)
    .where(and(eq(Todo.listId, listId), eq(Todo.isCompleted, false)));

  return todoCount;
};

const getLists = async (
  userId: string,
  filters: Partial<{
    listId: string;
    search: string;
  }> = {},
): Promise<ListSelect[]> => {
  const db = createDb(env);

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
            getOtherListUsers(userId, list.id),
            getListTodoCount(list.id),
          ]);
          return { ...list, todoCount, otherUsers };
        }),
      ),
    );

  return lists;
};

export const getAll: ApiFunction<
  typeof listInputs.getAll,
  ListSelect[]
> = async ({ userId }) => {
  return getLists(userId);
};

export const get: ApiFunction<
  typeof listInputs.get,
  ListSelect | null
> = async ({ listId, userId }) => {
  const [list] = await getLists(userId, { listId });
  if (!list) return null;
  return list;
};

export const search: ApiFunction<
  typeof listInputs.search,
  ListSelect[]
> = async ({ search, userId }) => {
  return getLists(userId, { search });
};

export const update: ApiFunction<
  typeof listInputs.update,
  ListSelect
> = async ({ id: listId, data, userId }) => {
  const db = createDb(env);

  await ensureListMember({ listId, userId });

  const [list] = await db
    .update(List)
    .set(data)
    .where(eq(List.id, listId))
    .returning({ id: List.id, name: List.name });

  if (!list) throw actionErrors.NOT_FOUND;

  await invalidateListUsers({ listId, userId });

  const [updatedList] = await getLists(userId, { listId });
  return updatedList;
};

export const create: ApiFunction<
  typeof listInputs.create,
  ListSelect
> = async ({ name, userId }) => {
  const db = createDb(env);

  const [list] = await db
    .insert(List)
    .values({ name })
    .returning({ id: List.id });

  await db.insert(ListUser).values({
    listId: list.id,
    userId,
    isPending: false,
  });

  await invalidateListUsers({ listId: list.id, userId });

  const [newList] = await getLists(userId, { listId: list.id });
  return newList;
};

export const remove: ApiFunction<typeof listInputs.remove, null> = async ({
  id: listId,
  userId,
}) => {
  const db = createDb(env);

  await ensureListMember({ listId, userId });

  const [result] = await db.delete(List).where(eq(List.id, listId)).returning();
  if (!result) throw actionErrors.NOT_FOUND;

  await invalidateListUsers({ listId, userId });
  return null;
};

export const updateSortShow: ApiFunction<
  typeof listInputs.updateSortShow,
  ListSelect[]
> = async ({ listIds, userId }) => {
  const db = createDb(env);

  const separatorIdx = listIds.indexOf(LIST_SEPARATOR_ID);

  if (listIds.length === 0) return getLists(userId);

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

  return getLists(userId);
};
