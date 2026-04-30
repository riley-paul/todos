import { createSelectSchema } from "drizzle-zod";
import * as tables from "@/db/schema";
import type { z } from "astro/zod";

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zTodoSelect = createSelectSchema(tables.Todo);
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoSelectDetails = z.infer<typeof zTodoSelect> & {
  author: UserSelect;
  list: Pick<ListSelect, "id" | "name">;
};

export const zListSelect = createSelectSchema(tables.List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListSelectDetails = z.infer<typeof zListSelect> & {
  todoCount: number;
  isPending: boolean;
  show: boolean;
  order: number;
};

export const zListUserSelect = createSelectSchema(tables.ListUser);
export type ListUserSelect = z.infer<typeof zListUserSelect>;

export const zUserSelect = createSelectSchema(tables.User).pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserSelectListDetails = z.infer<typeof zUserSelect> & {
  isPending: boolean;
};
