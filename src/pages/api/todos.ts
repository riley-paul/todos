import { createDb } from "@/db";
import { Todo } from "@/db/schema";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (c) => {
  const db = createDb(c.locals.runtime.env);

  const todos = await db
    .select({ id: Todo.id, text: Todo.text, isCompleted: Todo.isCompleted })
    .from(Todo)
    .limit(10);

  return new Response(JSON.stringify(todos), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
