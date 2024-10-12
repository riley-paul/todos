import { atomWithStorage } from "jotai/utils";

export type SelectedList = string | undefined | null;
export const selectedListAtom = atomWithStorage<SelectedList>(
  "selectedList",
  undefined,
);
