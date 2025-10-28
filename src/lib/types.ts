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

export const zTodoSelect = createSelectSchema(Todo)
  .pick({
    id: true,
    text: true,
    isCompleted: true,
    listId: true,
  })
  .extend({
    author: zUserSelect,
    isAuthor: z.boolean().nullable(),
    list: createSelectSchema(List).pick({ id: true, name: true }),
  });
export const zTodoInsert = createInsertSchema(Todo)
  .pick({
    listId: true,
    text: true,
    isCompleted: true,
  })
  .extend({
    text: createInsertSchema(Todo).shape.text.trim().min(1),
  });
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoInsert = z.infer<typeof zTodoInsert>;

export const zListSelect = createSelectSchema(List)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    todoCount: z.number(),
    otherUsers: z.array(zUserSelect),
    isPending: z.boolean(),
    show: z.boolean(),
    order: z.number(),
  });
export const zListSelectShallow = createSelectSchema(List)
  .pick({
    id: true,
    name: true,
  })
  .extend({ isPending: z.boolean() });
export const zListInsert = createInsertSchema(List)
  .pick({ name: true })
  .extend({ name: zListName });
export type ListSelect = z.infer<typeof zListSelect>;
export type ListSelectShallow = z.infer<typeof zListSelectShallow>;
export type ListInsert = z.infer<typeof zListInsert>;

export const zListUserInsert = createInsertSchema(ListUser);
export const zListUserSelect = createSelectSchema(ListUser)
  .pick({
    id: true,
    listId: true,
    userId: true,
    isPending: true,
  })
  .extend({
    user: zUserSelect,
    list: zListSelectShallow,
  });
export type ListUserInsert = z.infer<typeof zListUserInsert>;
export type ListUserSelect = z.infer<typeof zListUserSelect>;

export const zListOrder = z.record(z.string(), z.number());
export type ListOrder = z.infer<typeof zListOrder>;
