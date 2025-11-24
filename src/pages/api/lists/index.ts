import { createDb } from "@/db";
import { List } from "@/db/schema";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (c) => {
  const db = createDb(c.locals.runtime.env);
  const lists = await db.select().from(List);
  return new Response(JSON.stringify(lists), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
