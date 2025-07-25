import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, Todo, List, ListUser } from "@/db/schema";
import { eq, and, desc, inArray, or, isNull } from "drizzle-orm";
import type { TodoSelect, TodoSelectShallow } from "@/lib/types";
import {
  ensureAuthorized,
  invalidateListUsers,
  ensureListMember,
} from "../helpers";

import type todoInputs from "./todos.inputs";
import actionErrors from "../errors";

const getAllUserTodos = async (context: ActionAPIContext, userId: string) => {
  const db = createDb(context.locals.runtime.env);
  return db
    .select({ id: Todo.id })
    .from(Todo)
    .leftJoin(ListUser, eq(ListUser.listId, Todo.listId))
    .where(
      or(
        and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)),
        eq(Todo.userId, userId),
      ),
    )
    .then((ids) => ids.map(({ id }) => id));
};

const get: ActionHandler<typeof todoInputs.get, TodoSelect[]> = async (
  { listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const userLists =
    listId === "all"
      ? await db
          .select({ listId: ListUser.listId })
          .from(ListUser)
          .where(
            and(eq(ListUser.userId, userId), eq(ListUser.isPending, false)),
          )
          .then((data) => data.map(({ listId }) => listId))
      : [];

  const filterTodos = () => {
    switch (listId) {
      case null:
        return and(eq(Todo.userId, userId), isNull(Todo.listId));
      case "all":
        return or(inArray(Todo.listId, userLists), eq(Todo.userId, userId));
      default:
        return eq(Todo.listId, listId);
    }
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

const update: ActionHandler<
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

const remove: ActionHandler<typeof todoInputs.remove, null> = async (
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

const removeCompleted: ActionHandler<
  typeof todoInputs.removeCompleted,
  null
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  // inbox
  if (!listId) {
    await db
      .delete(Todo)
      .where(and(eq(Todo.isCompleted, true), eq(Todo.userId, userId)));
    return null;
  }

  // all
  if (listId === "all") {
    const allTodos = await getAllUserTodos(c, userId);
    await db
      .delete(Todo)
      .where(and(eq(Todo.isCompleted, true), inArray(Todo.id, allTodos)));
    // TODO: invalidate users sharing lists with the user
    return null;
  }

  await db
    .delete(Todo)
    .where(and(eq(Todo.isCompleted, true), eq(Todo.listId, listId)));
  await invalidateListUsers(c, listId);
  return null;
};

const uncheckCompleted: ActionHandler<
  typeof todoInputs.uncheckCompleted,
  null
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  // inbox
  if (!listId) {
    await db
      .update(Todo)
      .set({ isCompleted: false })
      .where(eq(Todo.userId, userId));
    // TODO: invalidate users sharing lists with the user
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
  await invalidateListUsers(c, listId);
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
