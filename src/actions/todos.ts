import { defineAction, z } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, db, eq, like, Todo } from "astro:db";

import { v4 as uuid } from "uuid";

export const getTodos = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const todos = db.select().from(Todo).where(eq(Todo.userId, userId));
    return todos;
  },
});

export const getHashtags = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const hashtags = await db
      .select({ text: Todo.text })
      .from(Todo)
      .where(
        and(
          eq(Todo.isDeleted, false),
          eq(Todo.userId, userId),
          like(Todo.text, "%#%"),
        ),
      )
      .then((rows) => rows.map((row) => row.text))
      .then((texts) =>
        texts.reduce((acc, val) => {
          const matches = val.match(/#[a-zA-Z0-9]+/g);
          if (matches) {
            matches.forEach((match) => {
              acc.add(match);
            });
          }
          return acc;
        }, new Set<string>()),
      )
      .then((set) => Array.from(set))
      .then((arr) => arr.map((text) => text.replace("#", "")));

    return hashtags;
  },
});

export const createTodo = defineAction({
  input: z.object({
    text: z.string(),
  }),
  handler: async (input, c) => {
    const userId = isAuthorized(c).id;
    const todo = await db
      .insert(Todo)
      .values({ ...input, userId, id: uuid() })
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
    return todo;
  },
});
