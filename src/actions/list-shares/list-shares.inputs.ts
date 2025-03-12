import { z } from "zod";

export const create = z.object({
  email: z.string().email(),
  listId: z.string(),
});
export const remove = z.object({ id: z.string() });
export const leave = z.object({ listId: z.string() });
export const accept = z.object({ id: z.string() });
export const getAllPending = z.any();
