import { zListInsert } from "@/lib/types";
import { z } from "zod";

export const list = z.any();
export const update = z.object({
  id: z.string(),
  data: zListInsert.pick({ name: true }).partial(),
});
