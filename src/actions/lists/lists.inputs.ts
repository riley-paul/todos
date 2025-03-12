import { zListInsert } from "@/lib/types";
import { z } from "zod";

export const getAll = z.any();
export const update = z.object({
  id: z.string(),
  data: zListInsert.partial(),
});
export const create = z.object({ data: zListInsert });
export const remove = z.object({ id: z.string() });
