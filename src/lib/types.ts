import { User, Todo, List, ListShare } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const zUserSelect = createSelectSchema(User).pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zTodoSelect = createSelectSchema(Todo)
  .pick({
    id: true,
    text: true,
    isCompleted: true,
  })
  .extend({
    author: zUserSelect,
    isAuthor: z.boolean(),
    list: createSelectSchema(List).pick({ id: true, name: true }).nullable(),
  });
export const zTodoInsert = createInsertSchema(Todo);
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoInsert = z.infer<typeof zTodoInsert>;

export const zListShareSelect = createSelectSchema(ListShare)
  .pick({
    id: true,
    isPending: true,
  })
  .extend({
    list: createSelectSchema(List)
      .pick({ id: true, name: true })
      .extend({ author: zUserSelect }),
    user: zUserSelect,
    isAuthor: z.boolean(),
  });
export const zListShareInsert = createInsertSchema(ListShare);
export type ListShareSelect = z.infer<typeof zListShareSelect>;
export type ListShareInsert = z.infer<typeof zListShareInsert>;

export const zListSelect = createSelectSchema(List)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    author: zUserSelect,
    isAuthor: z.boolean(),
    todoCount: z.number(),
    shares: z.array(zListShareSelect),
    otherUsers: z.array(zUserSelect),
  });
export const zListInsert = createInsertSchema(List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListInsert = z.infer<typeof zListInsert>;

export type SelectedList = string | "all" | null;
