import * as todoHandlers from "@/actions/todos/todos.handlers";
import * as todoInputs from "@/actions/todos/todos.inputs";
import type { APIRoute } from "astro";
import { getSearchParams } from "../_helpers";
import { z } from "astro/zod";

export const GET: APIRoute = async (c) => {
  const { data, error } = todoInputs.getAll.safeParse(getSearchParams(c));
  if (error) {
    return new Response(JSON.stringify({ error: z.prettifyError(error) }), {
      status: 400,
    });
  }

  try {
    const todos = await todoHandlers.getAll(data, c);
    return new Response(JSON.stringify(todos));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch todos" }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async (c) => {
  const body = await c.request.json();
  const { data, error } = todoInputs.create.safeParse(body);
  if (error) {
    return new Response(JSON.stringify({ error: z.prettifyError(error) }), {
      status: 400,
    });
  }

  try {
    const todo = await todoHandlers.create(data, c);
    return new Response(JSON.stringify(todo), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create todo" }), {
      status: 500,
    });
  }
};
