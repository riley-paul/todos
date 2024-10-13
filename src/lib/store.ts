import { atomWithStorage } from "jotai/utils";

export type SelectedList = string | "all" | null;
export const selectedListAtom = atomWithStorage<SelectedList>(
  "selectedList",
  null,
);
