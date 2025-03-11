import type { User, Todo, UserSelect } from "@/db/schema";

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export type ListSelect = {
  id: string;
  name: string;
  author: UserSelect;
  isAuthor: boolean;
  todoCount: number;
  shares: ListShareSelect[];
  otherUsers: UserSelect[];
};

export type ListShareSelect = {
  id: string;
  list: { id: string; name: string; author: UserSelect };
  user: UserSelect;
  isPending: boolean;
  isAuthor: boolean;
};

export type TableUnion = typeof User | typeof Todo;
export type SelectedList = string | "all" | null;
