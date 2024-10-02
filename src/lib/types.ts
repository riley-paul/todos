import type { User, Todo, SharedTag, List, ListShare } from "astro:db";

export type TodoSelect = typeof Todo.$inferSelect & {
  user: UserSelect;
  isShared: boolean;
};
export type TodoInsert = typeof Todo.$inferInsert;
export type UserSelect = typeof User.$inferSelect;
export type SharedTagSelect = typeof SharedTag.$inferSelect;
export type TagSelect = { tag: string; isShared: boolean };

export type ListShareSelect = typeof ListShare.$inferSelect & {
  sharedUser: UserSelect;
};
export type ListSelect = typeof List.$inferSelect & {
  shares: ListShareSelect[];
};

export type TableUnion = typeof User | typeof Todo;
