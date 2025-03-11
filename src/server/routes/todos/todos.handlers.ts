import type { ListRoute } from "./todos.routes";
import db from "@/db";
import { List, ListShare, Todo, User, type TodoSelect } from "@/db/schema";
import type { AppRouteHandler } from "@/server/lib/types";
import { eq, desc } from "drizzle-orm";
import { filterTodos, isAuthorized } from "@/lib/server/utils";

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
