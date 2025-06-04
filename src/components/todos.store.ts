import { atom } from "jotai";

export const selectedTodoIdAtom = atom<string | null>(null);
export const editingTodoIdAtom = atom<string | null>(null);