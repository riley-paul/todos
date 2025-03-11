import type { CreateRoute, ListRoute } from "./todos.routes";
import db from "@/db";
import { List, ListShare, Todo, User, type TodoSelect } from "@/db/schema";
import type { AppRouteHandler } from "@/server/lib/types";
import { eq, desc, and } from "drizzle-orm";
import {
  filterTodos,
  getListUsers,
  getTodoUsers,
  invalidateUsers,
  isAuthorized,
} from "@/lib/server/utils";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

const getTodos = async (
  userId: string,
  listId: string | null,
  todoId?: string,
): Promise<TodoSelect[]> => {
  return db
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
    .where(
      and(
        filterTodos(userId, listId),
        todoId ? eq(Todo.id, todoId) : undefined,
      ),
    )
    .orderBy(desc(Todo.createdAt))
    .then((rows) =>
      rows.map((row) => ({ ...row, isAuthor: row.author.id === userId })),
    );
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userId = isAuthorized(c).id;
  const { listId } = c.req.valid("query");
  const todos = await getTodos(userId, listId);
  return c.json(todos);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const userId = isAuthorized(c).id;
  const data = c.req.valid("json");

  const listUsers = data.listId ? await getListUsers(data.listId) : [userId];

  if (!listUsers.includes(userId)) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN,
    );
  }

  const [result] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning({ id: Todo.id, listId: Todo.listId });

  invalidateUsers(await getTodoUsers(result.id));
  const [todo] = await getTodos(userId, result.listId, result.id);
  return c.json(todo, HttpStatusCodes.OK);
};
