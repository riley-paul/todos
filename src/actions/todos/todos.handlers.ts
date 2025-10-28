import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, Todo, List, ListUser } from "@/db/schema";
import { eq, and, desc, or, like } from "drizzle-orm";
import type { TodoSelect, TodoSelectShallow } from "@/lib/types";
import {
  ensureAuthorized,
  invalidateListUsers,
  ensureListMember,
} from "../helpers";

import * as todoInputs from "./todos.inputs";
import actionErrors from "../errors";

const getTodos = async (
  c: ActionAPIContext,
  filters: Partial<{
    todoId: string;
    listId: string;
    userId: string;
    search: string;
  }> = {},
): Promise<TodoSelect[]> => {
  const db = createDb(c.locals.runtime.env);
  const reqUserId = ensureAuthorized(c).id;

  const { todoId, listId, userId, search } = filters;

  const searchTerm = `%${search}%`;
  const searchQuery = or(
    like(Todo.text, searchTerm),
    like(List.name, searchTerm),
    like(User.name, searchTerm),
    like(User.email, searchTerm),
  );

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
    .innerJoin(List, eq(List.id, Todo.listId))
    .innerJoin(User, eq(User.id, Todo.userId))
    .where(
      and(
        todoId ? eq(Todo.id, todoId) : undefined,
        listId ? eq(Todo.listId, listId) : undefined,
        userId ? eq(Todo.userId, userId) : undefined,
        search ? searchQuery : undefined,
      ),
    )
    .orderBy(desc(Todo.createdAt))
    .then((data) =>
      data.map((todo) => ({ ...todo, isAuthor: todo.author.id === reqUserId })),
    );
  return todos;
};

export const get: ActionHandler<typeof todoInputs.get, TodoSelect[]> = async (
  { listId },
  c,
) => {
  return getTodos(c, { listId });
};

export const create: ActionHandler<
  typeof todoInputs.create,
  TodoSelectShallow
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const { listId } = data;

  if (listId !== undefined) {
    await ensureListMember(c, { listId, userId });
  }

  const [todo] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning();

  if (listId) await invalidateListUsers(c, listId);
  return todo;
};

export const update: ActionHandler<
  typeof todoInputs.update,
  TodoSelectShallow
> = async ({ id, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [currentTodo] = await db
    .select({ listId: Todo.listId })
    .from(Todo)
    .where(eq(Todo.id, id))
    .limit(1);
  if (!currentTodo) throw actionErrors.NOT_FOUND;

  if (data.listId !== undefined) {
    // ensure the user is a member of both the current and new list
    await ensureListMember(c, { listId: currentTodo.listId, userId });
    await ensureListMember(c, { listId: data.listId, userId });
  }

  const [updated] = await db
    .update(Todo)
    .set(data)
    .where(and(eq(Todo.id, id)))
    .returning();

  if (updated.listId) await invalidateListUsers(c, updated.listId);
  if (currentTodo.listId !== updated.listId && currentTodo.listId)
    await invalidateListUsers(c, currentTodo.listId);
  return updated;
};

export const remove: ActionHandler<typeof todoInputs.remove, null> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const [currentTodo] = await db
    .select({ listId: Todo.listId })
    .from(Todo)
    .where(eq(Todo.id, id))
    .limit(1);

  await ensureListMember(c, { listId: currentTodo.listId, userId });

  await db.delete(Todo).where(eq(Todo.id, id));
  if (currentTodo.listId) await invalidateListUsers(c, currentTodo.listId);
  return null;
};

export const removeCompleted: ActionHandler<
  typeof todoInputs.removeCompleted,
  null
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  await db
    .delete(Todo)
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  await invalidateListUsers(c, listId);
  return null;
};

export const uncheckCompleted: ActionHandler<
  typeof todoInputs.uncheckCompleted,
  null
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  await ensureListMember(c, { listId, userId });

  await db
    .update(Todo)
    .set({ isCompleted: false })
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  await invalidateListUsers(c, listId);
  return null;
};
