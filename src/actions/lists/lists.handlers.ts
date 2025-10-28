import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import type { ListSelect } from "@/lib/types";
import {
  ensureListMember,
  invalidateListUsers,
  ensureAuthorized,
} from "../helpers";
import { createDb } from "@/db";
import { List, ListUser, Todo, User } from "@/db/schema";
import { and, asc, count, desc, eq, not, sql } from "drizzle-orm";
import actionErrors from "../errors";
import * as listInputs from "./lists.inputs";
import { LIST_SEPARATOR_ID } from "@/lib/constants";

async function getList(
  c: ActionAPIContext,
  listId: undefined,
): Promise<ListSelect[]>;
async function getList(
  c: ActionAPIContext,
  listId: string,
): Promise<ListSelect>;
async function getList(c: ActionAPIContext, listId?: string | undefined) {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

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
      ),
    )
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
            .where(and(eq(Todo.listId, list.id), eq(Todo.isCompleted, false)))
            .then(([{ count }]) => count);

          return {
            ...list,
            todoCount,
            otherUsers,
          };
        }),
      ),
    );

  const [list] = lists;
  return listId ? list : lists;
}

export const getAll: ActionHandler<
  typeof listInputs.getAll,
  ListSelect[]
> = async (_, c) => {
  return getList(c, undefined);
};

export const get: ActionHandler<
  typeof listInputs.get,
  ListSelect | null
> = async ({ id }, c) => {
  const list = await getList(c, id);
  if (!list) return null;
  return list;
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
  return getList(c, listId);
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
  return getList(c, list.id);
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

  if (listIds.length === 0) return getList(c, undefined);

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

  return getList(c, undefined);
};
