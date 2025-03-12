import { zListInsert } from "@/lib/types";
import { z } from "zod";

const listInputs = {
  getAll: z.any(),
  update: z.object({
    id: z.string(),
    data: zListInsert.partial(),
  }),
  create: z.object({ data: zListInsert }),
  remove: z.object({ id: z.string() }),
};
export default listInputs;
