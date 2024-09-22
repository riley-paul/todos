import { User, UserSession, Todo } from "astro:db";

export const allTables = [
  { table: User, name: "user" },
  { table: UserSession, name: "user_session" },
  { table: Todo, name: "todo" },
];

export type AnyTable = (typeof allTables)[number];
