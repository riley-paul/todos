import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

const timeStamps = {
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
};

export const User = sqliteTable("user", {
  id,
  email: text().notNull().unique(),
  name: text().notNull(),
  avatarUrl: text(),

  googleId: text().unique(),
  githubId: integer().unique(),
  githubUsername: text().unique(),
  ...timeStamps,
});
export const zUserSelect = createSelectSchema(User).pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
});
export const zUserInsert = createInsertSchema(User);
export type UserInsert = z.infer<typeof zUserInsert>;
export type UserSelect = z.infer<typeof zUserSelect>;

export const UserSession = sqliteTable("userSession", {
  id,
  userId,
  expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
  ...timeStamps,
});

export const List = sqliteTable("list", {
  id,
  userId,
  name: text().notNull(),
  ...timeStamps,
});
export const zListSelect = createSelectSchema(List);
export const zListInsert = createInsertSchema(List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListInsert = z.infer<typeof zListInsert>;

export const ListShare = sqliteTable("listShare", {
  id,
  listId: text()
    .notNull()
    .references(() => List.id, { onDelete: "cascade" }),
  userId,
  sharedUserId: text()
    .notNull()
    .references(() => User.id),
  isPending: integer({ mode: "boolean" }).notNull().default(true),
  ...timeStamps,
});
export const zListShareSelect = createSelectSchema(ListShare);
export const zListShareInsert = createInsertSchema(ListShare);
export type ListShareSelect = z.infer<typeof zListShareSelect>;
export type ListShareInsert = z.infer<typeof zListShareInsert>;

export const Todo = sqliteTable("todo", {
  id,
  userId,
  listId: text().references(() => List.id, { onDelete: "cascade" }),
  sortOrder: integer().notNull().default(0),
  text: text().notNull(),
  isCompleted: integer({ mode: "boolean" }).notNull().default(false),
  ...timeStamps,
});
export const zTodoSelect = createSelectSchema(Todo)
  .pick({
    id: true,
    text: true,
    isCompleted: true,
  })
  .extend({
    author: zUserSelect,
    isAuthor: z.boolean(),
    list: z.object({ id: z.string(), name: z.string() }).nullable(),
  });
export const zTodoInsert = createInsertSchema(Todo)
  .pick({
    text: true,
    listId: true,
  })
  .extend({
    text: createInsertSchema(Todo).shape.text.trim().min(1),
    listId: createInsertSchema(Todo).shape.listId.transform((v) =>
      v === "all" ? null : v,
    ),
  });
export type TodoInsert = z.infer<typeof zTodoInsert>;
export type TodoSelect = z.infer<typeof zTodoSelect>;
