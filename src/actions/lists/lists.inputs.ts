import { zListInsert, zListName } from "@/lib/types";
import { z } from "astro/zod";

const listInputs = {
  getAll: z.any(),
  get: z.object({ id: z.string() }),
  update: z.object({
    id: z.string(),
    data: zListInsert.partial(),
  }),
  create: z.object({ name: zListName }),
  remove: z.object({ id: z.string() }),
};
export default listInputs;
