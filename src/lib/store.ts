import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export type SelectedList = string | "all" | null;
export const selectedListAtom = atomWithStorage<SelectedList>(
  "selectedList",
  null,
);

export const listsEditorOpenAtom = atom(false);
