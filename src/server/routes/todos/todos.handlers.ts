import type { CreateRoute, ListRoute } from "./todos.routes";
import db from "@/db";
import { List, ListShare, Todo, User, type TodoSelect } from "@/db/schema";
import type { AppRouteHandler } from "@/server/lib/types";
import { eq, desc } from "drizzle-orm";
import {
  filterTodos,
  getListUsers,
  getTodoUsers,
  invalidateUsers,
  isAuthorized,
} from "@/lib/server/utils";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userId = isAuthorized(c).id;
  const { listId } = c.req.valid("query");
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

  return c.json(todos);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const userId = isAuthorized(c).id;
  const data = c.req.valid("json");

  const listUsers = data.listId ? await getListUsers(data.listId) : [userId];

  if (!listUsers.includes(userId)) {
    throw new HTTPException(HttpStatusCodes.FORBIDDEN);
  }

  const [todo] = await db
    .insert(Todo)
    .values({ ...data, userId })
    .returning({ id: Todo.id, listId: Todo.listId });

  invalidateUsers(await getTodoUsers(todo.id));
  return c.json(todo);
};
