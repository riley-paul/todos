import { selectedListAtom } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { useAtomValue } from "jotai/react";
import React from "react";

export default function useTodosQuery() {
  const selectedList = useAtomValue(selectedListAtom);

  const type = React.useMemo(() => {
    if (selectedList === undefined) return "inbox";
    if (selectedList === "all") return "all";
    return "list";
  }, [selectedList]);

  const todosQuery = useQuery({
    queryKey: ["todos", { type, selectedList }],
    queryFn: () => actions.getTodos.orThrow({ type, listId: selectedList }),
  });

  return todosQuery;
}
