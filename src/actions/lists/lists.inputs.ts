import { zListInsert, zListName } from "@/lib/types";
import { z } from "zod";

const listInputs = {
  getAll: z.any(),
  get: z.object({ id: z.string() }),
  update: z.object({
    id: z.string(),
    data: zListInsert.partial(),
  }),
  create: z.object({ data: zListName }),
  remove: z.object({ id: z.string() }),

  addUser: z.object({
    listId: z.string(),
    userId: z.string(),
    isAdmin: z.boolean().optional(),
  }),
  removeUser: z.object({
    listId: z.string(),
    userId: z.string(),
  }),
};
export default listInputs;
