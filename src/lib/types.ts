import type { User, Todo } from "@/db/schema";

export type UserSelect = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type TodoSelect = {
  id: string;
  text: string;
  isCompleted: boolean;
  author: UserSelect;
  isAuthor: boolean;
  list: {
    id: string;
    name: string;
  } | null;
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
