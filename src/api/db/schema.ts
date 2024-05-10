import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const todos = sqliteTable("todo", {
  id: text("id").$defaultFn(uuid).primaryKey(),
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

export type Todo = typeof todos.$inferSelect;
export type TodoInsert = typeof todos.$inferInsert;
export const todoSchema = createSelectSchema(todos);
export const todoInsertSchema = createInsertSchema(todos);
