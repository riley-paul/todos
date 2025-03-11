import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";
import type { SelectedList } from "../types";
import client from "@/server/client";

export const todosQueryOptions = (listId: SelectedList) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () =>
      client.todos.$get({ query: { listId } }).then((res) => res.json()),
  });

export const userQueryOptions = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getMe.orThrow,
});

export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: actions.lists.get.orThrow,
  select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
});

export const pendingSharesQueryOptions = queryOptions({
  queryKey: ["pendingShares"],
  queryFn: actions.listShares.getPending.orThrow,
});
