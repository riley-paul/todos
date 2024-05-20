import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuid } from "uuid";
import {
  integer,
  text,
} from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";


export const todosTable = sqliteTable("todo", {
  id: text("id").$defaultFn(uuid).primaryKey().unique(),
  text: text("text").notNull(),
  isCompleted: integer("is_completed", {mode: "boolean"}).default(false).notNull(),
  isDeleted: integer("is_deleted", {mode: "boolean"}).default(false).notNull(),
  userId: text("user_id", { length: 255 }).notNull(),
  createdAt: text('created_at')
  .default(sql`(CURRENT_TIMESTAMP)`)
  .notNull(),
});

export type Todo = typeof todosTable.$inferSelect;
export type TodoInsert = typeof todosTable.$inferInsert;
export const todoSchema = createSelectSchema(todosTable);
export const todoInsertSchema = createInsertSchema(todosTable);

export const userTable = sqliteTable("user", {
  id: text("id").$defaultFn(uuid).primaryKey().unique(),
  githubId: integer("github_id").unique(),
  username: text("username").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: text('created_at')
  .default(sql`(CURRENT_TIMESTAMP)`)
  .notNull(),
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text('created_at')
  .default(sql`(CURRENT_TIMESTAMP)`)
  .notNull(),
});

export type Session = typeof sessionTable.$inferSelect;
