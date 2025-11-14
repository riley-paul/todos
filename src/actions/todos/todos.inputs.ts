import { zTodoInsert } from "@/lib/types";
import { z } from "astro/zod";

export const create = z.object({ data: zTodoInsert });

export const update = z.object({ id: z.string(), data: zTodoInsert.partial() });

export const remove = z.object({ id: z.string() });

export const populate = z.any();
