import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, Todo, List, ListUser } from "@/db/schema";
import { eq, and, desc, inArray, or } from "drizzle-orm";
import type { TodoSelect, TodoSelectShallow } from "@/lib/types";
import {
  isAuthorized,
  invalidateUsers,
  getAllTodoUsers,
  getListUsers,
  getAllUserTodos,
} from "../helpers";

import actionErrors from "../errors";
import type todoInputs from "./todos.inputs";

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

  const filterTodos = () => {
    if (listId === null) {
      return eq(Todo.userId, userId);
    }

    if (listId === "all") {
      return or(
        and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)),
        eq(Todo.userId, userId),
      );
    }

    return eq(List.id, listId);
  };

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
    .leftJoin(List, eq(List.id, Todo.listId))
    .innerJoin(User, eq(User.id, Todo.userId))
    .where(filterTodos())
    .orderBy(desc(Todo.createdAt))
    .then((data) =>
      data.map((todo) => ({ ...todo, isAuthor: todo.author.id === userId })),
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

  invalidateUsers(await getAllTodoUsers(c, todo.id));
  return todo;
};

const update: ActionHandler<
  typeof todoInputs.update,
  TodoSelectShallow
> = async ({ id, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const users = await getAllTodoUsers(c, id);

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
  const users = await getAllTodoUsers(c, id);

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

  // inbox
  if (!listId) {
    await db.delete(Todo).where(eq(Todo.userId, userId));
    return null;
  }

  // all
  if (listId === "all") {
    const allTodos = await getAllUserTodos(c, userId);
    await db.delete(Todo).where(inArray(Todo.id, allTodos));
    return null;
  }

  await db
    .delete(Todo)
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  return null;
};

const uncheckCompleted: ActionHandler<
  typeof todoInputs.uncheckCompleted,
  null
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  // inbox
  if (!listId) {
    await db
      .update(Todo)
      .set({ isCompleted: false })
      .where(eq(Todo.userId, userId));
    return null;
  }

  // all
  if (listId === "all") {
    const allTodos = await getAllUserTodos(c, userId);
    await db
      .update(Todo)
      .set({ isCompleted: false })
      .where(inArray(Todo.id, allTodos));
    return null;
  }

  await db
    .update(Todo)
    .set({ isCompleted: false })
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  return null;
};

const todoHanders = {
  get,
  create,
  update,
  remove,
  removeCompleted,
  uncheckCompleted,
};
export default todoHanders;
