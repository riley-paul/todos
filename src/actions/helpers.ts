import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import InvalidationController from "@/lib/server/invalidation-controller";
import { Todo, ListUser } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
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
) => {
  const db = createDb(context.locals.runtime.env);
  return db
    .select()
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.isPending, false)))
    .then((data) => data.map(({ userId }) => userId));
};

export const getAllTodoUsers = async (
  context: ActionAPIContext,
  todoId: string,
) => {
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

  return getListUsers(context, todo.listId);
};

export const getAllUserTodos = async (
  context: ActionAPIContext,
  userId: string,
) => {
  const db = createDb(context.locals.runtime.env);
  return db
    .select({ id: Todo.id })
    .from(Todo)
    .leftJoin(ListUser, eq(ListUser.listId, Todo.listId))
    .where(
      or(
        and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)),
        eq(Todo.userId, userId),
      ),
    )
    .then((ids) => ids.map(({ id }) => id));
};
