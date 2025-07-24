import { z } from "zod";

const listUserInputs = {
  create: z.object({
    listId: z.string(),
    userId: z.string().optional(),
  }),
  remove: z.object({ listId: z.string(), userId: z.string().optional() }),
  accept: z.object({ listId: z.string() }),
  getAllForList: z.object({ listId: z.string() }),
};

export default listUserInputs;
