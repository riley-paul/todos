import { zTodoInsert } from "@/lib/types";
import { z } from "zod";

export const get = z.object({ listId: z.string().nullable() });
export const create = z.object({ data: zTodoInsert });
export const update = z.object({ id: z.string(), data: zTodoInsert.partial() });
export const remove = z.object({ id: z.string() });
export const removeCompleted = z.object({ listId: z.string().nullable() });
