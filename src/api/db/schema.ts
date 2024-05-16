import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuid } from "uuid";
import {
  boolean,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `todos_${name}`);

export const todosTable = pgTable("todo", {
  id: varchar("id").$defaultFn(uuid).primaryKey().unique(),
  text: varchar("text").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Todo = typeof todosTable.$inferSelect;
export type TodoInsert = typeof todosTable.$inferInsert;
export const todoSchema = createSelectSchema(todosTable);
export const todoInsertSchema = createInsertSchema(todosTable);

export const userTable = pgTable("user", {
  id: varchar("id").$defaultFn(uuid).primaryKey().unique(),
  githubId: integer("github_id").unique(),
  username: varchar("username").notNull(),
  name: varchar("name").notNull(),
  avatarUrl: varchar("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof userTable.$inferSelect;

export const sessionTable = pgTable("user_session", {
  id: varchar("id").notNull().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Session = typeof sessionTable.$inferSelect;
