import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, Todo, List, ListUser } from "@/db/schema";
import { eq, and, desc, or, like, inArray } from "drizzle-orm";
import type { TodoSelect } from "@/lib/types";
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

  const userLists = await db
    .select({ listId: ListUser.listId })
    .from(ListUser)
    .where(eq(ListUser.userId, reqUserId))
    .then((rows) => rows.map(({ listId }) => listId));

  const searchTerm = `%${search}%`;
  const searchQuery = or(
    like(Todo.text, searchTerm),
    like(List.name, searchTerm),
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
      listId: Todo.listId,
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
        inArray(Todo.listId, userLists),
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

export const getAll: ActionHandler<
  typeof todoInputs.getAll,
  TodoSelect[]
> = async ({ listId }, c) => {
  return getTodos(c, { listId });
};

export const search: ActionHandler<
  typeof todoInputs.search,
  TodoSelect[]
> = async ({ search }, c) => {
  return getTodos(c, { search });
};

export const create: ActionHandler<
  typeof todoInputs.create,
  TodoSelect
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const { listId } = data;

  await ensureListMember(c, { listId, userId });
  const [{ id: todoId }] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning();
  await invalidateListUsers(c, listId);

  const [todo] = await getTodos(c, { todoId });
  return todo;
};

export const update: ActionHandler<
  typeof todoInputs.update,
  TodoSelect
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

  await invalidateListUsers(c, updated.listId);
  if (currentTodo.listId !== updated.listId)
    await invalidateListUsers(c, currentTodo.listId);

  const [todo] = await getTodos(c, { todoId: id });
  return todo;
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

  if (!currentTodo) throw actionErrors.NOT_FOUND;

  await ensureListMember(c, { listId: currentTodo.listId, userId });

  await db.delete(Todo).where(eq(Todo.id, id));
  await invalidateListUsers(c, currentTodo.listId);
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
