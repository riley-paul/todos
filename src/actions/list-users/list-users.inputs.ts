import { z } from "zod";

const listUserInputs = {
  create: z.object({
    listId: z.string(),
    userId: z.string().optional(),
    isAdmin: z.boolean().optional(),
  }),
  remove: z.object({
    listId: z.string(),
    userId: z.string().optional(),
  }),
  update: z.object({
    listId: z.string(),
    userId: z.string().optional(),
    isAdmin: z.boolean().optional(),
    isPending: z.boolean().optional(),
  }),
  getAllForList: z.object({
    listId: z.string(),
  }),
  getAllPending: z.any(),
};

export default listUserInputs;
