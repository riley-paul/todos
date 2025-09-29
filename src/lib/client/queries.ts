import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";
import type { SelectedList } from "../types";

export const qTodos = (listId: SelectedList) =>
  queryOptions({
    queryKey: ["todos", listId],
    queryFn: () => actions.todos.get.orThrow({ listId }),
  });

export const qUser = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getMe.orThrow,
});

export const qUsers = (search: string) =>
  queryOptions({
    queryKey: ["users", search],
    queryFn: () => actions.users.get.orThrow({ search }),
    enabled: !!search,
  });

export const qLists = queryOptions({
  queryKey: ["lists"],
  queryFn: actions.lists.getAll.orThrow,
  select: (data) =>
    data
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned)),
});

export const qList = (listId: string | null) =>
  queryOptions({
    queryKey: ["list", listId],
    queryFn: () => actions.lists.get.orThrow({ id: listId }),
  });

export const qListShares = (listId: string) =>
  queryOptions({
    queryKey: ["listShares", listId],
    queryFn: () => actions.listUsers.getAllForList.orThrow({ listId }),
  });
