import type { AppBindings } from "@/server/lib/types";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { List, ListShare, Todo } from "@/db/schema";
import { eq, or, and, ne, isNull } from "drizzle-orm";
import InvalidationController from "./invalidation-controller";
import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/db";

export const filterByListShare = (userId: string) =>
  or(
    // User is the author of the list
    eq(ListShare.userId, userId),

    // User is shared on the list
    // and the share is not pending
    and(
      eq(ListShare.sharedUserId, userId),
      or(ne(ListShare.isPending, true), isNull(ListShare.isPending)),
    ),
  );

export const filterTodos = (userId: string, listId: string | null) => {
  const INBOX = and(isNull(Todo.listId), eq(Todo.userId, userId));

  if (listId === null) {
    return INBOX;
  }

  if (listId === "all") {
    return or(filterByListShare(userId), INBOX, eq(Todo.userId, userId));
  }

  return and(
    or(
      // List is shared with the user
      filterByListShare(userId),
      // User owns the list
      eq(Todo.userId, userId),
    ),
    eq(Todo.listId, listId),
  );
};

export const getListUsers = async (listId: string): Promise<string[]> => {
  const list = await db
    .select({ id: List.id, userId: List.userId })
    .from(List)
    .where(eq(List.id, listId))
    .then((rows) => rows[0]);

  if (!list) {
    throw new HTTPException(HttpStatusCodes.NOT_FOUND);
  }

  const shares = await db
    .select({ sharedUserId: ListShare.sharedUserId })
    .from(ListShare)
    .where(and(eq(ListShare.listId, listId), eq(ListShare.isPending, false)));

  return [list.userId, ...shares.map((share) => share.sharedUserId)];
};

export const getTodoUsers = async (todoId: string): Promise<string[]> => {
  const todo = await db
    .select({ id: Todo.id, listId: Todo.listId, userId: Todo.userId })
    .from(Todo)
    .where(eq(Todo.id, todoId))
    .then((rows) => rows[0]);

  if (!todo) {
    throw new HTTPException(HttpStatusCodes.NOT_FOUND);
  }

  if (!todo.listId) {
    return [todo.userId];
  }

  return await getListUsers(todo.listId);
};

export const isAuthorized = (c: Context<AppBindings>) => {
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(HttpStatusCodes.FORBIDDEN);
  }
  return user;
};

export const invalidateUsers = (userIds: string[]) => {
  InvalidationController.getInstance().invalidateKey(userIds);
};
