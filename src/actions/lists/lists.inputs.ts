import { zListInsert } from "@/lib/types";
import { z } from "astro/zod";

export const update = z.object({
  id: z.string(),
  data: zListInsert.partial(),
});

export const create = z.object({ data: zListInsert });

export const remove = z.object({ id: z.string() });

export const populate = z.any();
