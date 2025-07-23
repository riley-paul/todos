import { z } from "zod";

const listUserInputs = {
  create: z.object({
    listId: z.string(),
    userId: z.string().optional(),
  }),
  remove: z.object({ listId: z.string(), userId: z.string().optional() }),
  accept: z.object({ id: z.string() }),
  getAllForList: z.object({ listId: z.string() }),
  getAllPending: z.any(),
};

export default listUserInputs;
