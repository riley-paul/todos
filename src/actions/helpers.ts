import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import InvalidationController from "@/lib/server/invalidation-controller";
import { ListShare, Todo, List, ListUser } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import actionErrors from "./errors";
import { createDb } from "@/db";

export const invalidateUsers = (userIds: string[]) => {
  InvalidationController.getInstance().invalidateKey(userIds);
};

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw actionErrors.UNAUTHORIZED;
  }
  return user;
};

export const getListUsers = async (
  context: ActionAPIContext,
  listId: string,
): Promise<string[]> => {
  const db = createDb(context.locals.runtime.env);
  const list = await db
    .select({ id: List.id, userId: List.userId })
    .from(List)
    .where(eq(List.id, listId))
    .then((rows) => rows[0]);

  if (!list) {
    throw actionErrors.NOT_FOUND;
  }

  const shares = await db
    .select({ sharedUserId: ListShare.sharedUserId })
    .from(ListShare)
    .where(and(eq(ListShare.listId, listId), eq(ListShare.isPending, false)));

  return [list.userId, ...shares.map((share) => share.sharedUserId)];
};

export const getTodoUsers = async (
  context: ActionAPIContext,
  todoId: string,
): Promise<string[]> => {
  const db = createDb(context.locals.runtime.env);
  const todo = await db
    .select({ id: Todo.id, listId: Todo.listId, userId: Todo.userId })
    .from(Todo)
    .where(eq(Todo.id, todoId))
    .then((rows) => rows[0]);

  if (!todo) {
    throw actionErrors.NOT_FOUND;
  }

  if (!todo.listId) {
    return [todo.userId];
  }

  return await getListUsers(context, todo.listId);
};

export const getAllUserTodos = async (
  context: ActionAPIContext,
  userId: string,
) => {
  const db = createDb(context.locals.runtime.env);
  const todos = await db
    .select()
    .from(Todo)
    .rightJoin(ListUser, eq(ListUser.listId, Todo.listId));
};
