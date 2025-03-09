import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ActionError } from "astro:actions";
import InvalidationController from "@/lib/invalidation-controller";
import db from "@/db";
import { List, ListShare, Todo } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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
