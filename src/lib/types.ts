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
  user: UserSelect;
};
export type ListShareInsert = typeof ListShare.$inferInsert;

export type ListInsert = typeof List.$inferInsert;

export type ListSelect = {
  id: string;
  name: string;
  author: {
    id: string;
    name: string;
  } | null;
  isAuthor: boolean;
  todoCount: number;
};

export type TableUnion = typeof User | typeof Todo;
