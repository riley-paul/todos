import { zTodoInsert } from "@/lib/types";
import { z } from "zod";

const todoInputs = {
  get: z.object({ listId: z.string().nullable() }),
  create: z.object({ data: zTodoInsert }),
  update: z.object({ id: z.string(), data: zTodoInsert.partial() }),
  remove: z.object({ id: z.string() }),
  removeCompleted: z.object({ listId: z.string().nullable() }),
};

export default todoInputs;
