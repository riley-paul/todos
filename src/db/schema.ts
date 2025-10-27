import type { ListOrder } from "@/lib/types";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

const listId = text()
  .notNull()
  .references(() => List.id, { onDelete: "cascade" });

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

  settingGroupCompleted: integer({ mode: "boolean" }).notNull().default(true),
  settingListOrder: text({ mode: "json" })
    .$type<ListOrder>()
    .notNull()
    .default({}),
  settingListHiddenIndex: integer(),

  ...timeStamps,
});

export const UserSession = sqliteTable(
  "userSession",
  {
    id,
    userId,
    expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
    ...timeStamps,
  },
  (table) => [index("user_id_idx").on(table.userId)],
);

export const List = sqliteTable("list", {
  id,
  name: text().notNull(),
  ...timeStamps,
});

export const ListUser = sqliteTable("listUser", {
  id,
  userId,
  listId,
  isPending: integer({ mode: "boolean" }).default(true).notNull(),
});

export const Todo = sqliteTable(
  "todo",
  {
    id,
    userId,
    listId,
    sortOrder: integer().default(0).notNull(),
    text: text().notNull(),
    isCompleted: integer({ mode: "boolean" }).default(false).notNull(),
    ...timeStamps,
  },
  (table) => [
    index("todo_list_id_idx").on(table.listId),
    index("todo_user_id_idx").on(table.userId),
  ],
);
