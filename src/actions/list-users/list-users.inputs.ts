import { zListUserInsert } from "@/lib/types";
import { z } from "astro/zod";

export const create = z.object({ data: zListUserInsert });

export const remove = z.object({ id: z.string() });

export const update = z.object({
  id: z.string(),
  data: zListUserInsert.partial(),
});

export const populate = z.any();
