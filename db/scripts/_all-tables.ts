import { User, UserSession, Todo, ListShare, List } from "astro:db";

export const allTables = [
  { table: User, name: "user" },
  { table: UserSession, name: "user_session" },
  { table: List, name: "list" },
  { table: Todo, name: "todo" },
  { table: ListShare, name: "list_share" },
];

export type AnyTable = (typeof allTables)[number];
