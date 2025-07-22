import { User, Todo, List } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const zUserSelect = createSelectSchema(User).pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});
export const zUserSelectWithSettings = createSelectSchema(User).pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  settingGroupCompleted: true,
});
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserSelectWithSettings = z.infer<typeof zUserSelectWithSettings>;
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
export const zTodoSelectShallow = createSelectSchema(Todo).pick({
  id: true,
  text: true,
  listId: true,
  isCompleted: true,
});
export const zTodoInsert = createInsertSchema(Todo)
  .pick({
    listId: true,
    text: true,
    isCompleted: true,
  })
  .extend({
    listId: createInsertSchema(Todo).shape.listId.transform((v) => {
      if (v === "all") return null;
      return v;
    }),
    text: createInsertSchema(Todo).shape.text.trim().min(1),
  });
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoSelectShallow = z.infer<typeof zTodoSelectShallow>;
export type TodoInsert = z.infer<typeof zTodoInsert>;

export const zListSelect = createSelectSchema(List)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    author: zUserSelect,
    isAuthor: z.boolean(),
    todoCount: z.number(),
    otherUsers: z.array(zUserSelect),
  });
export const zListSelectShallow = createSelectSchema(List).pick({
  id: true,
  name: true,
});
export const zListInsert = createInsertSchema(List)
  .pick({ name: true })
  .extend({ name: createInsertSchema(List).shape.name.trim().min(1) });
export type ListSelect = z.infer<typeof zListSelect>;
export type ListSelectShallow = z.infer<typeof zListSelectShallow>;
export type ListInsert = z.infer<typeof zListInsert>;

export type SelectedList = string | "all" | null;
