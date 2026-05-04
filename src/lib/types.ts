import { createSelectSchema } from "drizzle-zod";
import * as tables from "@/db/schema";
import { z } from "astro/zod";

export const zListName = z.string().trim().min(1).max(256);

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zTodoSelect = createSelectSchema(tables.Todo).pick({
  id: true,
  text: true,
  isCompleted: true,
  listId: true,
});
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoSelectDetails = z.infer<typeof zTodoSelect> & {
  author: UserSelect;
  list: Pick<ListSelect, "id" | "name">;
};

export const zListUserSelect = createSelectSchema(tables.ListUser);
export type ListUserSelect = z.infer<typeof zListUserSelect>;

export const zListSelect = createSelectSchema(tables.List).pick({
  id: true,
  name: true,
});
export type ListSelect = z.infer<typeof zListSelect>;
export type ListSelectDetails = z.infer<typeof zListSelect> & {
  todoCount: number;
  otherUsers: UserSelect[];
  isPending: boolean;
  show: boolean;
  order: number;
};

export const zUserSettings = createSelectSchema(tables.User)
  .pick({ settingGroupCompleted: true })
  .partial();
export type UserSettings = z.infer<typeof zUserSettings>;
export const zUserSelect = createSelectSchema(tables.User)
  .pick({
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
  })
  .extend(zUserSettings.shape);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserSelectListDetails = z.infer<typeof zUserSelect> & {
  isPending: boolean;
};
