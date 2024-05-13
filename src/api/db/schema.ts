import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const todosTable = sqliteTable("todo", {
  id: text("id").$defaultFn(uuid).primaryKey().unique(),
  text: text("text").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .default(false)
    .notNull(),
  isDeleted: integer("is_deleted", { mode: "boolean" })
    .default(false)
    .notNull(),
  userId: text("user_id", { length: 255 }).notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Todo = typeof todosTable.$inferSelect;
export type TodoInsert = typeof todosTable.$inferInsert;
export const todoSchema = createSelectSchema(todosTable);
export const todoInsertSchema = createInsertSchema(todosTable);

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  githubId: integer("github_id"),
  username: text("username"),
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export type Session = typeof sessionTable.$inferSelect;
