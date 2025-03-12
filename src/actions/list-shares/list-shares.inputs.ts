import { z } from "zod";

const listShareInputs = {
  create: z.object({
    email: z.string().email(),
    listId: z.string(),
  }),
  remove: z.object({ id: z.string() }),
  leave: z.object({ listId: z.string() }),
  accept: z.object({ id: z.string() }),
  getAllPending: z.any(),
};
export default listShareInputs;
