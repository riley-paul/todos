import { ActionError, defineAction } from "astro:actions";
import { and, db, desc, eq, ListShare, Todo, User } from "astro:db";

import { v4 as uuid } from "uuid";
import { z } from "zod";
import type { TodoSelect } from "@/lib/types";
import { isAuthorized, filterTodos, invalidateUsers } from "./helpers";

const getTodoUsers = async (todoId: string): Promise<string[]> => {
  const todo = await db
    .select()
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

  const listShares = await db
    .select()
    .from(ListShare)
    .where(eq(ListShare.listId, todo.listId));

  return [todo.userId, ...listShares.map((share) => share.sharedUserId)];
};

export const getTodos = defineAction({
  input: z.object({
    listId: z.union([z.string(), z.null(), z.undefined()]),
  }),
  handler: async ({ listId }, c) => {
    const userId = isAuthorized(c).id;
    const todos: TodoSelect[] = await db
      .selectDistinct({
        id: Todo.id,
        text: Todo.text,
        isCompleted: Todo.isCompleted,
        author: {
          id: User.id,
          name: User.name,
          email: User.email,
          avatarUrl: User.avatarUrl,
        },
      })
      .from(Todo)
      .leftJoin(ListShare, eq(ListShare.listId, Todo.listId))
      .innerJoin(User, eq(User.id, Todo.userId))
      .where(filterTodos(userId, listId))
      .orderBy(desc(Todo.createdAt))
      .then((rows) =>
        rows.map((row) => ({ ...row, isAuthor: row.author.id === userId })),
      );

    return todos;
  },
});

export const createTodo = defineAction({
  input: z.object({
    data: z.custom<Partial<typeof Todo.$inferInsert>>(),
  }),
  handler: async ({ data }, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .insert(Todo)
      .values({ id: uuid(), text: "", ...data, userId })
      .returning()
      .then((rows) => rows[0]);

    invalidateUsers(await getTodoUsers(todo.id));
    return todo;
  },
});

export const updateTodo = defineAction({
  input: z.object({
    id: z.string(),
    data: z
      .object({
        text: z.string(),
        isCompleted: z.boolean(),
        listId: z.string(),
      })
      .partial(),
  }),
  handler: async ({ id, data }, c) => {
    const userId = isAuthorized(c).id;
    const users = await getTodoUsers(id);

    if (!users.includes(userId)) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not allowed to update this task",
      });
    }

    const todo = await db
      .update(Todo)
      .set({ ...data, userId })
      .where(and(eq(Todo.id, id), filterTodos(userId, undefined)))
      .returning()
      .then((rows) => rows[0]);

    invalidateUsers(users);
    return todo;
  },
});

export const deleteTodo = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const users = await getTodoUsers(id);

    if (!users.includes(userId)) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not allowed to delete this task",
      });
    }

    await db.delete(Todo).where(eq(Todo.id, id));

    invalidateUsers(users);
    return true;
  },
});
