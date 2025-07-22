import { z } from "zod";

const listUserInputs = {
  create: z.object({
    listId: z.string(),
    userId: z.string().optional(),
  }),
  remove: z.object({ id: z.string() }),
  accept: z.object({ id: z.string() }),
  getAllForList: z.object({ listId: z.string() }),
  getAllPending: z.any(),
};

export default listUserInputs;
