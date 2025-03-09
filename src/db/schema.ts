import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

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
    // .notNull()
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
export const zUserSelect = createSelectSchema(User);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export const UserSession = sqliteTable("userSession", {
  id,
  userId,
  expiresAt: text(),
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
export const zTodoSelect = createSelectSchema(Todo);
export const zTodoInsert = createInsertSchema(Todo);
export type TodoSelect = z.infer<typeof zTodoSelect>;
export type TodoInsert = z.infer<typeof zTodoInsert>;
