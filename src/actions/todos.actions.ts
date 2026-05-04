import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import {
  zTodoSelect,
  type TodoSelect,
  type TodoSelectDetails,
} from "@/lib/types";
import * as tables from "@/db/schema";
import { z } from "astro/zod";
import { and, desc, eq, inArray, like, or } from "drizzle-orm";
import { notifyOtherListUsers } from "@/lib/realtime";

const getTodos = async (
  c: ActionAPIContext,
  filters: Partial<{
    todoId: string;
    listId: string;
    userId: string;
    search: string;
  }> = {},
): Promise<TodoSelectDetails[]> => {
  const reqUserId = ensureAuthorized(c).id;
  const db = createDb(c.locals.env);

  const { todoId, listId, userId, search } = filters;

  const userLists = await db
    .select({ listId: tables.ListUser.listId })
    .from(tables.ListUser)
    .where(eq(tables.ListUser.userId, reqUserId))
    .then((rows) => rows.map(({ listId }) => listId));

  const searchTerm = `%${search}%`;
  const searchQuery = or(
    like(tables.Todo.text, searchTerm),
    like(tables.List.name, searchTerm),
  );

  const todos: TodoSelectDetails[] = await db
    .selectDistinct({
      id: tables.Todo.id,
      text: tables.Todo.text,
      isCompleted: tables.Todo.isCompleted,
      author: {
        id: tables.User.id,
        name: tables.User.name,
        email: tables.User.email,
        avatarUrl: tables.User.avatarUrl,
      },
      userId: tables.Todo.userId,
      listId: tables.Todo.listId,
      list: {
        id: tables.List.id,
        name: tables.List.name,
      },
    })
    .from(tables.Todo)
    .innerJoin(tables.List, eq(tables.List.id, tables.Todo.listId))
    .innerJoin(tables.User, eq(tables.User.id, tables.Todo.userId))
    .where(
      and(
        inArray(tables.Todo.listId, userLists),
        todoId ? eq(tables.Todo.id, todoId) : undefined,
        listId ? eq(tables.Todo.listId, listId) : undefined,
        userId ? eq(tables.Todo.userId, userId) : undefined,
        search ? searchQuery : undefined,
      ),
    )
    .orderBy(desc(tables.Todo.createdAt));

  return todos;
};

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

export const getForList = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<TodoSelectDetails[]> => {
    return getTodos(c, { listId });
  },
});

export const create = defineAction({
  input: zTodoSelect,
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

    await notifyOtherListUsers(c, input.listId, {
      entity: "todo",
      operation: { type: "insert", data: todo },
    });

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

    const isMoved = data.listId && data.listId !== originalTodo.listId;

    if (isMoved) {
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

    await notifyOtherListUsers(c, updated.listId, {
      entity: "todo",
      operation: { type: "update", data: updated },
    });

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

    await notifyOtherListUsers(c, originalTodo.listId, {
      entity: "todo",
      operation: { type: "delete", id: todoId },
    });

    return deleted.id;
  },
});

export const deleteCompleted = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<string[]> => {
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

    const deleted = await db
      .delete(tables.Todo)
      .where(
        and(eq(tables.Todo.listId, listId), eq(tables.Todo.isCompleted, true)),
      )
      .returning();

    await notifyOtherListUsers(c, listId, {
      entity: "todo",
      operation: { type: "delete", id: deleted.map((d) => d.id) },
    });

    return deleted.map((d) => d.id);
  },
});

export const uncheckCompleted = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<TodoSelect[]> => {
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

    const updated = await db
      .update(tables.Todo)
      .set({ isCompleted: false })
      .where(
        and(eq(tables.Todo.listId, listId), eq(tables.Todo.isCompleted, true)),
      )
      .returning();

    await notifyOtherListUsers(c, listId, {
      entity: "todo",
      operation: { type: "update", data: updated },
    });

    return updated;
  },
});
