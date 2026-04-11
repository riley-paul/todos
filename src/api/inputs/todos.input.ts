import { zTodoInsert } from "@/lib/types";
import { z } from "astro/zod";

export const getAll = z.object({ listId: z.string() });

export const search = z.object({ search: z.string() });

export const create = z.object({ data: zTodoInsert });

export const update = z.object({ id: z.string(), data: zTodoInsert.partial() });

export const remove = z.object({ id: z.string() });

export const removeCompleted = z.object({ listId: z.string() });

export const uncheckCompleted = z.object({ listId: z.string() });
