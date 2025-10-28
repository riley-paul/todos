import { zListInsert, zListName } from "@/lib/types";
import { z } from "astro/zod";

export const getAll = z.any();

export const get = z.object({ listId: z.string() });

export const update = z.object({
  id: z.string(),
  data: zListInsert.partial(),
});

export const create = z.object({ name: zListName });

export const remove = z.object({ id: z.string() });

export const updateSortShow = z.object({
  listIds: z.array(z.string()),
});
