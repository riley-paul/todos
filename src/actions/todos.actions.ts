import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import { zTodoSelect, type TodoSelect } from "@/lib/types";
import * as tables from "@/db/schema";
import { z } from "astro/zod";
import { and, eq } from "drizzle-orm";

export const populate = defineAction({
  handler: async (_, c): Promise<TodoSelect[]> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;
    const listIds = await db.query.ListUser.findMany({
      where: { userId, isPending: false },
    }).then((uls) => uls.map((ul) => ul.listId));

    const todos = await db.query.Todo.findMany({
      where: { listId: { in: listIds } },
    });

    return todos;
  },
});

export const create = defineAction({
  input: zTodoSelect.omit({ userId: true }),
  handler: async (input, c): Promise<TodoSelect> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId: input.listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this list",
      });
    }

    const [todo] = await db
      .insert(tables.Todo)
      .values({ ...input, userId })
      .returning();

    return todo;
  },
});

export const update = defineAction({
  input: z.object({
    todoId: z.string(),
    data: zTodoSelect
      .pick({
        isCompleted: true,
        text: true,
        listId: true,
      })
      .partial(),
  }),
  handler: async ({ data, todoId }, c): Promise<TodoSelect> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const originalTodo = await db.query.Todo.findFirst({
      where: { id: { eq: todoId } },
    });

    if (!originalTodo) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Todo not found",
      });
    }

    const listUser = await db.query.ListUser.findFirst({
      where: { listId: originalTodo.listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this todo",
      });
    }

    if (data.listId !== originalTodo.listId) {
      const newListUser = await db.query.ListUser.findFirst({
        where: { listId: data.listId, userId, isPending: false },
      });

      if (!newListUser) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "You do not have access to the new list",
        });
      }
    }

    const [updated] = await db
      .update(tables.Todo)
      .set(data)
      .where(eq(tables.Todo.id, todoId))
      .returning();

    return updated;
  },
});

export const remove = defineAction({
  input: z.object({
    todoId: z.string(),
  }),
  handler: async ({ todoId }, c): Promise<string> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const originalTodo = await db.query.Todo.findFirst({
      where: { id: { eq: todoId } },
    });

    if (!originalTodo) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Todo not found",
      });
    }

    const listUser = await db.query.ListUser.findFirst({
      where: { listId: originalTodo.listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this todo",
      });
    }

    const [deleted] = await db
      .delete(tables.Todo)
      .where(eq(tables.Todo.id, todoId))
      .returning();
    
    return deleted.id;
  },
});

export const deleteCompleted = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<boolean> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this list",
      });
    }

    await db
      .delete(tables.Todo)
      .where(
        and(eq(tables.Todo.listId, listId), eq(tables.Todo.isCompleted, true)),
      );
    return true;
  },
});

export const uncheckCompleted = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<boolean> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const listUser = await db.query.ListUser.findFirst({
      where: { listId, userId, isPending: false },
    });

    if (!listUser) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this list",
      });
    }

    await db
      .update(tables.Todo)
      .set({ isCompleted: false })
      .where(
        and(eq(tables.Todo.listId, listId), eq(tables.Todo.isCompleted, true)),
      );
    return true;
  },
});
