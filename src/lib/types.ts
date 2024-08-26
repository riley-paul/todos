import type { User, Todo } from "astro:db";

export type TodoSelect = typeof Todo.$inferSelect;
export type TodoInsert = typeof Todo.$inferInsert;
export type UserSelect = typeof User.$inferSelect;

export type TableUnion = typeof User | typeof Todo;
