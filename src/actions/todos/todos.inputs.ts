import { zTodoInsert } from "@/lib/types";
import { z } from "astro/zod";

const todoInputs = {
  get: z.object({ listId: z.string() }),
  create: z.object({ data: zTodoInsert }),
  update: z.object({ id: z.string(), data: zTodoInsert.partial() }),
  remove: z.object({ id: z.string() }),
  removeCompleted: z.object({ listId: z.string() }),
  uncheckCompleted: z.object({ listId: z.string() }),
};

export default todoInputs;
