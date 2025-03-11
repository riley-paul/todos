import type { ListRoute } from "./todos.routes";
import db from "@/db";
import { Todo } from "@/db/schema";
import type { AppRouteHandler } from "@/server/lib/types";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const todos = await db.select().from(Todo);
  return c.json(todos);
};
