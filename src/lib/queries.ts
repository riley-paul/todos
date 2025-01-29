import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";
import type { SelectedList } from "./types";

export const todosQueryOptions = (listId: SelectedList) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.get.orThrow({ listId }),
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getMe.orThrow,
});

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: actions.lists.get.orThrow,
});

export const pendingSharesQueryOptions = queryOptions({
  queryKey: ["pendingShares"],
  queryFn: actions.listShares.getPending.orThrow,
});
