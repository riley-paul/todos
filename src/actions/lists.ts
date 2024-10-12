import { ActionError, defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import {
  and,
  count,
  db,
  desc,
  eq,
  List,
  ListShare,
  or,
  Todo,
  User,
} from "astro:db";
import { z } from "zod";
import type { ListSelect, ListShareSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";

export const getList = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const list = await db
      .select()
      .from(List)
      .leftJoin(ListShare, eq(ListShare.listId, List.id))
      .where(
        and(
          eq(List.id, id),
          or(eq(List.userId, userId), eq(ListShare.sharedUserId, userId)),
        ),
      )
      .then((rows) => rows[0]);

    if (!list) {
      throw new ActionError({
        message: "List not found",
        code: "NOT_FOUND",
      });
    }

    const shares: ListShareSelect[] = await db
      .select()
      .from(ListShare)
      .innerJoin(User, eq(User.id, ListShare.sharedUserId))
      .where(eq(ListShare.listId, id))
      .then((rows) =>
        rows.map((row) => ({ ...row.ListShare, user: row.User })),
      );

    const listAdmin = await db
      .select()
      .from(User)
      .where(eq(User.id, list.List.userId))
      .then((rows) => rows[0]);

    return {
      ...list.List,
      shares,
      isAdmin: list.List.userId === userId,
      listAdmin,
    };
  },
});

export const getLists = defineAction({
  handler: async (_, c): Promise<ListSelect[]> => {
    const userId = isAuthorized(c).id;

    const lists = await db
      .select()
      .from(List)
      .leftJoin(ListShare, eq(ListShare.listId, List.id))
      .leftJoin(User, eq(User.id, ListShare.userId))
      .where(or(eq(List.userId, userId), eq(ListShare.sharedUserId, userId)))
      .orderBy(desc(List.createdAt))
      .then((rows) => {
        const ids = new Set<string>();
        return rows
          .filter((row) => {
            if (ids.has(row.List.id)) return false;
            ids.add(row.List.id);
            return true;
          })
          .map((list) => ({
            ...list.List,
            isAdmin: list.List.userId !== userId,
            isShared: list.ListShare !== null,
            listAdmin: list.User,
          }));
      })
      .then((lists) =>
        Promise.all(
          lists.map(async (list) => ({
            ...list,
            count: await db
              .select({ count: count() })
              .from(Todo)
              .where(and(eq(Todo.listId, list.id), eq(Todo.userId, userId)))
              .then((rows) => rows[0].count ?? 0),
          })),
        ),
      );

    return lists;
  },
});

export const updateList = defineAction({
  input: z.object({
    id: z.string(),
    data: z.custom<Partial<ListSelect>>(),
  }),
  handler: async ({ id, data }, c) => {
    const userId = isAuthorized(c).id;
    const result = await db
      .update(List)
      .set(data)
      .where(and(eq(List.id, id), eq(List.userId, userId)))
      .returning()
      .then((rows) => rows[0]);
    return result;
  },
});

export const createList = defineAction({
  input: z.object({ name: z.string() }),
  handler: async ({ name }, c) => {
    const userId = isAuthorized(c).id;
    const result = await db
      .insert(List)
      .values({ id: uuid(), name, userId })
      .returning()
      .then((rows) => rows[0]);
    return result;
  },
});

export const deleteList = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    await db
      .delete(Todo)
      .where(and(eq(Todo.listId, id), eq(Todo.userId, userId)));
    await db
      .delete(ListShare)
      .where(and(eq(ListShare.listId, id), eq(ListShare.userId, userId)));
    await db.delete(List).where(and(eq(List.id, id), eq(List.userId, userId)));
    return true;
  },
});
