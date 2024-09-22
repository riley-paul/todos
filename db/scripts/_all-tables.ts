import { User, UserSession, Todo, SharedTag } from "astro:db";

export const allTables = [
  { table: User, name: "user" },
  { table: UserSession, name: "user_session" },
  { table: Todo, name: "todo" },
  { table: SharedTag, name: "shared_tags" },
];

export type AnyTable = (typeof allTables)[number];
