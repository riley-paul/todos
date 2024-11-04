import { atom } from "jotai";

export type SelectedList = string | "all" | null;

export const listsEditorOpenAtom = atom(false);
