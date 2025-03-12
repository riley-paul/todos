import { ActionError, type ActionHandler } from "astro:actions";
import db from "@/db";
import { User, Todo, ListShare, List } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import type { TodoSelect, TodoSelectShallow } from "@/lib/types";
import {
  isAuthorized,
  filterTodos,
  invalidateUsers,
  getTodoUsers,
  getListUsers,
} from "../helpers";

import * as inputs from "./todos.inputs";

export const get: ActionHandler<typeof inputs.get, TodoSelect[]> = async (
  { listId },
  c,
) => {
  const userId = isAuthorized(c).id;

  if (listId && listId !== "all") {
    const listUsers = await getListUsers(listId);
    if (!listUsers.includes(userId)) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not allowed to access this list",
      });
    }
  }

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
};

export const create: ActionHandler<
  typeof inputs.create,
  TodoSelectShallow
> = async ({ data }, c) => {
  const userId = isAuthorized(c).id;

  if (data.listId) {
    const listUsers = await getListUsers(data.listId);
    if (!listUsers.includes(userId)) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not allowed to create a task in this list",
      });
    }
  }

  const [todo] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning();

  invalidateUsers(await getTodoUsers(todo.id));
  return todo;
};

export const update: ActionHandler<
  typeof inputs.update,
  TodoSelectShallow
> = async ({ id, data }, c) => {
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
};

export const remove: ActionHandler<typeof inputs.remove, null> = async (
  { id },
  c,
) => {
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
  return null;
};

export const removeCompleted: ActionHandler<
  typeof inputs.removeCompleted,
  null
> = async ({ listId }, c) => {
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

  return null;
};
