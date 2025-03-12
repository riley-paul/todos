import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

export const Todo = sqliteTable("todo", {
  id,
  userId,
  listId: text().references(() => List.id, { onDelete: "cascade" }),
  sortOrder: integer().notNull().default(0),
  text: text().notNull(),
  isCompleted: integer({ mode: "boolean" }).notNull().default(false),
  ...timeStamps,
});
