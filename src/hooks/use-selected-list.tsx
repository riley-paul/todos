import { useQueryState } from "nuqs";

export default function useSelectedList() {
  const [selectedList, setSelectedList] = useQueryState("list");
  return { selectedList, setSelectedList };
}
