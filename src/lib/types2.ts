import { createSelectSchema } from "drizzle-zod";
import * as tables from "@/db/schema";
import type { z } from "astro/zod";

export const zTodoSelect = createSelectSchema(tables.Todo);
export type TodoSelect = z.infer<typeof zTodoSelect>;

export const zListSelect = createSelectSchema(tables.List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListSelectDetails = z.infer<typeof zListSelect> & {
  todoCount: number;
  otherUsers: UserSelect[];
  isPending: boolean;
  show: boolean;
  order: number;
};

export const zListUserSelect = createSelectSchema(tables.ListUser);
export type ListUserSelect = z.infer<typeof zListUserSelect>;
export type ListUserSelectDetails = z.infer<typeof zListUserSelect> & {
  user: UserSelect;
  list: ListSelect;
};

export const zUserSelect = createSelectSchema(tables.User);
export type UserSelect = Pick<
  z.infer<typeof zUserSelect>,
  "id" | "name" | "email" | "avatarUrl"
>;
