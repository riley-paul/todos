import { z } from "zod";

export const userSelectSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
});
export type UserSelect = z.infer<typeof userSelectSchema>;

export const todoSelectSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCompleted: z.boolean(),
  author: userSelectSchema,
  isAuthor: z.boolean(),
  list: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
});
export type TodoSelect = z.infer<typeof todoSelectSchema>;

export const listShareSelectSchema = z.object({
  id: z.string(),
  list: z.object({
    id: z.string(),
    name: z.string(),
  }),
  user: userSelectSchema,
  isPending: z.boolean(),
  isAuthor: z.boolean(),
});
export type ListShareSelect = z.infer<typeof listShareSelectSchema>;

export const listSelectSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: userSelectSchema,
  isAuthor: z.boolean(),
  todoCount: z.number(),
  shares: z.array(listShareSelectSchema),
  otherUsers: z.array(userSelectSchema),
});
export type ListSelect = z.infer<typeof listSelectSchema>;
