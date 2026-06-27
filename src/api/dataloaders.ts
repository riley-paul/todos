import { type ActionAPIContext } from "astro:actions";
import { createDb } from "@/db";
import * as tables from "@/db/schema";
import { and, count, eq, inArray, ne } from "drizzle-orm";
import { ensureAuthorized } from "./helpers";
import type { UserSelect } from "@/lib/types";

export const getListTodoCount = async (
  c: ActionAPIContext,
  listIds: string[],
): Promise<Record<string, number>> => {
  const db = createDb(c.locals.env);

  const counts = await db
    .select({ listId: tables.Todo.listId, count: count() })
    .from(tables.Todo)
    .where(
      and(
        inArray(tables.Todo.listId, listIds),
        eq(tables.Todo.isCompleted, false),
      ),
    )
    .groupBy(tables.Todo.listId);

  const todoCount: Record<string, number> = {};
  counts.forEach(({ listId, count }) => {
    todoCount[listId] = count;
  });

  return todoCount;
};

export const getListOtherUsers = async (
  c: ActionAPIContext,
  listIds: string[],
): Promise<Record<string, UserSelect[]>> => {
  const db = createDb(c.locals.env);
  const userId = ensureAuthorized(c).id;

  const otherUsers = await db
    .selectDistinct({
      listId: tables.ListUser.listId,
      id: tables.User.id,
      name: tables.User.name,
      email: tables.User.email,
      avatarUrl: tables.User.avatarUrl,
    })
    .from(tables.ListUser)
    .innerJoin(tables.User, eq(tables.User.id, tables.ListUser.userId))
    .where(
      and(
        inArray(tables.ListUser.listId, listIds),
        eq(tables.ListUser.isPending, false),
        ne(tables.ListUser.userId, userId),
      ),
    );

  const otherUsersByList: Record<string, UserSelect[]> = {};
  otherUsers.forEach((user) => {
    if (!otherUsersByList[user.listId]) otherUsersByList[user.listId] = [];
    otherUsersByList[user.listId].push({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });
  });

  return otherUsersByList;
};
