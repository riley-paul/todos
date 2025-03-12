import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ActionError } from "astro:actions";
import InvalidationController from "@/lib/server/invalidation-controller";
import db from "@/db";
import { ListShare, Todo, List } from "@/db/schema";
import { eq, or, and, ne, isNull } from "drizzle-orm";

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

export const invalidateUsers = (userIds: string[]) => {
  InvalidationController.getInstance().invalidateKey(userIds);
};

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return user;
};

export const getListUsers = async (listId: string): Promise<string[]> => {
  const list = await db
    .select({ id: List.id, userId: List.userId })
    .from(List)
    .where(eq(List.id, listId))
    .then((rows) => rows[0]);

  if (!list) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "List not found",
    });
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
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Task not found",
    });
  }

  if (!todo.listId) {
    return [todo.userId];
  }

  return await getListUsers(todo.listId);
};
