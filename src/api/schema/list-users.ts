import { z } from "astro/zod";

export const create = z.object({
  listId: z.string(),
  email: z.string(),
});

export const remove = z.object({
  listId: z.string(),
  userId: z.string().optional(),
});

export const accept = z.object({ listId: z.string() });

export const getAllForList = z.object({ listId: z.string() });
