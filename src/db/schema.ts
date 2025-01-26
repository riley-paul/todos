import * as t from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

const id = t.text("id").primaryKey().$defaultFn(uuid);

const timeStamps = {
  createdAt: t.text("created_at").$defaultFn(() => new Date().toISOString()),
  updatedAt: t.text("updated_at").$onUpdateFn(() => new Date().toISOString()),
};

const userId = t
  .text("user_id")
  .notNull()
  .references(() => usersTable.id);

export const usersTable = t.sqliteTable("users", {
  id,
  email: t.text("email").unique().notNull(),

  githubId: t.integer("github_id").unique(),
  githubUsername: t.text("github_username").unique(),

  googleId: t.text("google_id").unique(),

  name: t.text("name").notNull(),
  avatarUrl: t.text("avatar_url"),

  ...timeStamps,
});

export const userSessionsTable = t.sqliteTable("user_sessions", {
  id,
  userId,
  expiresAt: t.integer("expires_at").notNull(),
  ...timeStamps,
});

export const listsTable = t.sqliteTable("lists", {
  id,
  userId,
  name: t.text("name").notNull(),
  ...timeStamps,
});

export const listSharesTable = t.sqliteTable("list_shares", {
  id,
  listId: t
    .text("list_id")
    .notNull()
    .references(() => listsTable.id),
  userId,
  sharedUserId: userId,
  isPending: t.integer("is_pending", { mode: "boolean" }).default(true),
  ...timeStamps,
});

export const todosTable = t.sqliteTable("todos", {
  id,
  userId,
  listId: t.text("list_id").references(() => listsTable.id),
  sortOrder: t.integer("sort_order").default(0),
  text: t.text("text").notNull(),
  isCompleted: t.integer("is_completed", { mode: "boolean" }).default(false),
  ...timeStamps,
});
