import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import React from "react";
import { useLocation, useParams } from "react-router-dom";

export default function useTodosQuery() {
  const { pathname } = useLocation();
  const { listId } = useParams();

  const type = React.useMemo(() => {
    if (pathname === "/") return "inbox";
    if (pathname === "/all") return "all";
    if (pathname.startsWith("/list/")) return "list";
    return "inbox";
  }, [pathname]);

  React.useEffect(() => {
    console.log(listId);
  }, [listId]);

  const todosQuery = useQuery({
    queryKey: ["todos", { type, listId }],
    queryFn: () => actions.getTodos.orThrow({ type, listId }),
  });

  return todosQuery;
}
