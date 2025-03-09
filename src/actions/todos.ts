import { ActionError, defineAction } from "astro:actions";
import db from "@/db";
import { User, Todo, ListShare, List } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { z } from "zod";
import type { TodoSelect } from "@/lib/types";
import {
  isAuthorized,
  filterTodos,
  invalidateUsers,
  getTodoUsers,
} from "./helpers";

const zTodoText = z.string().trim().min(1, "Todo must not be empty");

export const get = defineAction({
  input: z.object({
    listId: z.union([z.string(), z.null()]),
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
        list: {
          id: List.id,
          name: List.name,
        },
      })
      .from(Todo)
      .leftJoin(ListShare, eq(ListShare.listId, Todo.listId))
      .leftJoin(List, eq(List.id, Todo.listId))
      .innerJoin(User, eq(User.id, Todo.userId))
      .where(filterTodos(userId, listId))
      .orderBy(desc(Todo.createdAt))
      .then((rows) =>
        rows.map((row) => ({ ...row, isAuthor: row.author.id === userId })),
      );

    return todos;
  },
});

export const create = defineAction({
  input: z.object({
    id: z.string().optional(),
    listId: z
      .string()
      .nullable()
      .transform((v) => (v === "all" ? null : v)),
    text: zTodoText,
  }),
  handler: async (data, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .insert(Todo)
      .values({ ...data, userId })
      .returning()
      .then((rows) => rows[0]);

    invalidateUsers(await getTodoUsers(todo.id));
    return todo;
  },
});

export const update = defineAction({
  input: z.object({
    id: z.string(),
    data: z
      .object({
        text: zTodoText,
        isCompleted: z.boolean(),
        listId: z.string().nullable(),
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

    const [todo] = await db
      .update(Todo)
      .set(data)
      .where(and(eq(Todo.id, id)))
      .returning();

    invalidateUsers(users);
    return todo;
  },
});

export const remove = defineAction({
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

export const removeCompleted = defineAction({
  input: z.object({
    listId: z.union([z.string(), z.null()]),
  }),
  handler: async ({ listId }, c) => {
    const userId = isAuthorized(c).id;
    const todoIds = await db
      .selectDistinct({ id: Todo.id })
      .from(Todo)
      .leftJoin(ListShare, eq(ListShare.listId, Todo.listId))
      .where(and(filterTodos(userId, listId), eq(Todo.isCompleted, true)))
      .then((rows) => rows.map((row) => row.id));

    await db
      .delete(Todo)
      .where(and(eq(Todo.isCompleted, true), inArray(Todo.id, todoIds)));

    return true;
  },
});
