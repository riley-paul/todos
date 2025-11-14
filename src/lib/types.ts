import { User, Todo, List, ListUser } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "astro/zod";

export const zListName = z.string().trim().min(1).max(256);

export const zSettings = createSelectSchema(User).pick({
  settingGroupCompleted: true,
});

export const zUserSelect = createSelectSchema(User).pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});
export const zUserSelectWithSettings = zUserSelect.merge(zSettings);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserSelectWithSettings = z.infer<typeof zUserSelectWithSettings>;
export type UserInsert = z.infer<typeof zUserInsert>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

type OmitTimestamps<T> = Omit<T, "createdAt" | "updatedAt">;

export const zTodoSelect = createSelectSchema(Todo);
export const zTodoInsert = createInsertSchema(Todo);
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoInsert = z.infer<typeof zTodoInsert>;

export type TodoQ = OmitTimestamps<TodoSelect> & {
  author: UserSelect;
  isAuthor: boolean;
  list: {
    id: string;
    name: string;
  };
};

export const zListSelect = createSelectSchema(List);
export const zListInsert = createInsertSchema(List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListInsert = z.infer<typeof zListInsert>;

export type ListQ = OmitTimestamps<ListSelect> & {
  todoCount: number;
  isPending: boolean;
  show: boolean;
};

export const zListUserInsert = createInsertSchema(ListUser);
export const zListUserSelect = createSelectSchema(ListUser);
export type ListUserInsert = z.infer<typeof zListUserInsert>;
export type ListUserSelect = z.infer<typeof zListUserSelect>;
