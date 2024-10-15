import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import type { TodoSelect } from "./types";

export type SelectedList = string | "all" | null;
export const selectedListAtom = atomWithStorage<SelectedList>(
  "selectedList",
  null,
);

export const draggingTodoAtom = atom<TodoSelect | null>(null);
