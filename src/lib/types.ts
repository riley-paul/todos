import type { User, Todo, SharedTag } from "astro:db";

export type TodoSelect = typeof Todo.$inferSelect;
export type TodoInsert = typeof Todo.$inferInsert;
export type UserSelect = typeof User.$inferSelect;
export type SharedTagSelect = typeof SharedTag.$inferSelect;

export type TableUnion = typeof User | typeof Todo;
