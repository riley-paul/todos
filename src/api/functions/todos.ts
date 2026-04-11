import { createDb } from "@/db";
import { User, Todo, List, ListUser } from "@/db/schema";
import { eq, and, desc, or, like, inArray } from "drizzle-orm";
import type { ApiFunction, TodoSelect } from "@/lib/types";
import { invalidateListUsers, ensureListMember } from "../helpers";

import * as todoInputs from "../schema/todos";
import actionErrors from "../errors";
import { env } from "cloudflare:workers";

const getTodos = async (
  reqUserId: string,
  filters: Partial<{
    todoId: string;
    listId: string;
    userId: string;
    search: string;
  }> = {},
): Promise<TodoSelect[]> => {
  const db = createDb(env);

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

export const getAll: ApiFunction<
  typeof todoInputs.getAll,
  TodoSelect[]
> = async ({ listId, userId }) => {
  return getTodos(userId, { listId });
};

export const search: ApiFunction<
  typeof todoInputs.search,
  TodoSelect[]
> = async ({ search, userId }) => {
  return getTodos(userId, { search });
};

export const create: ApiFunction<
  typeof todoInputs.create,
  TodoSelect
> = async ({ data, userId }) => {
  const db = createDb(env);

  const { listId } = data;

  await ensureListMember({ listId, userId });
  const [{ id: todoId }] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning();
  await invalidateListUsers({ listId, userId });

  const [todo] = await getTodos(userId, { todoId });
  return todo;
};

export const update: ApiFunction<
  typeof todoInputs.update,
  TodoSelect
> = async ({ id, data, userId }) => {
  const db = createDb(env);

  const [currentTodo] = await db
    .select({ listId: Todo.listId })
    .from(Todo)
    .where(eq(Todo.id, id))
    .limit(1);
  if (!currentTodo) throw actionErrors.NOT_FOUND;

  if (data.listId !== undefined) {
    // ensure the user is a member of both the current and new list
    await ensureListMember({ listId: currentTodo.listId, userId });
    await ensureListMember({ listId: data.listId, userId });
  }

  const [updated] = await db
    .update(Todo)
    .set(data)
    .where(and(eq(Todo.id, id)))
    .returning();

  await invalidateListUsers({ listId: updated.listId, userId });
  if (currentTodo.listId !== updated.listId)
    await invalidateListUsers({ listId: currentTodo.listId, userId });

  const [todo] = await getTodos(userId, { todoId: id });
  return todo;
};

export const remove: ApiFunction<typeof todoInputs.remove, null> = async ({
  id,
  userId,
}) => {
  const db = createDb(env);

  const [currentTodo] = await db
    .select({ listId: Todo.listId })
    .from(Todo)
    .where(eq(Todo.id, id))
    .limit(1);

  if (!currentTodo) throw actionErrors.NOT_FOUND;

  await ensureListMember({ listId: currentTodo.listId, userId });

  await db.delete(Todo).where(eq(Todo.id, id));
  await invalidateListUsers({ listId: currentTodo.listId, userId });
  return null;
};

export const removeCompleted: ApiFunction<
  typeof todoInputs.removeCompleted,
  null
> = async ({ listId, userId }) => {
  const db = createDb(env);

  await ensureListMember({ listId, userId });

  await db
    .delete(Todo)
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  await invalidateListUsers({ listId, userId });
  return null;
};

export const uncheckCompleted: ApiFunction<
  typeof todoInputs.uncheckCompleted,
  null
> = async ({ listId, userId }) => {
  const db = createDb(env);

  await ensureListMember({ listId, userId });

  await db
    .update(Todo)
    .set({ isCompleted: false })
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  await invalidateListUsers({ listId, userId });
  return null;
};
