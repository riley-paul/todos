import { atomWithStorage } from "jotai/utils";

type SelectedList = "all" | string | undefined;
export const selectedListAtom = atomWithStorage<SelectedList>(
  "selectedList",
  undefined,
);
