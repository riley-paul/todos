import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, Todo, ListShare, List } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import type { TodoSelect, TodoSelectShallow } from "@/lib/types";
import {
  isAuthorized,
  invalidateUsers,
  getTodoUsers,
  getListUsers,
} from "../helpers";

import actionErrors from "../errors";
import type todoInputs from "./todos.inputs";
import { filterTodos } from "../filters";

const get: ActionHandler<typeof todoInputs.get, TodoSelect[]> = async (
  { listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  if (listId && listId !== "all") {
    const listUsers = await getListUsers(c, listId);
    if (!listUsers.includes(userId)) {
      throw actionErrors.NO_PERMISSION;
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

const create: ActionHandler<
  typeof todoInputs.create,
  TodoSelectShallow
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  if (data.listId) {
    const listUsers = await getListUsers(c, data.listId);
    if (!listUsers.includes(userId)) {
      throw actionErrors.NO_PERMISSION;
    }
  }

  const [todo] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning();

  invalidateUsers(await getTodoUsers(c, todo.id));
  return todo;
};

const update: ActionHandler<
  typeof todoInputs.update,
  TodoSelectShallow
> = async ({ id, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const users = await getTodoUsers(c, id);

  if (!users.includes(userId)) {
    throw actionErrors.NO_PERMISSION;
  }

  const [todo] = await db
    .update(Todo)
    .set(data)
    .where(and(eq(Todo.id, id)))
    .returning();

  invalidateUsers(users);
  return todo;
};

const remove: ActionHandler<typeof todoInputs.remove, null> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const users = await getTodoUsers(c, id);

  if (!users.includes(userId)) {
    throw actionErrors.NO_PERMISSION;
  }

  await db.delete(Todo).where(eq(Todo.id, id));

  invalidateUsers(users);
  return null;
};

const removeCompleted: ActionHandler<
  typeof todoInputs.removeCompleted,
  null
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
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

const todoHanders = { get, create, update, remove, removeCompleted };
export default todoHanders;
