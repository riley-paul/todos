import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, asc, db, desc, eq, like, not, or, Todo } from "astro:db";

import { v4 as uuid } from "uuid";
import { z } from "zod";

const todoUpdateSchema = z.custom<Partial<typeof Todo.$inferInsert>>();

export const getTodos = defineAction({
  input: z.object({
    tag: z.string().optional(),
  }),
  handler: async ({ tag }, c) => {
    const userId = isAuthorized(c).id;
    const todos = await db
      .select()
      .from(Todo)
      .where(
        and(
          eq(Todo.isDeleted, false),
          eq(Todo.userId, userId),
          or(
            tag ? like(Todo.text, `%#${tag}%`) : undefined,
            tag === "~" ? not(like(Todo.text, "%#%")) : undefined,
          ),
        ),
      )
      .orderBy(asc(Todo.isCompleted), desc(Todo.createdAt));
    return todos;
  },
});

export const createTodo = defineAction({
  input: z.object({
    data: todoUpdateSchema,
  }),
  handler: async ({ data }, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .insert(Todo)
      .values({ id: uuid(), text: "", ...data, userId })
      .returning();
    return todo;
  },
});

export const updateTodo = defineAction({
  input: z.object({
    id: z.string(),
    data: z.custom<Partial<typeof Todo.$inferInsert>>(),
  }),
  handler: async ({ id, data }, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .update(Todo)
      .set({ ...data, userId })
      .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
      .returning()
      .then((rows) => rows[0]);
    return todo;
  },
});

export const deleteTodo = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .update(Todo)
      .set({ isDeleted: true })
      .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
      .returning()
      .then((rows) => rows[0]);
    return todo.id;
  },
});

export const undoDeleteTodo = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .update(Todo)
      .set({ isDeleted: false })
      .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
      .returning()
      .then((rows) => rows[0]);
    return todo.id;
  },
});

export const deleteCompletedTodos = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const todos = await db
      .update(Todo)
      .set({ isDeleted: true })
      .where(and(eq(Todo.isCompleted, true), eq(Todo.userId, userId)))
      .returning();
    return todos;
  },
});
